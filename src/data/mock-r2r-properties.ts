/**
 * Florida R2R mock catalogue.
 *
 * Structurally identical to what a real rental-listing feed (RentCast) plus a
 * live Airbnb comp scrape will return — see `R2RSeed` in
 * `src/lib/r2r/assemble.ts`. Swapping in a live source means changing where
 * these seeds come from, never the shape.
 *
 * Covers every workable market at least twice and every hard-kill market at
 * least once, so the regulatory kill is always visible in Explore without
 * digging. `isMock: true` on every seed — nothing here is a real listing.
 */
import type {
  FloridaMarket,
  GeoMatch,
  GuestSegment,
  PetPolicy,
  StrComp,
  SubletConsent,
  UnitType,
  ZoningStatus,
} from "@/types/r2r";
import { assembleR2RDeal, DEFAULT_R2R_ASSUMPTIONS, type R2RSeed, type R2RAssumptions } from "@/lib/r2r/assemble";
import { marketProfile } from "@/lib/r2r/markets";

const PHOTO_IDS = [
  "1484154218962-a197022b5858",
  "1502672260266-1c1ef2d93688",
  "1512917774080-9991f1c4c750",
  "1552321554-5fefe8c9ef14",
  "1556912173-46c336c7fd55",
  "1560448204-e02f11c3d0e2",
  "1564013799919-ab600027ffc6",
  "1568605114967-8130f3a36994",
  "1570129477492-45c003edd2be",
  "1580587771525-78b9dba36295",
  "1600047509807-ba8f99d2cdde",
  "1600566753190-17f0baa2a6c3",
  "1600573472592-401b489a3cdc",
  "1600585154340-be6161a56a0c",
  "1600596542815-ffad4c1539a9",
  "1600607687939-ce8a6c25118c",
  "1613490493576-7fde63acd811",
];

function photos(seed: number, count = 4): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = PHOTO_IDS[(seed + i) % PHOTO_IDS.length];
    out.push(`https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop`);
  }
  return out;
}

/** Deterministic 0..1 pseudo-random from a seed — stable across builds, no `Math.random`. */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(rand(seed) * arr.length) % arr.length];
}

const REVIEW_TITLES = [
  "Sunny lakeside retreat",
  "Family vacation home",
  "Modern resort-style escape",
  "Cozy getaway near the parks",
  "Beachside family favorite",
  "Updated 3-bed with private pool",
  "Gated community vacation villa",
  "Walk-to-everything townhome",
  "Quiet street, big backyard",
  "Bright open-concept rental",
];

/** Builds a plausible comp set for a market, scaled off a base nightly rate and bed count. */
function buildComps(
  market: FloridaMarket,
  beds: number,
  seedBase: number,
  count: number
): StrComp[] {
  const base = BASE_NIGHTLY[market];
  const comps: StrComp[] = [];
  for (let i = 0; i < count; i++) {
    const s = seedBase + i * 7;
    const sizeFactor = 0.75 + (beds - 2) * 0.18 + rand(s) * 0.25;
    const peak = Math.round(base.peak * sizeFactor);
    comps.push({
      title: pick(REVIEW_TITLES, s),
      unitType: pick<UnitType>(["single_family", "condo", "townhouse"], s + 1),
      beds: Math.max(1, beds + (rand(s + 2) > 0.7 ? 1 : rand(s + 2) < 0.3 ? -1 : 0)),
      sleeps: Math.max(2, (beds + (rand(s + 2) > 0.7 ? 1 : 0)) * 2 + (rand(s + 3) > 0.5 ? 2 : 0)),
      nightlyPeak: peak,
      nightlyShoulder: Math.round(base.shoulder * sizeFactor),
      nightlyOff: Math.round(base.off * sizeFactor),
      occupancy: Number((0.52 + rand(s + 4) * 0.33).toFixed(2)),
      reviewScore: Number((4.55 + rand(s + 5) * 0.4).toFixed(2)),
      reviewCount: Math.round(18 + rand(s + 6) * 220),
      distanceMeters: Math.round(60 + rand(s + 7) * 950),
      sameStreet: i === 0,
      listingUrl: `https://www.airbnb.com/rooms/mock-${market}-${s}`,
    });
  }
  return comps;
}

