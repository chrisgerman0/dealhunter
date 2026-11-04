/**
 * Realtor.com rental search → mirrored listings.
 *
 * ⚠️ READ THIS BEFORE DEBUGGING: NOT REACHABLE FROM THIS DEPLOYMENT YET
 * ---------------------------------------------------------------------
 * Every probe run 2026-11-04. Nothing below is inferred.
 *
 *   curl, plain, from Contabo (FR)        HTTP 429, 19 KB Kasada interstitial
 *                                         (`KP_UIDz` cookies, `x-kpsdk-ct`
 *                                         header, `x-kpsdk-r: 1-AA`)
 *   curl, full desktop-Chrome headers      HTTP 302 → follows into the same 429
 *   real headless Chromium, webdriver
 *     removed, US locale + timezone        HTTP 200 — but the page is
 *                                         "Not available in your region –
 *                                          realtor.com®". A GEO-BLOCK.
 *   via a second, unrelated egress IP      HTTP 429 / 7 KB challenge shell
 *
 * Two independent walls, in this order:
 *
 *   1. GEO. Realtor.com refuses non-US IPs outright and says so in plain
 *      English. This is not bot detection — a real browser rendering real JS
 *      gets the same page. Until the request leaves from a US IP there is
 *      nothing to parse and no amount of header work changes that.
 *   2. KASADA. Behind the geo wall sits Kasada, which wants an `x-kpsdk-ct`
 *      token produced by executing their obfuscated JS.
 *
 * Their internal GraphQL (`/frontdoor/graphql`) was probed as the cleaner
 * route. It is header-gated: with no `rdc-client-name` it answers `400
 * "missing client identification headers"`, and with
 * `rdc-client-name: RDC_WEB_SRP_FOR_RENT_PAGE` the error changes to `400
 * "Required parameter is missing"` — so the client gate opens but a further
 * credential/parameter is still required. Three `client_id` / `schema=vesta`
 * combinations were tried and all returned the same 400. Not solved, and
 * deliberately not pursued further: guessing at an undocumented auth
 * parameter is how you end up with a brittle integration that breaks silently.
 *
 * WHAT THIS FILE THEREFORE IS
 * ---------------------------
 * The complete Realtor seam — URL validation, pagination, parsing of both
 * payload shapes Realtor.com is known to serve, and mapping to
 * `MirroredListing` — sitting behind a transport that currently cannot reach
 * the site. The instant `SCRAPE_PROXY_URL` points at a US residential proxy,
 * this runs. What is NOT here is a parser validated against real Realtor
 * rows: the `__NEXT_DATA__` path below is written to their documented
 * `property_id` / `location.address` / `description.beds` schema but has
 * never seen a live payload from this box, and `realtorParseConfidence()`
 * says so to the UI rather than letting it imply otherwise.
 *
 * That asymmetry with `zillow.ts` is the honest state of things: Zillow's
 * parser was proved against 41 real records, Realtor's was not. The UI labels
 * each accordingly.
 */
import type { UnitType } from "@/types/r2r";
import type { MirroredListing } from "@/lib/mirror/types";
import { mirrorKey } from "@/lib/mirror/store";

export const REALTOR_ORIGIN = "https://www.realtor.com";

/**
 * Says out loud that this adapter's parser is untested against live data.
 * Read by the run endpoint and shown in the UI next to any Realtor row.
 */
export function realtorParseConfidence(): { proven: boolean; note: string } {
  return {
    proven: false,
    note:
      "Realtor.com parser is written to their published field schema but has never been run against a live payload — " +
      "the site geo-blocks non-US IPs and sits behind Kasada, so no real rows have been seen from this deployment. " +
      "Treat the first rows it returns as unverified and spot-check them against the listing page.",
  };
}

/* ------------------------------------------------------------------ *
 * URL handling
 * ------------------------------------------------------------------ */

export interface RealtorSearchUrl {
  baseUrl: string;
  /** e.g. "Tampa_FL". */
  locationSlug: string | null;
  label: string;
}

/**
 * Realtor's rental SRP paths are `/apartments/<City>_<ST>` and
 * `/realestateandhomes-search/<City>_<ST>/type-single-family-home`. Both are
 * accepted; anything off-host is refused so this cannot be used as a generic
 * fetcher.
 */
