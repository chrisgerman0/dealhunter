/**
 * One scrape run, one page at a time.
 *
 * WHY THE CLIENT DRIVES THE LOOP INSTEAD OF THE SERVER
 * ----------------------------------------------------
 * The reference design is a long-running desktop scraper with a live log and
 * a ticking elapsed timer. This app is serverless: a Vercel function is
 * capped (30 s here) and has no durable process to hold a run in. A
 * server-side loop over 5 search URLs × 10 pages × a 3 s delay is ~150 s of
 * wall clock and would be killed mid-run, every time, with the partial result
 * lost.
 *
 * So the run lives in the browser and each page is one request:
 *
 *     client: POST /api/mirror/run { searchUrl, page, ... }   → one page
 *     server: fetch → parse → dedupe → upsert → return deltas
 *     client: append log lines, bump counters, wait the delay, next page
 *
 * This gets what the screenshot actually shows — a real elapsed timer, live
 * New/Dupes/Errors counters, a scrolling log, and the ability to stop
 * mid-run — without pretending a serverless function can run for three
 * minutes. It also means the inter-page delay is real wall-clock politeness
 * rather than a `sleep` burning paid function time.
 *
 * The cost, stated: closing the tab ends the run. Rows already mirrored are
 * kept (every page commits before it returns), so a stopped run is a partial
 * mirror, never a corrupt one.
 */
import type { FloridaMarket } from "@/types/r2r";
import type { MirroredListing, MirrorSource } from "@/lib/mirror/types";
import {
  markMissingAsDelisted,
  recordMirrorSearch,
  upsertMirroredListings,
} from "@/lib/mirror/store";
import { detectBlock, parseZillowPage, parseZillowSearchUrl, zillowPageUrl } from "./zillow";
import { parseRealtorPage, parseRealtorSearchUrl, realtorPageUrl } from "./realtor";
import { scrapeFetch } from "./transport";

/* ------------------------------------------------------------------ *
 * Search URL resolution
 * ------------------------------------------------------------------ */

export interface ResolvedSearch {
  source: MirrorSource;
  baseUrl: string;
  label: string;
  market: FloridaMarket | null;
}

/**
 * City slug → one of the ten R2R markets.
 *
 * Attribution is best-effort and explicitly nullable: a pasted search for a
 * city we do not model (say Sarasota) still mirrors fine, it just carries
 * `market: null` and is excluded from the R2R seed feed rather than being
 * forced into the nearest market's seasonality and comp profile. Guessing a
 * market would corrupt the underwriting silently, which is worse than
 * leaving the row out of Explore.
 */
const CITY_SLUG_TO_MARKET: Record<string, FloridaMarket> = {
  "kissimmee-fl": "kissimmee",
  "tampa-fl": "tampa",
  "fort-lauderdale-fl": "broward",
  "clearwater-fl": "clearwater-stpete",
  "st-petersburg-fl": "clearwater-stpete",
  "destin-fl": "destin",
  "panama-city-beach-fl": "panama-city-beach",
  "miami-beach-fl": "miami-beach",
  "orlando-fl": "orlando-city",
  "key-west-fl": "key-west",
  "naples-fl": "naples",
};

/** Realtor uses `Tampa_FL`; normalise to the Zillow-style slug before lookup. */
function marketFromRealtorSlug(slug: string | null): FloridaMarket | null {
  if (!slug) return null;
  return CITY_SLUG_TO_MARKET[slug.toLowerCase().replace(/_/g, "-")] ?? null;
}

/**
 * A pasted line → a resolved search, or null if it is not a supported host.
 *
 * Rejecting unknown hosts is a security property, not a convenience: the run
 * endpoint takes a URL from the browser and fetches it server-side, which
 * without this check is a server-side request forgery primitive pointed at
 * anything on the network.
 */
export function resolveSearchUrl(raw: string): ResolvedSearch | null {
  const z = parseZillowSearchUrl(raw);
  if (z) {
    return {
      source: "zillow",
      baseUrl: z.baseUrl,
      label: z.label,
      market: z.citySlug ? CITY_SLUG_TO_MARKET[z.citySlug] ?? null : null,
    };
  }
  const r = parseRealtorSearchUrl(raw);
  if (r) {
    return {
      source: "realtor",
      baseUrl: r.baseUrl,
      label: r.label,
      market: marketFromRealtorSlug(r.locationSlug),
    };
  }
  return null;
}

