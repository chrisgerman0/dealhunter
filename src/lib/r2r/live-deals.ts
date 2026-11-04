/**
 * Live RentCast listings + live Airbnb comps → `R2RSeed[]`.
 *
 * This is the only file that decides whether Explore shows real units or the
 * mock catalogue, and it is explicit about which: `source` on the result is
 * `"rentcast"` or `"mock"`, never ambiguous, and every seed still carries its
 * own `isMock`. Nothing here is silently substituted — see
 * `getLiveR2RSeeds()`'s fallback branches for exactly when and why mock data
 * appears.
 *
 * Seeds, not assembled deals: `assembleR2RDeal()` in `assemble.ts` is left
 * completely untouched. The API route returns these seeds and the client
 * runs them through the same assembler with the user's own settings — one
 * calculation path for mock and live data, as the mock file's own header
 * already promises.
 */
import type { FloridaMarket, GeoMatch, GuestSegment } from "@/types/r2r";
import type { R2RSeed } from "./assemble";
import { R2R_SEEDS } from "@/data/mock-r2r-properties";
import { marketProfile, WORKABLE_MARKETS } from "./markets";
import { ACTIVE_COMP_SOURCE } from "./comps";
import { fetchRentCastListings, hasRentCastKey, type RentCastListing } from "./rentcast";

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

function buildSeedId(listing: RentCastListing, market: FloridaMarket): string {
  return `rentcast-${market}-${listing.id}`;
}

async function buildSeedFromListing(
  listing: RentCastListing,
  market: FloridaMarket,
  geoMatch: GeoMatch
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
    "Live RentCast listing — HOA bylaws, landlord sublet consent and zoning are not yet verified. Confirm all three before signing.",
  ];
  if (usingMarketCenterCoords) {
    riskWatchItems.push(
      "Listing feed did not supply coordinates — using the market center as an approximation."
    );
  }

  return {
    id: buildSeedId(listing, market),
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
    description: listing.listingUrl
      ? "Live long-term rental listing from RentCast."
      : "Live long-term rental listing from RentCast. No description supplied by the feed.",
    createdAt: new Date().toISOString(),

    pool: false,
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
      note: listing.hoaMonthlyFee ? "HOA fee reported by the feed; bylaws not read." : "No HOA reported by the feed.",
    },
    furnishedOnArrival: false,
    yearBuilt: listing.yearBuilt,
    physicalNotes:
      "Live RentCast listing — pool, parking count and A/C age are not supplied by the feed and require a walkthrough.",

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

export interface R2RSeedsResult {
  seeds: R2RSeed[];
  source: "rentcast" | "mock";
  dataAsOf: string | null;
  note: string;
  /** Per-market fetch outcome, surfaced so one bad market is visible, not hidden in an average. */
  marketStatus: Record<string, string>;
}

const RENTCAST_SIGNUP_NOTE =
  "RENTCAST_API_KEY is not set. Showing the mock catalogue. Sign up at https://developers.rentcast.io " +
  "(free tier: 50 calls/mo, dev/test only; $74/mo for 1,000 calls) and set RENTCAST_API_KEY to go live.";

function mockResult(note: string): R2RSeedsResult {
  return { seeds: R2R_SEEDS, source: "mock", dataAsOf: null, note, marketStatus: {} };
}

/**
 * The entry point. `markets` empty means every workable market.
 */
export async function getLiveR2RSeeds(opts: {
  markets?: FloridaMarket[];
  geoMatch?: GeoMatch;
}): Promise<R2RSeedsResult> {
  if (!hasRentCastKey()) {
    return mockResult(RENTCAST_SIGNUP_NOTE);
  }

  const markets = opts.markets?.length ? opts.markets : WORKABLE_MARKETS;
  const geoMatch = opts.geoMatch ?? "radius_500m";

  const marketStatus: Record<string, string> = {};
  const perMarket = await Promise.all(
    markets.map(async (market) => {
      try {
        const listings = await fetchRentCastListings(market);
        const seeds = await Promise.all(listings.map((l) => buildSeedFromListing(l, market, geoMatch)));
        marketStatus[market] = `${seeds.length} live listing(s).`;
        return seeds;
      } catch (err) {
        marketStatus[market] = `RentCast fetch failed: ${err instanceof Error ? err.message : String(err)}`;
        return [] as R2RSeed[];
      }
    })
  );

  const seeds = perMarket.flat();
  if (seeds.length === 0) {
    const reasons = Object.entries(marketStatus)
      .map(([m, s]) => `${m}: ${s}`)
      .join(" · ");
    return mockResult(
      `RentCast is keyed but returned no usable listings for the selected markets. Showing the mock ` +
        `catalogue instead. (${reasons || "no markets selected"})`
    );
  }

  return {
    seeds,
    source: "rentcast",
    dataAsOf: new Date().toISOString(),
    note: `${seeds.length} live RentCast listing(s) across ${markets.length} market(s).`,
    marketStatus,
  };
}
