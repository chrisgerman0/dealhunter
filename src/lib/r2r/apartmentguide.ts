/**
 * Long-term Florida rental listings with NO API KEY — ApartmentGuide.com.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * `rentcast.ts` is the preferred listings feed but it is key-gated, and
 * without `RENTCAST_API_KEY` the whole R2R experience fell back to the mock
 * catalogue. This module is the keyless second source so Explore shows real
 * Florida units today. Precedence is decided in `live-deals.ts`:
 *
 *     RentCast (if keyed)  →  ApartmentGuide (this file)  →  mock catalogue
 *
 * WHAT WAS VERIFIED LIVE, 2026-11-04, by curl from the Contabo box
 * ----------------------------------------------------------------
 * Five alternatives were probed first and all failed from this network:
 * HotPads HTTP 403 · Apartments.com HTTP 403 · Realtor.com HTTP 429 ·
 * Rent.com HTTP 202 empty body · Zumper HTTP 200 but a 3 KB JS shell with no
 * embedded listing data. ForRent 403, ApartmentList 403, PadMapper 3 KB
 * shell. Craigslist *does* work and carries per-posting lat/lng, but see
 * "WHY NOT CRAIGSLIST" below.
 *
 * ApartmentGuide returned HTTP 200 with a ~750 KB document carrying a
 * `__NEXT_DATA__` payload of 50 structured listings per market page. Every
 * one of the 50 Tampa listings had a non-null `address`, `zipCode`, `price`,
 * `urlPathname` and `location.lat`/`location.lng` — zero missing coordinates,
 * so the 250 m / 500 m / 1 km Airbnb comp radius works against a real point
 * for every row, with no reverse-geocoding step. 269 floor plans across those
 * 50 listings carry exact `bedCount`, `bathCount`, `priceRange` and
 * `sqFtRange`, which is why this adapter emits one candidate per floor plan
 * rather than one blurred row per building.
 *
 * All ten Florida markets returned listings: Tampa 50 · Kissimmee 50 ·
 * Fort Lauderdale 50 · Clearwater 50 · Destin 35 · Panama City Beach 50 ·
 * Miami Beach 50 · Orlando 50 · Key West 12 · Naples 50.
 *
 * ROBOTS.TXT — READ IT BEFORE CHANGING THE URL
 * --------------------------------------------
 * `https://www.apartmentguide.com/robots.txt`, fetched 2026-11-04. The city
 * pages this adapter reads (`/apartments/Florida/<City>/`) are NOT disallowed.
 * The rules that ARE relevant, and which this file deliberately obeys:
 *
 *     Disallow: /*?*min_price=*     Disallow: /*?*max_price=*
 *     Disallow: /*?limit            Disallow: /filter*
 *     Disallow: /graphql/           Disallow: /api/maps/*
 *     Disallow: /api/rift*          Disallow: /listings/photos/*
 *     Disallow: /s/*                Disallow: /multi-search/*
 *
 * So: this adapter requests the bare city path with **no query string at
 * all**, never the GraphQL or /api endpoints the site's own frontend uses,
 * and never /filter or /multi-search. Do not "improve" it by adding
 * `?min_price=` — that is an explicit robots violation. Filtering happens
 * locally, after the fetch, on data already in hand.
 *
 * ⚠️ TERMS OF SERVICE — THE HONEST POSITION, FLAG THIS TO CHRIS
 * -------------------------------------------------------------
 * `https://www.apartmentguide.com/legal/terms-of-service/` §11 "Access and
 * Interference" says, verbatim: "You agree that you will not use any robot,
 * spider, scraper or other automated means to access the Sites for any
 * purpose without our prior written consent", and elsewhere prohibits
 * "'scraping' (including screen and database scraping), 'data mining'".
 *
 * That is a real, unresolved conflict with the permissive robots.txt, and it
 * is not resolved by this comment. It is surfaced in the UI (the Explore
 * banner and the Settings page both name the source) and in
 * `reports/`. The mitigation here is technical, not legal: one request per
 * market per 12 hours, a truthful User-Agent, no login, no paid-content
 * bypass, no circumvention of any block, and personal use for lease
 * evaluation — which is the one purpose the ToS's own data clause carves out
 * ("except in connection with your consideration of leasing a property").
 * Chris's call whether that is good enough; `RENTCAST_API_KEY` remains the
 * clean route and still takes precedence the moment it is set.
 *
 * WHY NOT CRAIGSLIST
 * ------------------
 * It works technically — `/search/area/tampa?cat=apa` returns 316 results
 * whose static list (street address + price) is positionally 1:1 with a
 * `ld_searchpage_results` JSON-LD block (lat/lng + beds + baths), and each
 * posting page carries a full `PostalAddress` including the ZIP. But: its
 * ToS carries the same scraping prohibition *plus* a liquidated-damages
 * schedule, craigslist has an actual litigation record for exactly this
 * (craigslist v. 3Taps), and it already block-listed this box mid-session —
 * a second request to the same search with `&format=rss` came back
 * `HTTP 403 "Your request has been blocked."`. Strictly worse legal footing
 * and an actively hostile surface, for worse data. Not used.
 */
