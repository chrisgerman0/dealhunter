/**
 * Zillow rental search → mirrored listings.
 *
 * WHAT WAS PROVED, 2026-11-04, AND HOW
 * ------------------------------------
 * A real Zillow SRP was fetched and parsed end to end. The record count and
 * field set below are measured, not assumed:
 *
 *   https://www.zillow.com/tampa-fl/rent-houses/
 *     → HTTP 200, 638 KB, `__NEXT_DATA__` present
 *     → 41 rows at props.pageProps.searchPageState.cat1.searchResults.listResults
 *     → homeType distribution: SINGLE_FAMILY 41/41, isBuilding false 41/41
 *     → searchList.totalResultCount 977, totalPages 20
 *     → sample row: zpid 466234341 · "$1,999/mo" · unformattedPrice 1999 ·
 *       "1112 E 142nd Ave House 1114" · 33613 · 3 bed · 1 bath · 1560 sqft ·
 *       lat 28.076136 / lng -82.449234
 *
 *   https://www.zillow.com/tampa-fl/rentals/  (the bare rentals URL)
 *     → 41 rows, isBuilding TRUE on 41/41, no hdpData, no top-level price
 *
 * That second line is the single most important finding for R2R and it drives
 * `isApartmentComplex` below. Zillow's default rentals URL is almost entirely
 * apartment *buildings*: a building row has no price, beds or baths of its
 * own — only a `units[]` array of "$1,567+ / 1 bed" teasers — and is a
 * managed complex whose lease bans subletting. Those rows are mirrored (so
 * the dedupe and the counters stay honest) but flagged, so Explore can
 * exclude them. `/rent-houses/` is the URL shape that returns actual
 * single-family homes with real numbers, and it is what Chris should paste.
 *
 * THE BLOCK, STATED PLAINLY
 * -------------------------
 * From this box (Contabo, France, `hosting=true`) Zillow returns HTTP 403
 * with a PerimeterX `px-captcha` body for every URL, every header set, and
 * also for real headless Chromium with `navigator.webdriver` removed. The
 * same request from a different egress IP returns 200 and the full payload
 * with no JavaScript executed at all.
 *
 * So this is IP reputation, not fingerprinting. A headless browser is not the
 * fix. The fix is egress, which is `transport.ts`'s job — and `detectBlock()`
 * below exists so the UI says "blocked by PerimeterX, needs a different IP"
 * instead of "0 listings found".
 *
 * ROBOTS.TXT
 * ----------
 * `https://www.zillow.com/robots.txt` disallows `/search/`, `/homes/*_rb/`
 * query forms and the GraphQL endpoints. This adapter requests only the
 * canonical city path shapes (`/{city}-{st}/rent-houses/`, `.../2_p/`) that
 * Zillow itself links and sitemaps, sends no query string, and never touches
 * the GraphQL or `/async-create-search-page-state` endpoints its own frontend
 * uses. The ToS prohibits automated access regardless — the same unresolved
 * conflict documented at length in `apartmentguide.ts`, which Chris has been
 * told about twice and has reaffirmed. Mitigation is technical: bounded
 * pages, real delays, no login, no paid-content bypass, no attempt to solve
 * or evade the PerimeterX challenge itself.
 */
import type { UnitType } from "@/types/r2r";
import type { MirroredListing } from "@/lib/mirror/types";
import { mirrorKey } from "@/lib/mirror/store";

export const ZILLOW_ORIGIN = "https://www.zillow.com";

/* ------------------------------------------------------------------ *
 * The shape Zillow actually returns
 * ------------------------------------------------------------------ */

interface ZHomeInfo {
  homeType?: string | null;
  livingArea?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  price?: number | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  streetAddress?: string | null;
}

interface ZUnit {
  price?: string | null;
  beds?: string | null;
  roomForRent?: boolean | null;
}

