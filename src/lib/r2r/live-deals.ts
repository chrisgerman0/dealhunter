/**
 * Live rental listings + live Airbnb comps → `R2RSeed[]`.
 *
 * This is the only file that decides whether Explore shows real units or the
 * mock catalogue, and it is explicit about which. `source` on the result is
 * one of three values, never ambiguous:
 *
 *     "rentcast"       — the paid feed, used whenever RENTCAST_API_KEY is set
 *     "apartmentguide" — the keyless live scrape (src/lib/r2r/apartmentguide.ts)
 *     "mock"           — the sample catalogue, last resort, always labelled
 *
 * PRECEDENCE, and why it is this way round
 * ----------------------------------------
 * RentCast first: it is a licensed API, so it carries no ToS risk and no
 * page-shape fragility. ApartmentGuide second: real listings today with no
 * key, at the cost of the ToS conflict documented at length in that file's
 * header. Mock last and only when both live paths come back empty — and in
 * that case `source` says `"mock"` and every UI surface says "sample data".
 *
 * A real scrape must never be able to present itself as mock, and mock must
 * never be able to present itself as real. That is the whole contract of
 * this file.
 *
 * Seeds, not assembled deals: `assembleR2RDeal()` in `assemble.ts` is left
 * completely untouched. The API route returns these seeds and the client
 * runs them through the same assembler with the user's own settings — one
 * calculation path for mock and live data, as the mock file's own header
 * already promises.
 *
 * SERVERLESS TIME BUDGET
 * ----------------------
 * The seeds route is `maxDuration = 30`. Cold (both caches empty) the work
 * is one listings fetch per market plus one Airbnb comp scan per market, and
 * ten markets of that can exceed the limit. So: every market runs under its
 * own deadline, markets run in small concurrent batches rather than all at
 * once (politeness as well as memory), and a market that misses its deadline
 * contributes nothing but is *named* in `marketStatus` instead of failing
 * the whole request. Partial beats empty, and silent partial beats nothing —
 * so nothing is dropped without a line saying so.
 */
import type { Coords, FloridaMarket, GeoMatch, GuestSegment, PetPolicy, UnitType } from "@/types/r2r";
import type { R2RSeed } from "./assemble";
import { R2R_SEEDS } from "@/data/mock-r2r-properties";
import { marketProfile, WORKABLE_MARKETS } from "./markets";
import { ACTIVE_COMP_SOURCE } from "./comps";
import { fetchRentCastListings, hasRentCastKey } from "./rentcast";
import {
  AG_MAX_LISTINGS_PER_MARKET,
  AG_SOURCE_ID,
  AG_SOURCE_LABEL,
  fetchApartmentGuideListings,
} from "./apartmentguide";

/* ------------------------------------------------------------------ *
 * The common listing interface
 * ------------------------------------------------------------------ */

/**
 * What a listings feed must supply for the seed builder to underwrite it.
 * Both `RentCastListing` and `ApartmentGuideListing` satisfy this
 * structurally, which is why there is one `buildSeedFromListing` and not two.
 *
 * The optional fields are the ones only the richer feed carries; the builder
 * treats every one of them as "unknown unless present" and never invents a
 * value to fill a gap.
 */
export interface LiveRentalListing {
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
  pool?: boolean;
  propertyName?: string;
  floorPlanLabel?: string;
  amenities?: string[];
  updatedAt?: string | null;
  rentIsFromPrice?: boolean;
}

export type LiveListingSource = "rentcast" | typeof AG_SOURCE_ID;
export type R2RSeedSource = LiveListingSource | "mock";

/** Provenance strings for whichever feed produced a row. */
interface ProviderMeta {
  id: LiveListingSource;
  label: string;
  /** Goes into the seed's `description` and physical notes. */
  shortName: string;
}

const PROVIDERS: Record<LiveListingSource, ProviderMeta> = {
  rentcast: { id: "rentcast", label: "RentCast", shortName: "RentCast" },
  [AG_SOURCE_ID]: { id: AG_SOURCE_ID, label: AG_SOURCE_LABEL, shortName: "ApartmentGuide" },
};

/* ------------------------------------------------------------------ *
 * Seed construction
 * ------------------------------------------------------------------ */

function targetSegmentFor(market: FloridaMarket): GuestSegment {
  switch (market) {
    case "kissimmee":
    case "orlando-city":
      return "disney_families";
    case "destin":
    case "panama-city-beach":
      return "beach_families";
    case "miami-beach":
    case "naples":
    case "key-west":
      return "snowbirds";
    default:
      return "couples_weekend";
  }
}