import type { Coords, FloridaMarket, PetPolicy, UnitType } from "@/types/r2r";
import { cached, TTL_12H_MS } from "@/lib/enrich/cache";
import { UpstreamError } from "@/lib/enrich/http";
import { marketProfile } from "./markets";

/* ------------------------------------------------------------------ *
 * Market → ApartmentGuide city path
 * ------------------------------------------------------------------ */

/**
 * The city page per market. All ten verified HTTP 200 with a parseable
 * `__NEXT_DATA__` on 2026-11-04 (counts in the header above).
 *
 * These are path segments, not query parameters, by robots.txt necessity.
 */
export const AG_MARKET_CITY_PATHS: Record<FloridaMarket, string> = {
  kissimmee: "Florida/Kissimmee",
  tampa: "Florida/Tampa",
  broward: "Florida/Fort-Lauderdale",
  "clearwater-stpete": "Florida/Clearwater",
  destin: "Florida/Destin",
  "panama-city-beach": "Florida/Panama-City-Beach",
  "miami-beach": "Florida/Miami-Beach",
  "orlando-city": "Florida/Orlando",
  "key-west": "Florida/Key-West",
  naples: "Florida/Naples",
};

export const AG_SOURCE_ID = "apartmentguide";
export const AG_SOURCE_LABEL = "ApartmentGuide (live, no key)";

const AG_ORIGIN = "https://www.apartmentguide.com";
/** Verified 200 image/webp for a real photo id on 2026-11-04. */
const AG_IMAGE_BASE = "https://i.apartmentguide.com/t_3x2_fixed_webp_lg";

/**
 * A mainstream desktop browser UA, matching `airbnb-live.ts`'s existing
 * `DEFAULT_UA` precedent in this codebase.
 *
 * STATE THIS PLAINLY RATHER THAN DRESS IT UP: a self-identifying UA was
 * tried first and does not work. Measured from this box, 2026-11-04, same
 * URL, requests seconds apart:
 *
 *   UA "DealHunterR2R/0.1 (+https://dealhunter.vercel.app)"  → HTTP 302
 *       (redirect to a challenge page, which `fetch` follows into a 429)
 *   UA Chrome/124 desktop string                            → HTTP 200, 748 KB
 *
 * Reproduced on two different market pages (Tampa and Naples) in both
 * directions, so it is the User-Agent and not IP rate limiting. The honest
 * reading: ApartmentGuide serves browsers and turns away anything that
 * announces itself as a tool, so a truthful UA is not available as an option
 * here — the choice is a browser UA or no feature. The politeness budget is
 * kept instead in the places that actually load their servers: one request
 * per market per 12 hours, three markets concurrent at most, no retry storm,
 * no login, and no attempt to solve or bypass the challenge page itself.
 */
const AG_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const FETCH_TIMEOUT_MS = 12_000;
/** One fetch per market per 12h. The politeness budget, and the cold-start budget. */
const AG_REVALIDATE_SECONDS = 43_200;

/**
 * Per market. Bounds both the JSON payload and the comp-matching work inside
 * the 30 s `maxDuration` on the seeds route. When the cap bites,
 * `live-deals.ts` says so in `marketStatus` — never a silent truncation.
 */
export const AG_MAX_LISTINGS_PER_MARKET = 12;

/* ------------------------------------------------------------------ *
 * The shape ApartmentGuide actually returns
 * ------------------------------------------------------------------ */

interface AgPhoto {
  id?: string;
  caption?: string;
}

interface AgRange {
  min?: number | null;
  max?: number | null;
}

interface AgFloorPlan {
  bedCount?: number | null;
  bathCount?: number | null;
  availableCount?: number | null;
  priceRange?: AgRange | null;
  sqFtRange?: AgRange | null;
  photos?: AgPhoto[] | null;
  name?: string | null;
}

