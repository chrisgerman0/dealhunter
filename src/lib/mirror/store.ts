/**
 * The mirrored-listing store.
 *
 * TWO DRIVERS, AND WHY THE DEFAULT ONE IS LABELLED "NOT DURABLE"
 * --------------------------------------------------------------
 * Vercel serverless has no writable persistent filesystem — `/tmp` is
 * per-instance and evaporates, and two concurrent requests can land on two
 * different instances. So "persistent store" on Vercel means an external
 * one. There are exactly two honest options and this file ships both:
 *
 *   "kv"     Upstash Redis over its REST API, used when KV_REST_API_URL and
 *            KV_REST_API_TOKEN are both set. Genuinely durable and shared
 *            across instances. This is the real answer.
 *   "memory" A per-instance Map. The default when no KV credential exists.
 *            Survives within one warm lambda and nothing more.
 *
 * The driver in use is reported by `mirrorStoreInfo()` and shown in the UI,
 * because a mirror that quietly forgets everything between requests while
 * presenting itself as a database is the exact class of lie this codebase
 * refuses elsewhere ("sample data" labelling in `live-deals.ts`). If Chris is
 * on the memory driver, the UI says the mirror is not durable yet and names
 * the two env vars that fix it.
 *
 * No third option is attempted. A local JSON file would work on this box and
 * mislead on Vercel, which is worse than not having it.
 */
import type { MirroredListing, MirrorSearchRecord, MirrorSource, MirrorStats } from "./types";

/* ------------------------------------------------------------------ *
 * Driver detection
 * ------------------------------------------------------------------ */

export type MirrorDriver = "kv" | "memory";

interface KvConfig {
  url: string;
  token: string;
}

function kvConfig(): KvConfig | null {
  const url = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

export interface MirrorStoreInfo {
  driver: MirrorDriver;
  durable: boolean;
  /** Shown verbatim in the UI. Says what is true and, when degraded, what fixes it. */
  note: string;
}

export function mirrorStoreInfo(): MirrorStoreInfo {
  if (kvConfig()) {
    return {
      driver: "kv",
      durable: true,
      note: "Durable store (Upstash Redis). Mirrored listings survive deploys and are shared across all serverless instances.",
    };
  }
  return {
    driver: "memory",
    durable: false,
    note:
      "NOT DURABLE — in-memory only. Mirrored listings live inside one serverless instance and are lost when it recycles, " +
      "so counts can appear to reset between requests. Set KV_REST_API_URL and KV_REST_API_TOKEN (Upstash Redis, free tier " +
      "is enough for this) to make the mirror persistent. Nothing else needs to change.",
  };
}

/* ------------------------------------------------------------------ *
 * Keys
 * ------------------------------------------------------------------ */

const LISTING_PREFIX = "dh:mirror:listing:";
const SEARCH_PREFIX = "dh:mirror:search:";
/** A Redis set holding every listing key, so a scan is one round trip rather than a KEYS sweep. */
const LISTING_INDEX = "dh:mirror:listing-index";
const SEARCH_INDEX = "dh:mirror:search-index";

export function mirrorKey(source: MirrorSource, sourceListingId: string): string {
  return `${source}:${sourceListingId}`;
}

/* ------------------------------------------------------------------ *
 * Upstash REST
 * ------------------------------------------------------------------ */

/**
 * One Upstash pipeline call.
 *
 * The token goes in the Authorization header and is never interpolated into a
 * URL, a log line or an error message — `kvFail()` below deliberately reports
 * only the HTTP status.
 */
async function kvPipeline(cfg: KvConfig, commands: unknown[][]): Promise<unknown[]> {
  if (commands.length === 0) return [];
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw kvFail(res.status);
  const body = (await res.json()) as Array<{ result?: unknown; error?: string }>;
  return body.map((entry) => {
    if (entry?.error) throw new Error(`Mirror store rejected a command: ${entry.error}`);
    return entry?.result;
  });
}

function kvFail(status: number): Error {
  return new Error(
    `Mirror store returned HTTP ${status}. Check KV_REST_API_URL / KV_REST_API_TOKEN are the Upstash REST pair ` +
      `(not the redis:// connection string).`
  );
}

/* ------------------------------------------------------------------ *
 * The memory driver's backing maps
 * ------------------------------------------------------------------ */

const memListings = new Map<string, MirroredListing>();
const memSearches = new Map<string, MirrorSearchRecord>();

/* ------------------------------------------------------------------ *
 * Read
 * ------------------------------------------------------------------ */

export async function getAllMirroredListings(): Promise<MirroredListing[]> {
  const cfg = kvConfig();
  if (!cfg) return Array.from(memListings.values());

  const [keys] = (await kvPipeline(cfg, [["SMEMBERS", LISTING_INDEX]])) as [string[] | null];
  const ids = Array.isArray(keys) ? keys : [];
  if (ids.length === 0) return [];

  // MGET in chunks — a single command with thousands of keys can exceed the
  // REST body limit, and a partial read must not look like an empty mirror.
  const out: MirroredListing[] = [];
  const CHUNK = 256;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    const [values] = (await kvPipeline(cfg, [
      ["MGET", ...chunk.map((k) => `${LISTING_PREFIX}${k}`)],
    ])) as [Array<string | null>];
    for (const raw of values ?? []) {
      if (typeof raw !== "string") continue;
      try {
        out.push(JSON.parse(raw) as MirroredListing);
      } catch {
        // A single corrupt row must not take down the whole mirror read.
      }
    }
  }
  return out;
}