export function parseRealtorSearchUrl(raw: string): RealtorSearchUrl | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (!/(^|\.)realtor\.com$/i.test(u.hostname)) return null;

  // Strip their `/pg-N` pagination segment so the search has one identity.
  const path = u.pathname.replace(/\/pg-\d+\/?$/, "").replace(/\/+$/, "");
  const segments = path.split("/").filter(Boolean);
  const slug = segments.find((s) => /^[A-Za-z-]+_[A-Za-z]{2}$/.test(s)) ?? null;
  return {
    baseUrl: `${REALTOR_ORIGIN}${path}`,
    locationSlug: slug,
    label: segments.join("/") || "realtor",
  };
}

export function realtorPageUrl(search: RealtorSearchUrl, page: number): string {
  if (page <= 1) return search.baseUrl;
  return `${search.baseUrl}/pg-${page}`;
}

/* ------------------------------------------------------------------ *
 * The shape Realtor.com documents
 * ------------------------------------------------------------------ */

interface RdcAddress {
  line?: string | null;
  city?: string | null;
  state_code?: string | null;
  postal_code?: string | null;
  coordinate?: { lat?: number | null; lon?: number | null } | null;
}

interface RdcRow {
  property_id?: string | null;
  listing_id?: string | null;
  list_price?: number | null;
  price?: number | null;
  status?: string | null;
  permalink?: string | null;
  href?: string | null;
  description?: {
    beds?: number | null;
    baths?: number | null;
    baths_consolidated?: string | null;
    sqft?: number | null;
    type?: string | null;
    year_built?: number | null;
  } | null;
  location?: { address?: RdcAddress | null } | null;
  // Older/flatter shape, still served on some routes.
  address?: RdcAddress | null;
  primary_photo?: { href?: string | null } | null;
  photos?: Array<{ href?: string | null }> | null;
  branding?: Array<{ name?: string | null }> | null;
  advertisers?: Array<{ name?: string | null }> | null;
  tags?: string[] | null;
  list_date?: string | null;
  [key: string]: unknown;
}

/**
 * Realtor's `description.type` vocabulary → our `UnitType`.
 *
 * Their values are lowercase snake: `single_family`, `condos`, `townhomes`,
 * `multi_family`, `apartment`, `condo_townhome_rowhome_coop`. The compound
 * one is tested for `condo` first, which is why the condo test precedes the
 * townhouse test here and the order is not cosmetic.
 */
export function mapRealtorType(raw: string | null | undefined): UnitType {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("condo") || v.includes("coop")) return "condo";
  if (v.includes("town") || v.includes("rowhome")) return "townhouse";
  if (v.includes("duplex") || v.includes("multi")) return "duplex";
  if (v.includes("apartment")) return "apartment";
  if (v.includes("single_family") || v.includes("single-family") || v.includes("farm") || v.includes("mobile")) {
    return "single_family";
  }
  return "apartment";
}

/**
 * Pull rental rows out of whichever payload the page carried.
 *
 * Realtor has served both a `__NEXT_DATA__` document and a bare JSON
 * `properties` array depending on the route, so both are hunted. The search
 * is for arrays of objects carrying `property_id`, which is their stable
 * primary key across every shape.
 */