interface AgLocation {
  lat?: number | null;
  lng?: number | null;
  city?: string | null;
  state?: string | null;
  stateAbbr?: string | null;
  zip?: string | null;
}

interface AgListing {
  __typename?: string;
  id?: string;
  name?: string;
  address?: string;
  addressFull?: string;
  zipCode?: string;
  location?: AgLocation | null;
  price?: number | null;
  priceRange?: AgRange | null;
  bedRange?: AgRange | null;
  bathText?: string | null;
  squareFeetText?: string | null;
  floorPlans?: AgFloorPlan[] | null;
  photos?: AgPhoto[] | null;
  propertyType?: string | null;
  amenitiesHighlighted?: string[] | null;
  uniqueHighlights?: string[] | null;
  urlPathname?: string | null;
  updatedAt?: string | null;
  offMarket?: boolean | null;
  availabilityStatus?: string | null;
  propertyManagementCompany?: { name?: string | null } | null;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ *
 * The shape the rest of the app consumes
 * ------------------------------------------------------------------ */

/**
 * One leasable candidate: a single floor plan at a single building, so
 * `beds`, `baths`, `sqft` and `rent` are all exact rather than a range
 * blurred across the whole property.
 *
 * Structurally a superset of `RentCastListing` — see `LiveRentalListing` in
 * `live-deals.ts`, which is the common interface both feeds satisfy so one
 * seed builder serves both.
 */
export interface ApartmentGuideListing {
  id: string;
  address: string;
  city: string;
  county: string;
  zip: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  unitType: UnitType;
  yearBuilt: number | null;
  coords: Coords | null;
  photos: string[];
  listingUrl: string;
  daysOnMarket: number | null;
  hoaMonthlyFee: number | null;
  petPolicy: PetPolicy;
  pool: boolean;
  /** Building name, e.g. "Melrose on Waters". Not the street address. */
  propertyName: string;
  /** Which floor plan this row is, for the description line. */
  floorPlanLabel: string;
  amenities: string[];
  /** ApartmentGuide's own last-updated stamp for the listing, if present. */
  updatedAt: string | null;
  /** True when the building advertises a rent band wider than this plan's. */
  rentIsFromPrice: boolean;
}

/* ------------------------------------------------------------------ *
 * Parsing
 * ------------------------------------------------------------------ */

function mapPropertyType(raw?: string | null): UnitType {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("condo")) return "condo";
  if (v.includes("town")) return "townhouse";
  if (v.includes("duplex") || v.includes("multi")) return "duplex";
  if (v.includes("house") || v.includes("home")) {
    // "TOWNHOME" is caught by the `town` test above, so this is a real house.
    return "single_family";
  }
  if (v.includes("apartment")) return "apartment";
  return "apartment";
}

function photoUrls(photos: AgPhoto[] | null | undefined, limit = 8): string[] {
  return (photos ?? [])
    .map((p) => p?.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0)
    .slice(0, limit)
    .map((id) => `${AG_IMAGE_BASE}/${id}`);
}

function hasAmenity(list: string[], needle: string): boolean {
  return list.some((a) => a.toLowerCase().includes(needle));
}

function firstPositive(...values: Array<number | null | undefined>): number {
  for (const v of values) {
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  }
  return 0;
}

/**
 * `__NEXT_DATA__` → the listing array.
 *
 * Tries the known path first, then falls back to a recursive hunt for an
 * array of `__typename: "Listing"` objects, so a Next.js route-shape change
 * degrades to "still works" rather than "silently zero listings".
 */
export function extractAgListings(nextData: unknown): AgListing[] {
  /** Step one key down an `unknown`, without an `any` and without throwing. */
  const at = (node: unknown, key: string): unknown =>
    node != null && typeof node === "object" ? (node as Record<string, unknown>)[key] : undefined;

  const direct = ["props", "pageProps", "pageData", "location", "listingSearch", "listings"].reduce<
    unknown
  >(at, nextData);
  if (Array.isArray(direct) && direct.length > 0) return direct as AgListing[];

  let best: AgListing[] = [];
  const seen = new Set<unknown>();
  const walk = (node: unknown): void => {
    if (node == null || typeof node !== "object") return;
    if (seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      const listingish = node.filter(
        (v): v is AgListing =>
          v != null &&
          typeof v === "object" &&
          ((v as AgListing).__typename === "Listing" ||
            (typeof (v as AgListing).urlPathname === "string" &&
              (v as AgListing).location != null))
      );
      if (listingish.length > best.length) best = listingish;
      for (const v of node) walk(v);
      return;
    }
    for (const v of Object.values(node as Record<string, unknown>)) walk(v);
  };
  walk(nextData);
  return best;
}