/**
 * Market-level base nightly rate by season, USD. MOCK — not a measurement.
 *
 * PROVENANCE, stated honestly. The 2026-11-03 research report
 * (`/root/.openclaw/workspace/reports/florida-r2r-data-sources-2026-11-03.md`)
 * does NOT contain a per-market ADR table. It contains operating-cost
 * benchmarks (§5), market legality verdicts (§4) and the instruction to source
 * nightly rates from live Airbnb listings — which is what
 * `src/lib/r2r/comps.ts` is the seam for. An earlier version of this file
 * claimed these figures were "benchmarked off the research report"; they were
 * not, and that claim has been removed rather than left to be trusted.
 *
 * What they actually are: a scale baseline for a ~2-bed unit, chosen to sit in
 * the mid-range of publicly observable Airbnb asks per market, and scaled by
 * bed count in `buildComps` via `sizeFactor`. Their purpose is to exercise the
 * full verdict range so every band is reachable and visibly reasoned — not to
 * predict a return. Every deal built from them carries `isMock: true` and says
 * so on the card and the detail page.
 *
 * REPLACE, do not re-tune: point `ACTIVE_COMP_SOURCE` at
 * `COMPETITOR_PRICING_SOURCE` and these stop being used at all.
 */
const BASE_NIGHTLY: Record<FloridaMarket, { peak: number; shoulder: number; off: number }> = {
  kissimmee: { peak: 265, shoulder: 195, off: 145 },
  tampa: { peak: 230, shoulder: 180, off: 140 },
  broward: { peak: 270, shoulder: 215, off: 170 },
  "clearwater-stpete": { peak: 250, shoulder: 195, off: 150 },
  destin: { peak: 330, shoulder: 220, off: 140 },
  "panama-city-beach": { peak: 300, shoulder: 205, off: 130 },
  "miami-beach": { peak: 350, shoulder: 275, off: 210 },
  "orlando-city": { peak: 240, shoulder: 190, off: 145 },
  "key-west": { peak: 400, shoulder: 325, off: 250 },
  naples: { peak: 375, shoulder: 285, off: 215 },
};

interface SeedInput {
  n: number;
  market: FloridaMarket;
  address: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  monthlyRent: number;
  unitType: UnitType;
  coordsOffset: { lat: number; lng: number };
  pool?: boolean;
  sofaBeds?: number;
  bunkRooms?: number;
  hoaFee?: number;
  hoaStrAllowed?: boolean | null;
  petPolicy?: PetPolicy;
  zoningStatus?: ZoningStatus;
  landlordSubletConsent?: SubletConsent;
  floodRisk?: "low" | "moderate" | "high";
  femaFloodZone?: string;
  targetSegment?: GuestSegment;
  furnishedOnArrival?: boolean;
  extraRegulatoryFlags?: string[];
}

const GEO_MATCHES: GeoMatch[] = ["same_street", "radius_250m", "radius_500m", "radius_1km"];