async function buildSeedFromListing(
  listing: LiveRentalListing,
  market: FloridaMarket,
  geoMatch: GeoMatch,
  provider: ProviderMeta
): Promise<R2RSeed> {
  const p = marketProfile(market);
  const usingMarketCenterCoords = listing.coords == null;
  const coords = listing.coords ?? p.center;

  let compsSourceNote: string;
  let comps: R2RSeed["comps"] = [];
  let achievedGeoMatch: GeoMatch = geoMatch;
  try {
    const set = await ACTIVE_COMP_SOURCE.fetchComps({
      coords,
      beds: listing.beds || 3,
      geoMatch,
      market,
    });
    comps = set.comps;
    achievedGeoMatch = set.geoMatch;
    compsSourceNote = usingMarketCenterCoords
      ? `${set.sourceNote} Listing had no coordinates from the feed — comps were matched against the ${p.city} market center instead of the exact address, so the radius is approximate.`
      : set.sourceNote;
  } catch (err) {
    compsSourceNote =
      `Live Airbnb comp scrape failed for ${p.city} (${err instanceof Error ? err.message : String(err)}). ` +
      `No comps available this request — occupancy and nightly rate fall back to the configured assumption.`;
  }

  const riskWatchItems = [
    `Live ${provider.shortName} listing — HOA bylaws, landlord sublet consent and zoning are not yet verified. Confirm all three before signing.`,
  ];
  if (usingMarketCenterCoords) {
    riskWatchItems.push(
      "Listing feed did not supply coordinates — using the market center as an approximation."
    );
  }
  if (listing.unitType === "apartment") {
    // The single most common way an apartment-complex R2R dies. Earned its
    // place here: ApartmentGuide inventory is overwhelmingly managed
    // multifamily, where a blanket no-sublet clause is the norm.
    riskWatchItems.push(
      "Managed apartment building — corporate leases commonly prohibit subletting and short-term lets outright. Get written consent before paying a deposit."
    );
  }
  if (listing.rentIsFromPrice) {
    riskWatchItems.push(
      "Advertised rent is a 'from' price for this floor plan — the quoted unit may price higher. Confirm the exact unit's rent."
    );
  }

  const rentBasis = listing.rentIsFromPrice
    ? `Advertised from $${listing.rent.toLocaleString("en-US")}/mo for this floor plan`
    : `Advertised rent $${listing.rent.toLocaleString("en-US")}/mo`;
  const descriptionParts = [
    `Live long-term rental listing from ${provider.shortName}.`,
    listing.propertyName && listing.propertyName !== listing.address
      ? `${listing.propertyName} — ${listing.floorPlanLabel ?? "unspecified floor plan"}.`
      : null,
    `${rentBasis}.`,
    listing.amenities?.length ? `Advertised amenities: ${listing.amenities.join(", ")}.` : null,
  ].filter((s): s is string => Boolean(s));

  return {
    id: `${provider.id}-${market}-${listing.id}`,
    address: listing.address,
    city: listing.city || p.city,
    county: listing.county || p.county,
    zip: listing.zip,
    market,
    unitType: listing.unitType,
    monthlyRent: listing.rent,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft,
    coords,
    // Never substitute a stock photo for a real listing. When the feed has
    // none, use the app's own neutral "no photo provided" placeholder rather
    // than an empty array (which would crash the gallery) or Unsplash stock.
    photos: listing.photos.length > 0 ? listing.photos : ["/no-photo.png"],
    listingUrl: listing.listingUrl,
    description: descriptionParts.join(" "),
    createdAt: new Date().toISOString(),

    pool: listing.pool ?? false,
    poolHeated: false,
    parkingSpaces: 0,
    acAgeYears: null,
    petPolicy: listing.petPolicy,
    hoa: {
      present: Boolean(listing.hoaMonthlyFee),
      monthlyFee: listing.hoaMonthlyFee ?? 0,
      rulesVerified: false,
      strAllowed: null,
      minimumLeaseMonths: null,
      note: listing.hoaMonthlyFee
        ? "HOA fee reported by the feed; bylaws not read."
        : "No HOA reported by the feed.",
    },
    furnishedOnArrival: false,
    yearBuilt: listing.yearBuilt,
    physicalNotes:
      `Live ${provider.shortName} listing — ` +
      (listing.pool
        ? "a pool is advertised but not verified on site; "
        : "no pool advertised; ") +
      "parking count and A/C age are not supplied by the feed and require a walkthrough. " +
      `County is taken from the ${p.label} market profile, not from the listing feed.`,

    sofaBeds: 0,
    bunkRooms: 0,
    sleepsScore: 5,
    sleepsPositives: [],
    sleepsNegatives: ["Sleeps configuration not yet assessed — requires a walkthrough."],
    sleepsNotes: "Base sleeps assumed at beds × 2 until the unit is furnished.",

    geoMatch: achievedGeoMatch,
    comps,
    compsSourceNote,

    zoningStatus: p.zoningCheckRequired ? "unverified" : "not_applicable",
    landlordSubletConsent: "not_asked",
    femaFloodZone: "Not verified",
    floodRisk: p.hurricaneExposure >= 8 ? "high" : p.hurricaneExposure >= 6 ? "moderate" : "low",
    extraRegulatoryFlags: [
      "FEMA flood zone not verified for this address — check the FEMA Flood Map Service Center before signing.",
    ],

    landlordFlexibility: 5,
    riskWatchItems,
    riskReasoning:
      "Market-level risk factors (seasonality, hurricane exposure, comp density) are measured live. " +
      "Property-specific factors — landlord flexibility, HOA strictness beyond the reported fee — are not yet assessed.",

    targetSegment: targetSegmentFor(market),
    secondarySegments: [],
    usp: "",
    photoStrategy: [],
    pricingStrategy: [],
    minimumStayStrategy: "",
    weaknesses: [
      {
        weakness: "Physical condition, HOA bylaws and zoning not yet verified against this specific address.",
        mitigation: "Walk the property, read the HOA bylaws, and get written landlord sublet consent before signing.",
      },
    ],

    isMock: false,
  };
}