interface ZRow {
  zpid?: string | number | null;
  id?: string | null;
  price?: string | null;
  unformattedPrice?: number | null;
  address?: string | null;
  addressStreet?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZipcode?: string | null;
  beds?: number | null;
  baths?: number | null;
  area?: number | null;
  latLong?: { latitude?: number | null; longitude?: number | null } | null;
  statusType?: string | null;
  statusText?: string | null;
  detailUrl?: string | null;
  imgSrc?: string | null;
  isBuilding?: boolean | null;
  buildingName?: string | null;
  units?: ZUnit[] | null;
  brokerName?: string | null;
  hdpData?: { homeInfo?: ZHomeInfo | null } | null;
  listCardRecommendation?: {
    flexFieldRecommendations?: Array<{ displayString?: string | null }> | null;
  } | null;
  carouselPhotosComposable?: { baseUrl?: string | null } | null;
  availabilityCount?: number | null;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ *
 * URL handling
 * ------------------------------------------------------------------ */

export interface ZillowSearchUrl {
  /** Normalised, page-1 form — the identity of the search. */
  baseUrl: string;
  /** e.g. "tampa-fl". Used to attribute a market. */
  citySlug: string | null;
  label: string;
}

/**
 * Validate and normalise a pasted Zillow search URL.
 *
 * Strips any `/N_p/` page segment so the same search pasted on page 3 is the
 * same search, and refuses anything that is not a zillow.com URL — the run
 * endpoint must not become a general-purpose fetcher for arbitrary hosts.
 */
export function parseZillowSearchUrl(raw: string): ZillowSearchUrl | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (!/(^|\.)zillow\.com$/i.test(u.hostname)) return null;

  const path = u.pathname.replace(/\/(\d+)_p\/?$/, "/").replace(/\/+$/, "/");
  const citySlug = path.split("/").filter(Boolean)[0] ?? null;
  return {
    baseUrl: `${ZILLOW_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`,
    citySlug: citySlug && /^[a-z-]+-[a-z]{2}$/i.test(citySlug) ? citySlug.toLowerCase() : null,
    label: path.replace(/^\/|\/$/g, "") || "zillow",
  };
}

/** Page N of a normalised search. Zillow's own pagination shape is a path segment. */
export function zillowPageUrl(search: ZillowSearchUrl, page: number): string {
  if (page <= 1) return search.baseUrl;
  const base = search.baseUrl.endsWith("/") ? search.baseUrl : `${search.baseUrl}/`;
  return `${base}${page}_p/`;
}

/* ------------------------------------------------------------------ *
 * Block detection
 * ------------------------------------------------------------------ */

export type BlockKind = "perimeterx" | "kasada" | "geo" | "captcha" | "rate_limit";

/**
 * Name the wall rather than reporting an empty result.
 *
 * A scrape that returns zero rows because it was blocked and a scrape that
 * returns zero rows because the market is empty look identical in a counter,
 * and conflating them is how someone spends a day tuning a parser against a
 * challenge page.
 */