export async function getMirrorSearches(): Promise<MirrorSearchRecord[]> {
  const cfg = kvConfig();
  if (!cfg) return Array.from(memSearches.values());

  const [keys] = (await kvPipeline(cfg, [["SMEMBERS", SEARCH_INDEX]])) as [string[] | null];
  const ids = Array.isArray(keys) ? keys : [];
  if (ids.length === 0) return [];
  const [values] = (await kvPipeline(cfg, [
    ["MGET", ...ids.map((k) => `${SEARCH_PREFIX}${k}`)],
  ])) as [Array<string | null>];
  const out: MirrorSearchRecord[] = [];
  for (const raw of values ?? []) {
    if (typeof raw !== "string") continue;
    try {
      out.push(JSON.parse(raw) as MirrorSearchRecord);
    } catch {
      /* skip corrupt */
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Write
 * ------------------------------------------------------------------ */

/** What one upsert batch did, which is exactly the New/Dupes counters the UI shows. */
export interface UpsertResult {
  created: number;
  updated: number;
  /** Rows that had been marked delisted and have now come back. */
  revived: number;
  keys: string[];
}

/**
 * Upsert a batch of freshly scraped rows.
 *
 * `firstSeenAt` and `seenCount` are owned by the store, never by the caller:
 * an adapter that re-reports a row must not be able to reset its history, and
 * "first seen" is the one field a scrape can never know.
 */
export async function upsertMirroredListings(
  incoming: Array<Omit<MirroredListing, "firstSeenAt" | "lastSeenAt" | "lastRefreshedAt" | "delistedAt" | "seenCount">>,
  now = new Date().toISOString()
): Promise<UpsertResult> {
  const result: UpsertResult = { created: 0, updated: 0, revived: 0, keys: [] };
  if (incoming.length === 0) return result;

  const cfg = kvConfig();
  const existing = new Map<string, MirroredListing>();

  if (cfg) {
    const [values] = (await kvPipeline(cfg, [
      ["MGET", ...incoming.map((l) => `${LISTING_PREFIX}${l.key}`)],
    ])) as [Array<string | null>];
    (values ?? []).forEach((raw, i) => {
      if (typeof raw !== "string") return;
      try {
        existing.set(incoming[i].key, JSON.parse(raw) as MirroredListing);
      } catch {
        /* treat as absent */
      }
    });
  } else {
    for (const l of incoming) {
      const hit = memListings.get(l.key);
      if (hit) existing.set(l.key, hit);
    }
  }

  const merged: MirroredListing[] = incoming.map((fresh) => {
    const prior = existing.get(fresh.key);
    if (!prior) {
      result.created += 1;
      return {
        ...fresh,
        firstSeenAt: now,
        lastSeenAt: now,
        lastRefreshedAt: now,
        delistedAt: null,
        seenCount: 1,
      };
    }
    result.updated += 1;
    if (prior.delistedAt) result.revived += 1;
    return {
      ...fresh,
      // History belongs to the store.
      firstSeenAt: prior.firstSeenAt,
      lastSeenAt: now,
      lastRefreshedAt: now,
      // Seen again means it is listed again.
      delistedAt: null,
      seenCount: prior.seenCount + 1,
    };
  });

  result.keys = merged.map((l) => l.key);

  if (!cfg) {
    for (const l of merged) memListings.set(l.key, l);
    return result;
  }

  const commands: unknown[][] = [];
  for (const l of merged) commands.push(["SET", `${LISTING_PREFIX}${l.key}`, JSON.stringify(l)]);
  commands.push(["SADD", LISTING_INDEX, ...merged.map((l) => l.key)]);
  // Chunked so one pipeline body stays well inside Upstash's limit.
  const CHUNK = 100;
  for (let i = 0; i < commands.length; i += CHUNK) {
    await kvPipeline(cfg, commands.slice(i, i + CHUNK));
  }
  return result;
}

/**
 * Mark everything from one search that this refresh did *not* return.
 *
 * This is the only path that sets `delistedAt`, and it is scoped to a single
 * search URL on purpose: a row is only "gone" if the search that found it was
 * actually re-run and came back without it. Scoping it any wider would delist
 * rows because a *different* search was run, which is not evidence of
 * anything.
 *
 * Returns the number newly delisted.
 */
export async function markMissingAsDelisted(
  searchUrl: string,
  seenKeys: string[],
  now = new Date().toISOString()
): Promise<number> {
  const seen = new Set(seenKeys);
  const all = await getAllMirroredListings();
  const gone = all.filter((l) => l.searchUrl === searchUrl && !seen.has(l.key) && !l.delistedAt);
  if (gone.length === 0) return 0;

  const updated = gone.map((l) => ({ ...l, delistedAt: now, lastRefreshedAt: now }));
  const cfg = kvConfig();
  if (!cfg) {
    for (const l of updated) memListings.set(l.key, l);
    return updated.length;
  }
  const commands = updated.map((l) => ["SET", `${LISTING_PREFIX}${l.key}`, JSON.stringify(l)]);
  const CHUNK = 100;
  for (let i = 0; i < commands.length; i += CHUNK) {
    await kvPipeline(cfg, commands.slice(i, i + CHUNK));
  }
  return updated.length;
}

export async function recordMirrorSearch(record: MirrorSearchRecord): Promise<void> {
  const cfg = kvConfig();
  const id = encodeURIComponent(record.searchUrl);
  if (!cfg) {
    memSearches.set(record.searchUrl, record);
    return;
  }
  await kvPipeline(cfg, [
    ["SET", `${SEARCH_PREFIX}${id}`, JSON.stringify(record)],
    ["SADD", SEARCH_INDEX, id],
  ]);
}

/* ------------------------------------------------------------------ *
 * Stats
 * ------------------------------------------------------------------ */

export function statsFor(listings: MirroredListing[]): MirrorStats {
  const active = listings.filter((l) => !l.delistedAt);
  const bySource: Record<string, number> = {};
  for (const l of listings) bySource[l.source] = (bySource[l.source] ?? 0) + 1;

  const activeSeen = active.map((l) => l.lastSeenAt).sort();
  const allSeen = listings.map((l) => l.lastSeenAt).sort();

  return {
    total: listings.length,
    active: active.length,
    delisted: listings.length - active.length,
    bySource,
    oldestActiveSeenAt: activeSeen[0] ?? null,
    newestSeenAt: allSeen[allSeen.length - 1] ?? null,
  };
}