export function pageUrlFor(search: ResolvedSearch, page: number): string {
  if (search.source === "zillow") {
    return zillowPageUrl({ baseUrl: search.baseUrl, citySlug: null, label: search.label }, page);
  }
  return realtorPageUrl({ baseUrl: search.baseUrl, locationSlug: null, label: search.label }, page);
}

/* ------------------------------------------------------------------ *
 * One page
 * ------------------------------------------------------------------ */

export interface ScrapePageRequest {
  searchUrl: string;
  page: number;
  /** True on the final page of this search — triggers the delisting sweep. */
  isLastPage: boolean;
  timeoutMs?: number;
}

export interface ScrapeLogLine {
  /** ISO. The client renders the clock in the user's locale. */
  at: string;
  level: "info" | "warn" | "error";
  message: string;
}

export interface ScrapePageResult {
  ok: boolean;
  searchUrl: string;
  page: number;
  source: MirrorSource;
  market: string | null;
  /** The URL actually fetched, page segment included. */
  fetchedUrl: string;
  httpStatus: number;
  via: "direct" | "proxy";
  elapsedMs: number;

  /** Rows the source returned, before dedupe. */
  rowsFound: number;
  /** Rows that were new to the mirror. */
  created: number;
  /** Rows already mirrored — the "Dupes" counter. */
  updated: number;
  revived: number;
  rejectedForSale: number;
  /** Set on the last page only. */
  delisted: number | null;

  /** Zillow reports both; Realtor does not. */
  totalResultCount: number | null;
  totalPages: number | null;

  blocked: { kind: string; detail: string } | null;
  error: string | null;
  log: ScrapeLogLine[];
}

function line(level: ScrapeLogLine["level"], message: string): ScrapeLogLine {
  return { at: new Date().toISOString(), level, message };
}

/**
 * Fetch, parse, dedupe and commit one page.
 *
 * Never throws. Every failure mode becomes a result with `ok: false`, a named
 * reason and log lines, because the client's run loop has to be able to carry
 * on to the next page — and because a run that dies on a 403 with no
 * explanation is the thing that wastes an afternoon.
 */