export function detectBlock(
  status: number,
  body: string
): { kind: BlockKind; detail: string } | null {
  const head = body.slice(0, 4000);
  if (/px-captcha|PerimeterX|_pxhd/i.test(head)) {
    return {
      kind: "perimeterx",
      detail:
        "PerimeterX challenge page. This is IP reputation, not headers — the identical request succeeds from a " +
        "residential IP. A US residential proxy is required (SCRAPE_PROXY_URL).",
    };
  }
  if (/kpsdk|KP_UIDz|Kasada/i.test(head)) {
    return {
      kind: "kasada",
      detail: "Kasada challenge. Requires a solved JS token; a clean US residential IP is the prerequisite.",
    };
  }
  if (/not available in your region|isn.t currently available/i.test(head)) {
    return {
      kind: "geo",
      detail:
        "Geo-block — the site refuses non-US IPs outright. This is not a bot wall; the request must originate in the US.",
    };
  }
  if (status === 429) {
    return { kind: "rate_limit", detail: "HTTP 429. Either a genuine rate limit or the tail of a challenge redirect." };
  }
  if (/unusual traffic|are you a human|access denied|access to this page has been denied/i.test(head)) {
    return { kind: "captcha", detail: `HTTP ${status} with a human-verification interstitial.` };
  }
  if (status === 403) {
    return { kind: "captcha", detail: "HTTP 403 with no recognised challenge signature." };
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * Parsing
 * ------------------------------------------------------------------ */

export interface ZillowParseResult {
  rows: ZRow[];
  totalResultCount: number | null;
  totalPages: number | null;
}

/**
 * `__NEXT_DATA__` → the SRP rows.
 *
 * Zillow stringifies the search state in some route variants and nests it
 * plainly in others, so the known path is tried first and then a recursive
 * hunt for the largest array of objects carrying a `zpid` — including inside
 * JSON-encoded strings. Measured on the real payload: the known path hits,
 * and the fallback independently finds the same 41 rows.
 */
export function parseZillowNextData(html: string): ZillowParseResult {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return { rows: [], totalResultCount: null, totalPages: null };

  let nd: unknown;
  try {
    nd = JSON.parse(m[1]);
  } catch {
    return { rows: [], totalResultCount: null, totalPages: null };
  }

  const at = (node: unknown, key: string): unknown =>
    node != null && typeof node === "object" ? (node as Record<string, unknown>)[key] : undefined;

  const cat1 = ["props", "pageProps", "searchPageState", "cat1"].reduce<unknown>(at, nd);
  const direct = ["searchResults", "listResults"].reduce<unknown>(at, cat1);
  const searchList = at(cat1, "searchList");
  const totalResultCount = numOrNull(at(searchList, "totalResultCount"));
  const totalPages = numOrNull(at(searchList, "totalPages"));

  if (Array.isArray(direct) && direct.length > 0) {
    return { rows: direct as ZRow[], totalResultCount, totalPages };
  }

  let best: ZRow[] = [];
  const seen = new Set<unknown>();
  const walk = (node: unknown): void => {
    if (node == null || typeof node !== "object" || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      const hits = node.filter(
        (v): v is ZRow => v != null && typeof v === "object" && "zpid" in (v as object)
      );
      if (hits.length > best.length) best = hits;
      for (const v of node) walk(v);
      return;
    }
    for (const v of Object.values(node as Record<string, unknown>)) {
      if (typeof v === "string" && v.length > 200 && v.includes('"zpid"')) {
        try {
          walk(JSON.parse(v));
        } catch {
          /* not JSON after all */
        }
      }
      walk(v);
    }
  };
  walk(nd);
  return { rows: best, totalResultCount, totalPages };
}

function numOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/**
 * Zillow's `homeType` → our `UnitType`.
 *
 * `APARTMENT` and the building rows both land on `"apartment"`, which the R2R
 * engine already treats as a sublet-risk unit type (see the risk note in
 * `live-deals.ts`). MANUFACTURED has no R2R analogue and is mapped to
 * `single_family` structurally while keeping `rawHomeType` so it stays
 * visible and filterable — never silently rebadged as something it is not.
 */
export function mapZillowHomeType(raw: string | null | undefined): UnitType {
  const v = (raw ?? "").toUpperCase();
  if (v.includes("CONDO")) return "condo";
  if (v.includes("TOWNHOUSE") || v.includes("TOWNHOME")) return "townhouse";
  if (v.includes("MULTI") || v.includes("DUPLEX")) return "duplex";
  if (v.includes("APARTMENT")) return "apartment";
  if (v.includes("SINGLE_FAMILY") || v.includes("HOUSE") || v.includes("MANUFACTURED")) {
    return "single_family";
  }
  return "apartment";
}

/** "$1,999/mo" / "$1,567+" → 1999 / 1567. */
function parseMoney(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseCount(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const n = Number.parseFloat(raw.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * One SRP row → one mirrored listing.
 *
 * Returns null when the row carries no usable identity. Everything else is
 * kept even if thin: the mirror's job is to record what the source said, and
 * the R2R engine downstream is what decides a row is not underwritable.
 */
export function zillowRowToMirrored(
  row: ZRow,
  ctx: { searchUrl: string; market: string | null }
): Omit<MirroredListing, "firstSeenAt" | "lastSeenAt" | "lastRefreshedAt" | "delistedAt" | "seenCount"> | null {
  const info = row.hdpData?.homeInfo ?? {};
  const isBuilding = row.isBuilding === true;

  // Building rows have a lat-long composite in `zpid` rather than a real id;
  // `lotId` is absent on some. Fall back through every identity Zillow gives
  // us before giving up, so a row is never dropped for want of a key.
  const id = String(row.zpid ?? row.id ?? row.detailUrl ?? "").trim();
  if (!id) return null;

  const street = (row.addressStreet ?? info.streetAddress ?? row.address ?? "").trim();
  if (!street) return null;

  const lat = row.latLong?.latitude ?? info.latitude ?? null;
  const lng = row.latLong?.longitude ?? info.longitude ?? null;

  // Building rows: no own price/beds. Take the cheapest unit teaser as the
  // indicative rent and record that it is a "from" figure by leaving the
  // exact-unit fields null rather than inventing a midpoint.
  const unitPrices = (row.units ?? [])
    .map((u) => parseMoney(u?.price))
    .filter((n): n is number => n != null);
  const unitBeds = (row.units ?? [])
    .map((u) => parseCount(u?.beds))
    .filter((n): n is number => n != null);

  const rent =
    row.unformattedPrice ??
    parseMoney(row.price) ??
    info.price ??
    (unitPrices.length ? Math.min(...unitPrices) : null);

  const beds = row.beds ?? info.bedrooms ?? (unitBeds.length ? Math.max(...unitBeds) : null);
  const baths = row.baths ?? info.bathrooms ?? null;
  const sqft = row.area ?? info.livingArea ?? null;

  const tags = (row.listCardRecommendation?.flexFieldRecommendations ?? [])
    .map((f) => (f?.displayString ?? "").trim())
    .filter((s) => s.length > 0)
    .slice(0, 6);
  if (isBuilding) tags.unshift("Apartment complex");
  if (row.availabilityCount && row.availabilityCount > 1) {
    tags.push(`${row.availabilityCount} units available`);
  }

  const detail = row.detailUrl ?? "";
  const listingUrl = detail.startsWith("http") ? detail : detail ? `${ZILLOW_ORIGIN}${detail}` : "";

  const rawHomeType = info.homeType ?? (isBuilding ? "APARTMENT_BUILDING" : null);

  return {
    key: mirrorKey("zillow", id),
    source: "zillow",
    sourceListingId: id,
    address: street,
    city: (row.addressCity ?? info.city ?? "").trim(),
    state: (row.addressState ?? info.state ?? "").trim(),
    zip: (row.addressZipcode ?? info.zipcode ?? "").trim(),
    coords: typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null,
    rent,
    beds,
    baths,
    sqft,
    unitType: isBuilding ? "apartment" : mapZillowHomeType(rawHomeType),
    rawHomeType,
    isApartmentComplex: isBuilding || /APARTMENT/i.test(rawHomeType ?? ""),
    listingUrl,
    photos: row.imgSrc ? [row.imgSrc] : [],
    // Zillow names the management company in `statusText` on building rows
    // and the brokerage in `brokerName` on house rows.
    agentName: (row.brokerName ?? (isBuilding ? row.buildingName ?? row.statusText : null) ?? null) || null,
    tags,
    searchUrl: ctx.searchUrl,
    market: ctx.market,
  };
}

/**
 * Is this row actually a rental?
 *
 * EARNED ITS PLACE — measured 2026-11-04. `https://www.zillow.com/tampa-fl/
 * rent-condos/` looks like a rental search and is not: it redirects to the
 * for-sale SRP and returns 41 rows with `statusType: "FOR_SALE"`, prices in
 * the hundreds of thousands. Without this gate those rows mirror as rentals
 * and a $450,000 sale price becomes a monthly rent, which would run straight
 * through the R2R engine and grade a nonsense deal "Excellent".
 *
 * So the gate is on Zillow's own `statusType`, not on the URL — a URL cannot
 * be trusted to describe what it returns. Rows whose status is absent are
 * kept: some building rows omit it, and the measured pages that do carry it
 * are unanimous (FOR_RENT 41/41 on all three rental URLs).
 */
function isRentalRow(row: ZRow): boolean {
  const status = (row.statusType ?? "").toUpperCase();
  if (!status) return true;
  return status.includes("RENT");
}

/** A whole page of HTML → mirrorable rows plus the page's own totals. */
export function parseZillowPage(
  html: string,
  ctx: { searchUrl: string; market: string | null }
): {
  listings: Array<Omit<MirroredListing, "firstSeenAt" | "lastSeenAt" | "lastRefreshedAt" | "delistedAt" | "seenCount">>;
  totalResultCount: number | null;
  totalPages: number | null;
  rawRowCount: number;
  /** Rows dropped because they were for-sale, not for-rent. Surfaced, never silent. */
  rejectedForSale: number;
} {
  const { rows, totalResultCount, totalPages } = parseZillowNextData(html);
  const rentals = rows.filter(isRentalRow);
  const listings = rentals
    .map((r) => zillowRowToMirrored(r, ctx))
    .filter(
      (
        l
      ): l is Omit<
        MirroredListing,
        "firstSeenAt" | "lastSeenAt" | "lastRefreshedAt" | "delistedAt" | "seenCount"
      > => l != null
    );
  return {
    listings,
    totalResultCount,
    totalPages,
    rawRowCount: rows.length,
    rejectedForSale: rows.length - rentals.length,
  };
}