/* ------------------------------------------------------------------ *
 * Result shape
 * ------------------------------------------------------------------ */

export interface R2RSeedsResult {
  seeds: R2RSeed[];
  source: R2RSeedSource;
  dataAsOf: string | null;
  note: string;
  /** Per-market fetch outcome, surfaced so one bad market is visible, not hidden in an average. */
  marketStatus: Record<string, string>;
}

const MOCK_NOTE_BOTH_FAILED =
  "Neither live listings source returned usable rows, so this is the mock catalogue — sample data, not real listings. " +
  "RentCast is the preferred feed (set RENTCAST_API_KEY; sign up at https://developers.rentcast.io — free tier 50 calls/mo, " +
  "dev/test only, $74/mo for 1,000 calls). The keyless ApartmentGuide scrape is the fallback and its per-market failures are listed below.";

function mockResult(note: string, marketStatus: Record<string, string> = {}): R2RSeedsResult {
  return { seeds: R2R_SEEDS, source: "mock", dataAsOf: null, note, marketStatus };
}

/* ------------------------------------------------------------------ *
 * Time budget
 * ------------------------------------------------------------------ */

/**
 * The route allows 30 s. Stop starting new work at 22 s and return what is
 * in hand, leaving headroom to serialise the response.
 */
const TOTAL_BUDGET_MS = 22_000;
/** One market's whole chain: listings fetch + comp scan + seed assembly. */
const PER_MARKET_BUDGET_MS = 14_000;
/** Concurrent markets. Small on purpose: politeness and serverless memory. */
const MARKET_CONCURRENCY = 3;

class DeadlineError extends Error {
  constructor(ms: number) {
    super(`exceeded its ${Math.round(ms / 1000)}s budget`);
    this.name = "DeadlineError";
  }
}

function withDeadline<T>(work: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new DeadlineError(ms)), ms);
    work.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