export async function scrapeOnePage(req: ScrapePageRequest): Promise<ScrapePageResult> {
  const log: ScrapeLogLine[] = [];
  const search = resolveSearchUrl(req.searchUrl);

  if (!search) {
    return {
      ok: false,
      searchUrl: req.searchUrl,
      page: req.page,
      source: "zillow",
      market: null,
      fetchedUrl: req.searchUrl,
      httpStatus: 0,
      via: "direct",
      elapsedMs: 0,
      rowsFound: 0,
      created: 0,
      updated: 0,
      revived: 0,
      rejectedForSale: 0,
      delisted: null,
      totalResultCount: null,
      totalPages: null,
      blocked: null,
      error:
        "Not a supported search URL. Paste a zillow.com or realtor.com search page URL — " +
        "e.g. https://www.zillow.com/tampa-fl/rent-houses/",
      log: [line("error", `Rejected "${req.searchUrl.slice(0, 120)}" — not a Zillow or Realtor.com URL.`)],
    };
  }

  const fetchedUrl = pageUrlFor(search, req.page);
  log.push(line("info", `GET ${fetchedUrl}`));

  const res = await scrapeFetch(fetchedUrl, {
    timeoutMs: req.timeoutMs ?? 20_000,
    referer: req.page > 1 ? search.baseUrl : undefined,
  });

  const base: ScrapePageResult = {
    ok: false,
    searchUrl: search.baseUrl,
    page: req.page,
    source: search.source,
    market: search.market,
    fetchedUrl,
    httpStatus: res.status,
    via: res.via,
    elapsedMs: res.elapsedMs,
    rowsFound: 0,
    created: 0,
    updated: 0,
    revived: 0,
    rejectedForSale: 0,
    delisted: null,
    totalResultCount: null,
    totalPages: null,
    blocked: null,
    error: null,
    log,
  };

  if (res.transportError) {
    log.push(line("error", `Transport failed after ${res.elapsedMs} ms (${res.via}): ${res.transportError}`));
    await recordMirrorSearch({
      searchUrl: search.baseUrl,
      source: search.source,
      market: search.market,
      lastRefreshedAt: new Date().toISOString(),
      lastRowCount: 0,
      lastError: res.transportError,
    });
    return { ...base, error: res.transportError };
  }

  const block = detectBlock(res.status, res.body);
  if (block) {
    log.push(line("error", `HTTP ${res.status} — ${block.kind.toUpperCase()}: ${block.detail}`));
    await recordMirrorSearch({
      searchUrl: search.baseUrl,
      source: search.source,
      market: search.market,
      lastRefreshedAt: new Date().toISOString(),
      lastRowCount: 0,
      lastError: `${block.kind}: ${block.detail}`,
    });
    return { ...base, blocked: { kind: block.kind, detail: block.detail }, error: block.detail };
  }

  if (!res.ok) {
    const msg = `HTTP ${res.status} with no recognised block signature.`;
    log.push(line("error", msg));
    return { ...base, error: msg };
  }

  const ctx = { searchUrl: search.baseUrl, market: search.market };
  const parsed =
    search.source === "zillow"
      ? parseZillowPage(res.body, ctx)
      : { ...parseRealtorPage(res.body, ctx), totalResultCount: null, totalPages: null };

  log.push(
    line(
      "info",
      `HTTP ${res.status} in ${res.elapsedMs} ms (${res.via}) · ${(res.body.length / 1024).toFixed(0)} KB · ` +
        `${parsed.listings.length} listing(s) parsed` +
        (parsed.rejectedForSale > 0 ? ` · ${parsed.rejectedForSale} for-sale row(s) rejected` : "")
    )
  );

  if (parsed.rejectedForSale > 0 && parsed.listings.length === 0) {
    log.push(
      line(
        "warn",
        `Every row on this page was a FOR SALE listing, so nothing was mirrored. This URL is a sale search, not a ` +
          `rental search — check the URL.`
      )
    );
  }

  if (parsed.listings.length === 0 && parsed.rejectedForSale === 0) {
    log.push(
      line(
        "warn",
        `Page returned HTTP 200 but no listings were found in it. Either the search has no more results, or the ` +
          `page shape changed.`
      )
    );
  }

  let created = 0;
  let updated = 0;
  let revived = 0;
  if (parsed.listings.length > 0) {
    const up = await upsertMirroredListings(parsed.listings);
    created = up.created;
    updated = up.updated;
    revived = up.revived;
    log.push(
      line(
        "info",
        `Mirrored: ${created} new · ${updated} already known` + (revived > 0 ? ` · ${revived} relisted` : "")
      )
    );
  }

  await recordMirrorSearch({
    searchUrl: search.baseUrl,
    source: search.source,
    market: search.market,
    lastRefreshedAt: new Date().toISOString(),
    lastRowCount: parsed.listings.length,
    lastError: null,
  });

  return {
    ...base,
    ok: true,
    rowsFound: parsed.listings.length,
    created,
    updated,
    revived,
    rejectedForSale: parsed.rejectedForSale,
    totalResultCount: parsed.totalResultCount,
    totalPages: parsed.totalPages,
    log,
  };
}

/**
 * The delisting sweep, run once a search's pages are all done.
 *
 * Separate from `scrapeOnePage` on purpose: delisting needs the full set of
 * keys seen across *every* page of that search, which only the client (which
 * drove the loop) knows. Calling it per page would delist everything not on
 * page 1.
 *
 * Refuses to run on an empty key set. A search that was blocked on every page
 * saw nothing, and "saw nothing" must never be read as "everything is gone" —
 * that single guard is the difference between a refresh and a wipe.
 */
export async function finishSearchRefresh(
  searchUrl: string,
  seenKeys: string[]
): Promise<{ delisted: number; log: ScrapeLogLine[] }> {
  const search = resolveSearchUrl(searchUrl);
  const base = search?.baseUrl ?? searchUrl;
  if (seenKeys.length === 0) {
    return {
      delisted: 0,
      log: [
        line(
          "warn",
          `Skipped the delisting sweep for ${base} — zero rows were seen this run, so there is no evidence any ` +
            `listing went away. Nothing was marked delisted.`
        ),
      ],
    };
  }
  const delisted = await markMissingAsDelisted(base, seenKeys);
  return {
    delisted,
    log: [
      line(
        delisted > 0 ? "warn" : "info",
        delisted > 0
          ? `${delisted} previously mirrored listing(s) no longer appear in this search — marked delisted (kept, not deleted).`
          : `No previously mirrored listing disappeared from this search.`
      ),
    ],
  };
}

/** Re-export for the API route's response typing. */
export type { MirroredListing };