function buildSeed(input: SeedInput): R2RSeed {
  const {
    n,
    market,
    address,
    zip,
    beds,
    baths,
    sqft,
    monthlyRent,
    unitType,
    coordsOffset,
    pool = true,
    sofaBeds = 1,
    bunkRooms = 0,
    hoaFee = 0,
    hoaStrAllowed = null,
    petPolicy = "allowed_with_fee",
    zoningStatus = "not_applicable",
    landlordSubletConsent = "granted",
    floodRisk = "low",
    femaFloodZone = "X",
    targetSegment = "beach_families",
    furnishedOnArrival = false,
    extraRegulatoryFlags = [],
  } = input;

  const p = marketProfile(market);
  const compCount = 5 + Math.round(rand(n * 3) * 8);

  return {
    id: `r2r-${String(n).padStart(3, "0")}`,
    address,
    city: p.city,
    county: p.county,
    zip,
    market,
    unitType,
    monthlyRent,
    beds,
    baths,
    sqft,
    coords: { lat: p.center.lat + coordsOffset.lat, lng: p.center.lng + coordsOffset.lng },
    photos: photos(n),
    listingUrl: `https://www.zillow.com/homedetails/mock-r2r-${n}`,
    description: `${beds}-bed ${unitType.replace("_", "-")} in ${p.label}, listed for long-term lease. ${
      pool ? "Private pool. " : ""
    }Candidate for STR arbitrage subject to landlord sublet consent and ${p.city} registration.`,
    createdAt: "2026-10-12",

    pool,
    poolHeated: pool && rand(n + 50) > 0.5,
    parkingSpaces: unitType === "condo" ? 1 : 2,
    acAgeYears: 2 + Math.round(rand(n + 60) * 12),
    petPolicy,
    hoa: {
      present: hoaFee > 0,
      monthlyFee: hoaFee,
      rulesVerified: hoaFee > 0 ? rand(n + 70) > 0.4 : true,
      strAllowed: hoaStrAllowed,
      minimumLeaseMonths: hoaStrAllowed === false ? 3 : null,
      note:
        hoaFee > 0
          ? hoaStrAllowed === false
            ? "HOA bylaws reviewed — nightly letting prohibited."
            : hoaStrAllowed === null
              ? "HOA bylaws requested from the management company, not yet received."
              : "HOA bylaws reviewed — short-term letting permitted with registration."
          : "No HOA on this unit.",
    },
    furnishedOnArrival,
    yearBuilt: 1998 + Math.round(rand(n + 80) * 26),
    physicalNotes:
      unitType === "condo"
        ? "Condo association rules sit on top of city rules — verify both."
        : "Standalone unit — city/county rules are the only regulatory layer besides the lease.",

    sofaBeds,
    bunkRooms,
    sleepsScore: 6 + Math.round(rand(n + 90) * 4),
    sleepsPositives:
      bunkRooms > 0
        ? ["Bunk room sleeps 4 kids comfortably", "Separate living room sofa bed for overflow"]
        : ["Living room sofa bed adds a sleeping zone without crowding bedrooms"],
    sleepsNegatives: sqft < 1300 ? ["Tight sqft for the max sleeps configuration"] : [],
    sleepsNotes: `${beds} bedrooms plus ${sofaBeds} sofa bed(s)${bunkRooms ? ` and ${bunkRooms} bunk room(s)` : ""}.`,

    geoMatch: GEO_MATCHES[n % GEO_MATCHES.length],
    comps: buildComps(market, beds, n * 11, compCount),
    compsSourceNote: undefined,

    zoningStatus,
    landlordSubletConsent,
    femaFloodZone,
    floodRisk,
    extraRegulatoryFlags,

    landlordFlexibility: landlordSubletConsent === "granted" ? 7 + Math.round(rand(n + 100) * 3) : 4,
    riskWatchItems: [
      p.hurricaneExposure >= 7 ? "June–November hurricane season — budget for shutter/evacuation downtime" : null,
      hoaFee > 0 && hoaStrAllowed == null ? "HOA sublet position unconfirmed" : null,
    ].filter((x): x is string => x !== null),
    riskReasoning: `${p.label} runs ${p.hurricaneExposure >= 7 ? "high" : "moderate"} hurricane exposure and a ${p.seasonality.replace(
      /_/g,
      " "
    )} demand curve. Competition density reads from the live comp radius, not a fixed guess.`,

    targetSegment,
    secondarySegments: ["couples_weekend", "groups_events"].filter((s) => s !== targetSegment) as GuestSegment[],
    usp: pool
      ? "Private heated pool and resort-style layout photographs well for the Disney/beach family segment."
      : "Walkable to the main strip — positions well against pool-home competitors on price, not amenity.",
    photoStrategy: [
      "Lead image: pool or main living space in daylight",
      "Include a kid-friendly sleeping configuration shot if bunk room present",
    ],
    pricingStrategy: [
      "Price at comp median for first 60 days to build reviews, then test +8-10%",
      "Weekend minimum-stay of 2 nights outside peak season",
    ],
    minimumStayStrategy:
      p.minimumStayNights > 1
        ? `Market minimum stay is ${p.minimumStayNights} nights — no nightly flexibility available.`
        : "2-night minimum most of the year, 1-night allowed in shoulder season to fill gaps.",
    weaknesses: [
      {
        weakness: hoaFee > 0 && hoaStrAllowed !== true ? "HOA sublet position not fully confirmed" : "No weaknesses flagged beyond standard market risk",
        mitigation:
          hoaFee > 0 && hoaStrAllowed !== true
            ? "Get the HOA's STR policy in writing before signing the lease"
            : "Monitor comp set occupancy monthly once live",
      },
    ],

    isMock: true,
  };
}