/** Run tasks `limit` at a time, preserving input order in the output. */
async function inBatches<T, R>(
  items: T[],
  limit: number,
  run: (item: T) => Promise<R>
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    out.push(...(await Promise.all(batch.map(run))));
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * The two live feeds, behind one shape
 * ------------------------------------------------------------------ */

/**
 * Fetch one market from one feed. Returns the rows plus the status line that
 * will be shown for that market — including the cap note when the cap bites.
 */
async function fetchMarketListings(
  source: LiveListingSource,
  market: FloridaMarket
): Promise<{ listings: LiveRentalListing[]; status: string }> {
  if (source === "rentcast") {
    const listings = await fetchRentCastListings(market);
    return { listings, status: `${listings.length} live RentCast listing(s).` };
  }
  const scan = await fetchApartmentGuideListings(market);
  const capped = scan.totalFound > scan.listings.length;
  return {
    listings: scan.listings,
    status:
      `${scan.listings.length} live ApartmentGuide listing(s)` +
      (capped
        ? ` (capped at ${AG_MAX_LISTINGS_PER_MARKET} of ${scan.totalFound} found, most bedrooms first).`
        : "."),
  };
}

/**
 * Run one listings source across the selected markets, attaching live Airbnb
 * comps to every row. Never throws: a market that fails or runs out of
 * budget yields no seeds and a named reason.
 */
async function collectFromSource(
  source: LiveListingSource,
  markets: FloridaMarket[],
  geoMatch: GeoMatch,
  startedAt: number
): Promise<{ seeds: R2RSeed[]; marketStatus: Record<string, string> }> {
  const provider = PROVIDERS[source];
  const marketStatus: Record<string, string> = {};

  const perMarket = await inBatches(markets, MARKET_CONCURRENCY, async (market) => {
    const elapsed = Date.now() - startedAt;
    const remaining = TOTAL_BUDGET_MS - elapsed;
    if (remaining <= 1_000) {
      marketStatus[market] =
        `Skipped — the request's ${Math.round(TOTAL_BUDGET_MS / 1000)}s budget was already spent on earlier markets. ` +
        `Select fewer markets, or retry now that the earlier ones are cached.`;
      return [] as R2RSeed[];
    }

    try {
      const budget = Math.min(PER_MARKET_BUDGET_MS, remaining);
      const seeds = await withDeadline(
        (async () => {
          const { listings, status } = await fetchMarketListings(source, market);
          if (listings.length === 0) {
            marketStatus[market] = `${provider.label}: no usable listings returned.`;
            return [] as R2RSeed[];
          }
          const built = await Promise.all(
            listings.map((l) => buildSeedFromListing(l, market, geoMatch, provider))
          );
          marketStatus[market] = status;
          return built;
        })(),
        budget
      );
      return seeds;
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      marketStatus[market] =
        err instanceof DeadlineError
          ? `${provider.label} fetch ${reason} and was dropped from this response. Retry — the other markets are now cached.`
          : `${provider.label} fetch failed: ${reason}`;
      return [] as R2RSeed[];
    }
  });

  return { seeds: perMarket.flat(), marketStatus };
}

/* ------------------------------------------------------------------ *
 * The entry point
 * ------------------------------------------------------------------ */

/**
 * `markets` empty means every workable market.
 *
 * Tries RentCast (only if keyed), then the keyless ApartmentGuide scrape,
 * then the mock catalogue. The returned `source` always names what the seeds
 * actually are.
 */
export async function getLiveR2RSeeds(opts: {
  markets?: FloridaMarket[];
  geoMatch?: GeoMatch;
}): Promise<R2RSeedsResult> {
  const startedAt = Date.now();
  const markets = opts.markets?.length ? opts.markets : WORKABLE_MARKETS;
  const geoMatch = opts.geoMatch ?? "radius_500m";

  const attempted: LiveListingSource[] = hasRentCastKey()
    ? ["rentcast", AG_SOURCE_ID]
    : [AG_SOURCE_ID];

  const combinedStatus: Record<string, string> = {};

  for (const source of attempted) {
    const { seeds, marketStatus } = await collectFromSource(source, markets, geoMatch, startedAt);
    // Prefix per-market lines with the feed when more than one was tried, so
    // "tampa" cannot mean two different things in one response.
    for (const [market, status] of Object.entries(marketStatus)) {
      combinedStatus[attempted.length > 1 ? `${market} (${source})` : market] = status;
    }

    if (seeds.length > 0) {
      const live = seeds.length;
      const note =
        source === "rentcast"
          ? `${live} live RentCast listing(s) across ${markets.length} market(s), each with a live Airbnb comp set.`
          : `${live} live ApartmentGuide listing(s) across ${markets.length} market(s), each with a live Airbnb comp set. ` +
            `Keyless scrape — real listings, no API key. RentCast takes over automatically if RENTCAST_API_KEY is set. ` +
            `ApartmentGuide's robots.txt permits these city pages; its Terms of Service prohibit automated access — see ` +
            `src/lib/r2r/apartmentguide.ts for the full position.`;
      return {
        seeds,
        source,
        dataAsOf: new Date().toISOString(),
        note,
        marketStatus: combinedStatus,
      };
    }
  }

  return mockResult(MOCK_NOTE_BOTH_FAILED, combinedStatus);
}