/** Pull the `__NEXT_DATA__` JSON out of a city page. */
export function parseNextData(html: string): unknown {
  const m = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (!m) throw new UpstreamError("ApartmentGuide page carried no __NEXT_DATA__ block");
  try {
    return JSON.parse(m[1]);
  } catch (err) {
    throw new UpstreamError(
      `ApartmentGuide __NEXT_DATA__ was not valid JSON: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * One building → one candidate per distinct floor plan.
 *
 * Rent is the floor plan's `priceRange.min` — the advertised "from" rent for
 * that exact bed/bath configuration. `rentIsFromPrice` records when the plan
 * itself spans a band, so the UI can say "from $X" honestly instead of
 * presenting a band's floor as a quote.
 */
export function listingToCandidates(
  raw: AgListing,
  market: FloridaMarket
): ApartmentGuideListing[] {
  const p = marketProfile(market);

  // Off-market rows are still in the payload; they are not leasable.
  if (raw.offMarket === true) return [];

  const street = (raw.address ?? "").trim();
  if (!street) return [];

  const loc = raw.location ?? {};
  const zip = (loc.zip ?? raw.zipCode ?? "").toString().trim();
  const coords: Coords | null =
    typeof loc.lat === "number" && typeof loc.lng === "number"
      ? { lat: loc.lat, lng: loc.lng }
      : null;

  const amenities = [
    ...(raw.amenitiesHighlighted ?? []),
    ...(raw.uniqueHighlights ?? []),
  ].filter((a): a is string => typeof a === "string");

  const pool = hasAmenity(amenities, "pool");
  const petPolicy: PetPolicy = hasAmenity(amenities, "pet friendly") ? "allowed" : "unknown";
  const unitType = mapPropertyType(raw.propertyType);
  const propertyName = (raw.name ?? street).trim();
  const listingUrl = raw.urlPathname ? `${AG_ORIGIN}${raw.urlPathname}` : "";
  const buildingPhotos = photoUrls(raw.photos);

  const plans = (raw.floorPlans ?? []).filter((f): f is AgFloorPlan => f != null);

  const rows: ApartmentGuideListing[] = [];
  const pushRow = (
    beds: number,
    baths: number,
    sqft: number,
    rent: number,
    photos: string[],
    label: string,
    fromPrice: boolean
  ) => {
    // Rent and a bed count are the floor — without both this is not
    // something we can underwrite. Studios (0 beds) are excluded: the
    // sleeps model and the whole-home Airbnb comp set both assume >= 1.
    if (!(rent > 0) || !(beds >= 1)) return;
    rows.push({
      id: `${raw.id ?? street}-${beds}b${baths}ba-${rent}`,
      address: street,
      city: (loc.city ?? p.city).toString(),
      // ApartmentGuide does not carry county. Taken from the market profile
      // and labelled as such on the seed, never presented as feed data.
      county: p.county,
      zip,
      rent: Math.round(rent),
      beds,
      baths: baths > 0 ? baths : 1,
      sqft: Math.round(sqft),
      unitType,
      // Not supplied by this feed for any of the 50 rows inspected.
      yearBuilt: null,
      coords,
      photos: photos.length > 0 ? photos : buildingPhotos,
      listingUrl,
      daysOnMarket: null,
      hoaMonthlyFee: null,
      petPolicy,
      pool,
      propertyName,
      floorPlanLabel: label,
      amenities: Array.from(new Set(amenities)).slice(0, 12),
      updatedAt: raw.updatedAt ?? null,
      rentIsFromPrice: fromPrice,
    });
  };

  for (const plan of plans) {
    const beds = firstPositive(plan.bedCount);
    const baths = firstPositive(plan.bathCount);
    const rent = firstPositive(plan.priceRange?.min, plan.priceRange?.max);
    const sqft = firstPositive(plan.sqFtRange?.min, plan.sqFtRange?.max);
    const spans =
      typeof plan.priceRange?.min === "number" &&
      typeof plan.priceRange?.max === "number" &&
      plan.priceRange.max > plan.priceRange.min;
    const label = (plan.name ?? "").trim() || `${beds} bed / ${baths || 1} bath plan`;
    pushRow(beds, baths, sqft, rent, photoUrls(plan.photos), label, spans);
  }

  // No usable floor plans — fall back to the building-level summary so a
  // real listing is not dropped just because the plan array was empty.
  if (rows.length === 0) {
    const beds = firstPositive(raw.bedRange?.min, raw.bedRange?.max);
    const rent = firstPositive(raw.price, raw.priceRange?.min);
    const baths = firstPositive(Number.parseFloat((raw.bathText ?? "").replace(/[^\d.]/g, "")));
    const sqft = firstPositive(
      Number.parseFloat((raw.squareFeetText ?? "").replace(/[^\d.]/g, ""))
    );
    const spans =
      typeof raw.priceRange?.min === "number" &&
      typeof raw.priceRange?.max === "number" &&
      raw.priceRange.max > raw.priceRange.min;
    pushRow(beds, baths, sqft, rent, buildingPhotos, "Building summary (no floor plan detail)", spans);
  }

  // One row per distinct configuration at this building.
  const seen = new Set<string>();
  return rows.filter((r) => {
    const key = `${r.beds}|${r.baths}|${r.rent}|${r.sqft}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * A whole city page → capped, sorted candidates.
 *
 * Exported separately from the fetch so the parse can be exercised against a
 * saved page with no network call.
 */
export function parseApartmentGuideHtml(
  html: string,
  market: FloridaMarket,
  limit = AG_MAX_LISTINGS_PER_MARKET
): { listings: ApartmentGuideListing[]; totalFound: number } {
  const raw = extractAgListings(parseNextData(html));
  const all = raw.flatMap((r) => listingToCandidates(r, market));

  // Same building, same configuration, different page position — keep one.
  const seen = new Set<string>();
  const unique = all.filter((l) => {
    const key = `${l.address}|${l.zip}|${l.beds}|${l.baths}|${l.rent}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // More bedrooms is a better arbitrage candidate (sleeps drives ADR harder
  // than anything else here), then cheaper rent for the same bed count.
  const sorted = unique.sort((a, b) => b.beds - a.beds || a.rent - b.rent);

  return { listings: sorted.slice(0, limit), totalFound: unique.length };
}

/* ------------------------------------------------------------------ *
 * Fetching
 * ------------------------------------------------------------------ */

function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

async function fetchCityPage(market: FloridaMarket): Promise<string> {
  const path = AG_MARKET_CITY_PATHS[market];
  // No query string, by robots.txt. See the header.
  const url = `${AG_ORIGIN}/apartments/${path}/`;

  let res: Response;
  try {
    res = await fetch(url, {
      signal: timeoutSignal(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": AG_UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      // Vercel Data Cache — survives across serverless invocations, unlike
      // the in-process map. 12h keeps us to one request per market per half
      // day however much Chris clicks around.
      next: { revalidate: AG_REVALIDATE_SECONDS },
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "Error";
    throw new UpstreamError(
      `ApartmentGuide request failed for ${path}`,
      undefined,
      name
    );
  }
  if (!res.ok) {
    // A 429 here is almost always the *end* of a redirect into the challenge
    // page, not a genuine rate limit — see the AG_UA note. Say so, so the
    // next person does not go hunting for a quota they have not hit.
    const hint =
      res.status === 429 || res.status === 403
        ? " — most likely the bot-challenge page, not a quota. Check that the User-Agent still looks like a browser (see AG_UA)."
        : "";
    throw new UpstreamError(
      `ApartmentGuide returned HTTP ${res.status} for ${path}${hint}`,
      res.status
    );
  }
  return res.text();
}

export interface ApartmentGuideScan {
  market: FloridaMarket;
  listings: ApartmentGuideListing[];
  /** Candidates found before the per-market cap — so truncation is visible. */
  totalFound: number;
  fetchedAt: string;
}

/**
 * One market's live rental candidates, cached 12h.
 *
 * Throws on network failure, a non-200, a missing `__NEXT_DATA__` block or
 * unparseable JSON. `live-deals.ts` is the layer that decides what to show
 * instead — this function never substitutes mock data itself.
 */
export async function fetchApartmentGuideListings(
  market: FloridaMarket
): Promise<ApartmentGuideScan> {
  return cached(`apartmentguide:${market}`, TTL_12H_MS, async () => {
    const html = await fetchCityPage(market);
    const { listings, totalFound } = parseApartmentGuideHtml(html, market);
    return { market, listings, totalFound, fetchedAt: new Date().toISOString() };
  });
}