/* ------------------------------------------------------------------ *
 * The seed catalogue
 * ------------------------------------------------------------------ */

export const R2R_SEEDS: R2RSeed[] = [
  // ---- Kissimmee / Disney corridor (permitted_with_zoning_check) ----
  buildSeed({
    n: 1,
    market: "kissimmee",
    address: "2814 Sunset Lagoon Drive",
    zip: "34746",
    beds: 5,
    baths: 4,
    sqft: 2650,
    monthlyRent: 3200,
    unitType: "single_family",
    coordsOffset: { lat: 0.012, lng: -0.008 },
    pool: true,
    bunkRooms: 1,
    zoningStatus: "in_str_zone",
    targetSegment: "disney_families",
  }),
  buildSeed({
    n: 2,
    market: "kissimmee",
    address: "118 Emerald Cove Court",
    zip: "34747",
    beds: 4,
    baths: 3,
    sqft: 2100,
    monthlyRent: 2650,
    unitType: "single_family",
    coordsOffset: { lat: -0.006, lng: 0.015 },
    pool: true,
    hoaFee: 185,
    hoaStrAllowed: true,
    zoningStatus: "in_str_zone",
    targetSegment: "disney_families",
  }),
  buildSeed({
    n: 3,
    market: "kissimmee",
    address: "445 Windward Palms Way",
    zip: "34746",
    beds: 3,
    baths: 2,
    sqft: 1580,
    monthlyRent: 2100,
    unitType: "townhouse",
    coordsOffset: { lat: 0.02, lng: 0.004 },
    pool: false,
    zoningStatus: "not_in_str_zone",
    targetSegment: "disney_families",
    extraRegulatoryFlags: [],
  }),

  // ---- Tampa (permitted) ----
  buildSeed({
    n: 4,
    market: "tampa",
    address: "3907 W Bay Breeze Ave",
    zip: "33611",
    beds: 4,
    baths: 3,
    sqft: 2200,
    monthlyRent: 2900,
    unitType: "single_family",
    coordsOffset: { lat: 0.01, lng: 0.01 },
    pool: true,
    targetSegment: "corporate_midterm",
  }),
  buildSeed({
    n: 5,
    market: "tampa",
    address: "1220 N Westshore Blvd, Unit 3B",
    zip: "33607",
    beds: 2,
    baths: 2,
    sqft: 1150,
    monthlyRent: 1950,
    unitType: "condo",
    coordsOffset: { lat: -0.015, lng: -0.005 },
    pool: false,
    hoaFee: 310,
    hoaStrAllowed: true,
    petPolicy: "not_allowed",
    targetSegment: "corporate_midterm",
  }),

  // ---- Fort Lauderdale / Broward (permitted) ----
  buildSeed({
    n: 6,
    market: "broward",
    address: "2211 NE 15th Terrace",
    zip: "33304",
    beds: 3,
    baths: 2,
    sqft: 1750,
    monthlyRent: 3400,
    unitType: "single_family",
    coordsOffset: { lat: 0.008, lng: -0.012 },
    pool: true,
    targetSegment: "couples_weekend",
  }),
  buildSeed({
    n: 7,
    market: "broward",
    address: "615 SW 10th Ave",
    zip: "33312",
    beds: 4,
    baths: 3,
    sqft: 1980,
    monthlyRent: 3000,
    unitType: "duplex",
    coordsOffset: { lat: -0.01, lng: 0.006 },
    pool: false,
    landlordSubletConsent: "verbal",
    targetSegment: "groups_events",
  }),

  // ---- Clearwater / St. Pete (permitted) ----
  buildSeed({
    n: 8,
    market: "clearwater-stpete",
    address: "1540 Gulf Boulevard",
    zip: "33767",
    beds: 3,
    baths: 2,
    sqft: 1420,
    monthlyRent: 2750,
    unitType: "condo",
    coordsOffset: { lat: 0.005, lng: -0.018 },
    pool: true,
    hoaFee: 420,
    hoaStrAllowed: true,
    targetSegment: "beach_families",
  }),
  buildSeed({
    n: 9,
    market: "clearwater-stpete",
    address: "822 49th Street S",
    zip: "33711",
    beds: 4,
    baths: 2,
    sqft: 1890,
    monthlyRent: 2400,
    unitType: "single_family",
    coordsOffset: { lat: -0.014, lng: 0.009 },
    pool: true,
    targetSegment: "snowbirds",
  }),

  // ---- Destin / Panhandle (permitted) ----
  buildSeed({
    n: 10,
    market: "destin",
    address: "214 Scenic Gulf Drive",
    zip: "32541",
    beds: 4,
    baths: 3,
    sqft: 2050,
    monthlyRent: 3600,
    unitType: "single_family",
    coordsOffset: { lat: 0.011, lng: -0.006 },
    pool: true,
    sofaBeds: 2,
    targetSegment: "beach_families",
  }),
  buildSeed({
    n: 11,
    market: "destin",
    address: "90 Harborview Grande, Unit 402",
    zip: "32541",
    beds: 2,
    baths: 2,
    sqft: 1080,
    monthlyRent: 2300,
    unitType: "condo",
    coordsOffset: { lat: -0.004, lng: 0.013 },
    pool: true,
    hoaFee: 540,
    hoaStrAllowed: true,
    targetSegment: "couples_weekend",
  }),

  // ---- Panama City Beach (permitted — best regulatory profile) ----
  buildSeed({
    n: 12,
    market: "panama-city-beach",
    address: "17805 Front Beach Road",
    zip: "32413",
    beds: 5,
    baths: 4,
    sqft: 2400,
    monthlyRent: 3100,
    unitType: "single_family",
    coordsOffset: { lat: 0.009, lng: 0.007 },
    pool: true,
    bunkRooms: 1,
    sofaBeds: 2,
    targetSegment: "groups_events",
  }),
  buildSeed({
    n: 13,
    market: "panama-city-beach",
    address: "6504 Thomas Drive",
    zip: "32408",
    beds: 3,
    baths: 2,
    sqft: 1500,
    monthlyRent: 2200,
    unitType: "townhouse",
    coordsOffset: { lat: -0.013, lng: -0.009 },
    pool: false,
    targetSegment: "beach_families",
  }),
  buildSeed({
    n: 14,
    market: "panama-city-beach",
    address: "2109 Shell Avenue",
    zip: "32408",
    beds: 2,
    baths: 1,
    sqft: 980,
    monthlyRent: 1650,
    unitType: "duplex",
    coordsOffset: { lat: 0.018, lng: -0.002 },
    pool: false,
    furnishedOnArrival: true,
    targetSegment: "medical_travel",
  }),

  // ---- Hard-kill markets — the regulatory kill must be visible ----
  buildSeed({
    n: 15,
    market: "miami-beach",
    address: "1420 Euclid Avenue",
    zip: "33139",
    beds: 3,
    baths: 2,
    sqft: 1600,
    monthlyRent: 4800,
    unitType: "single_family",
    coordsOffset: { lat: 0.004, lng: -0.003 },
    pool: true,
    targetSegment: "couples_weekend",
  }),
  buildSeed({
    n: 16,
    market: "orlando-city",
    address: "3312 Vineland Road",
    zip: "32811",
    beds: 4,
    baths: 3,
    sqft: 2000,
    monthlyRent: 2500,
    unitType: "single_family",
    coordsOffset: { lat: -0.007, lng: 0.011 },
    pool: true,
    targetSegment: "disney_families",
  }),
  buildSeed({
    n: 17,
    market: "key-west",
    address: "812 Truman Avenue",
    zip: "33040",
    beds: 2,
    baths: 2,
    sqft: 1100,
    monthlyRent: 5200,
    unitType: "condo",
    coordsOffset: { lat: 0.003, lng: 0.004 },
    pool: false,
    targetSegment: "couples_weekend",
  }),
  buildSeed({
    n: 18,
    market: "naples",
    address: "920 7th Avenue S",
    zip: "34102",
    beds: 3,
    baths: 2,
    sqft: 1700,
    monthlyRent: 4200,
    unitType: "single_family",
    coordsOffset: { lat: -0.005, lng: -0.006 },
    pool: true,
    targetSegment: "snowbirds",
  }),

  // ---- A couple more to round out the workable markets ----
  buildSeed({
    n: 19,
    market: "kissimmee",
    address: "77 Formosa Gardens Boulevard",
    zip: "34747",
    beds: 6,
    baths: 5,
    sqft: 3100,
    monthlyRent: 3850,
    unitType: "single_family",
    coordsOffset: { lat: 0.016, lng: -0.013 },
    pool: true,
    bunkRooms: 2,
    sofaBeds: 1,
    zoningStatus: "in_str_zone",
    targetSegment: "disney_families",
  }),
  buildSeed({
    n: 20,
    market: "broward",
    address: "4409 N Ocean Drive",
    zip: "33308",
    beds: 2,
    baths: 2,
    sqft: 1200,
    monthlyRent: 2600,
    unitType: "condo",
    coordsOffset: { lat: 0.013, lng: 0.015 },
    pool: true,
    hoaFee: 380,
    hoaStrAllowed: false,
    targetSegment: "couples_weekend",
  }),
  buildSeed({
    n: 21,
    market: "tampa",
    address: "9115 Causeway Blvd",
    zip: "33619",
    beds: 3,
    baths: 2,
    sqft: 1650,
    monthlyRent: 2150,
    unitType: "single_family",
    coordsOffset: { lat: 0.019, lng: -0.01 },
    pool: true,
    landlordSubletConsent: "not_asked",
    targetSegment: "groups_events",
  }),
];

/** Maps R2R settings-shaped assumptions into finance assumptions. See `src/store/useR2RStore.ts`. */
export function getAllR2RDeals(assumptions: R2RAssumptions = DEFAULT_R2R_ASSUMPTIONS) {
  return R2R_SEEDS.map((seed) => assembleR2RDeal(seed, assumptions));
}

export function getR2RDealById(id: string, assumptions: R2RAssumptions = DEFAULT_R2R_ASSUMPTIONS) {
  const seed = R2R_SEEDS.find((s) => s.id === id);
  return seed ? assembleR2RDeal(seed, assumptions) : undefined;
}