export function parseRealtorRows(html: string): RdcRow[] {
  const blocks: unknown[] = [];

  const next = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (next) {
    try {
      blocks.push(JSON.parse(next[1]));
    } catch {
      /* fall through */
    }
  }
  for (const m of Array.from(html.matchAll(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      /* not every json script is valid on its own */
    }
  }
  if (blocks.length === 0) {
    try {
      blocks.push(JSON.parse(html));
    } catch {
      /* not a bare JSON response */
    }
  }

  let best: RdcRow[] = [];
  const seen = new Set<unknown>();
  const walk = (node: unknown): void => {
    if (node == null || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      const hits = node.filter(
        (v): v is RdcRow => v != null && typeof v === "object" && "property_id" in (v as object)
      );
      if (hits.length > best.length) best = hits;
      for (const v of node) walk(v);
      return;
    }
    for (const v of Object.values(node as Record<string, unknown>)) {
      if (typeof v === "string" && v.length > 200 && v.includes('"property_id"')) {
        try {
          walk(JSON.parse(v));
        } catch {
          /* not JSON */
        }
      }
      walk(v);
    }
  };
  for (const b of blocks) walk(b);
  return best;
}

export function realtorRowToMirrored(
  row: RdcRow,
  ctx: { searchUrl: string; market: string | null }
): Omit<MirroredListing, "firstSeenAt" | "lastSeenAt" | "lastRefreshedAt" | "delistedAt" | "seenCount"> | null {
  const id = String(row.property_id ?? row.listing_id ?? "").trim();
  if (!id) return null;

  const addr = row.location?.address ?? row.address ?? {};
  const street = (addr.line ?? "").trim();
  if (!street) return null;

  const d = row.description ?? {};
  const lat = addr.coordinate?.lat ?? null;
  const lon = addr.coordinate?.lon ?? null;

  const baths =
    d.baths ??
    (d.baths_consolidated ? Number.parseFloat(d.baths_consolidated.replace(/[^\d.]/g, "")) : null);

  const photos = [
    row.primary_photo?.href,
    ...(row.photos ?? []).map((p) => p?.href),
  ].filter((h): h is string => typeof h === "string" && h.length > 0);

  const agent =
    (row.advertisers ?? []).map((a) => a?.name).find((n): n is string => Boolean(n)) ??
    (row.branding ?? []).map((b) => b?.name).find((n): n is string => Boolean(n)) ??
    null;

  const unitType = mapRealtorType(d.type);
  const permalink = row.permalink ?? row.href ?? "";

  return {
    key: mirrorKey("realtor", id),
    source: "realtor",
    sourceListingId: id,
    address: street,
    city: (addr.city ?? "").trim(),
    state: (addr.state_code ?? "").trim(),
    zip: (addr.postal_code ?? "").trim(),
    coords: typeof lat === "number" && typeof lon === "number" ? { lat, lng: lon } : null,
    rent: row.list_price ?? row.price ?? null,
    beds: d.beds ?? null,
    baths: Number.isFinite(baths as number) ? (baths as number) : null,
    sqft: d.sqft ?? null,
    unitType,
    rawHomeType: d.type ?? null,
    isApartmentComplex: unitType === "apartment",
    listingUrl: permalink.startsWith("http")
      ? permalink
      : permalink
        ? `${REALTOR_ORIGIN}/realestateandhomes-detail/${permalink.replace(/^\/+/, "")}`
        : "",
    photos: photos.slice(0, 8),
    agentName: agent,
    tags: (row.tags ?? []).filter((t): t is string => typeof t === "string").slice(0, 6),
    searchUrl: ctx.searchUrl,
    market: ctx.market,
  };
}

/**
 * Only for-rent rows.
 *
 * Realtor's `status` is `for_rent` on rental SRPs and `for_sale` elsewhere.
 * Same hazard Zillow's `/rent-condos/` URL demonstrated for real — a
 * sale-priced row mirrored as a rent figure would grade a fantasy deal — so
 * the same gate applies here pre-emptively.
 */
function isRentalRow(row: RdcRow): boolean {
  const status = (row.status ?? "").toLowerCase();
  if (!status) return true;
  return status.includes("rent");
}

export function parseRealtorPage(
  html: string,
  ctx: { searchUrl: string; market: string | null }
): {
  listings: Array<Omit<MirroredListing, "firstSeenAt" | "lastSeenAt" | "lastRefreshedAt" | "delistedAt" | "seenCount">>;
  rawRowCount: number;
  rejectedForSale: number;
} {
  const rows = parseRealtorRows(html);
  const rentals = rows.filter(isRentalRow);
  const listings = rentals
    .map((r) => realtorRowToMirrored(r, ctx))
    .filter(
      (
        l
      ): l is Omit<
        MirroredListing,
        "firstSeenAt" | "lastSeenAt" | "lastRefreshedAt" | "delistedAt" | "seenCount"
      > => l != null
    );
  return { listings, rawRowCount: rows.length, rejectedForSale: rows.length - rentals.length };
}
