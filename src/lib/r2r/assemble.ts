/**
 * Listing + comp set → `R2RDeal`.
 *
 * This is the seam the live data lands on. The mock catalogue in
 * `src/data/mock-r2r-properties.ts` feeds seeds through this exact function,
 * so wiring a real feed means replacing where the seeds come from — not
 * rewriting any of the maths, layers or verdicts below.
 *
 * Nothing here reads the environment, the store or the network: given the same
 * seed it returns the same deal, which is what makes the mock catalogue safe
 * to build statically.
 */
import type {
  DealQuality,
  FloridaMarket,
  GeoMatch,
  GuestSegment,
  HoaInfo,
  PetPolicy,
  R2RArbitrageLayer,
  R2RDeal,
  R2RPhysicalLayer,
  R2RPositioningLayer,
  R2RRegulatoryLayer,
  R2RRiskLayer,
  R2RSeasonalityLayer,
  R2RSettings,
  R2RSleepsLayer,
  R2RStrCompsLayer,
  R2RWeakness,
  Season,
  StrComp,
  SubletConsent,
  UnitType,
  ZoningStatus,
} from "@/types/r2r";
import { capitalTagFromCashIn } from "@/lib/format";
import { marketProfile, marketKillReasons } from "./markets";
import { buildAllScenarios, buildSetupCapital } from "./finance";
import { buildMonthlyCurve, curveFor, seasonsFor } from "./seasonality";
import { GEO_MATCH_METERS, THIN_SAMPLE_BELOW, r2rQuality } from "./thresholds";

/* ------------------------------------------------------------------ *
 * Inputs
 * ------------------------------------------------------------------ */

/** Modelling assumptions. Mirrors the user-editable half of `R2RSettings`. */
export interface R2RAssumptions {
  furnishingBudgetPerBedroom: number;
  managementFeePct: number;
  cleaningFeePerTurnover: number;
  contingencyPct: number;
  /** Used in place of comp occupancy when the comp sample is thin. */
  assumedOccupancyPct: number;
  /** Average guest stay in nights — drives turnover count, so drives cleaning. */
  avgStayNights: number;
  /** Capital available, for the solo / JV tag. */
  capital: number;
}

export const DEFAULT_R2R_ASSUMPTIONS: R2RAssumptions = {
  furnishingBudgetPerBedroom: 3800,
  managementFeePct: 0,
  cleaningFeePerTurnover: 145,
  contingencyPct: 12,
  assumedOccupancyPct: 65,
  avgStayNights: 4,
  capital: 60000,
};

/**
 * The user's saved settings → the assumptions the model actually runs on.
 *
 * One function, used by Explore, the shortlist and every deal page, so a
 * figure can never differ between two surfaces because one of them mapped the
 * settings slightly differently. `avgStayNights` has no control on the settings
 * page yet, so it stays on the documented default rather than being invented
 * per caller.
 */
export function assumptionsFromSettings(settings: R2RSettings): R2RAssumptions {
  return {
    furnishingBudgetPerBedroom: settings.furnishingBudgetPerBedroom,
    managementFeePct: settings.managementFeePct,
    cleaningFeePerTurnover: settings.cleaningFeePerTurnover,
    contingencyPct: settings.contingencyPct,
    assumedOccupancyPct: settings.assumedOccupancyPct,
    avgStayNights: DEFAULT_R2R_ASSUMPTIONS.avgStayNights,
    capital: settings.capital,
  };
}

/**
 * Everything about one candidate unit that cannot be computed.
 *
 * Split deliberately: fields a rental feed returns (address, rent, beds) sit
 * alongside fields that only come from a human or a council lookup (zoning
 * status, landlord consent, HOA bylaws). The second group is what makes an
 * R2R deal un-automatable, and the UI labels it as such.
 */
export interface R2RSeed {
  id: string;
  address: string;
  city: string;
  county: string;
  zip: string;
  market: FloridaMarket;
  unitType: UnitType;
  monthlyRent: number;
  beds: number;
  baths: number;
  sqft: number;
  coords: { lat: number; lng: number };
  photos: string[];
  listingUrl: string;
  description: string;
  createdAt: string;

  /* Physical */
  pool: boolean;
  poolHeated?: boolean;
  parkingSpaces: number;
  acAgeYears: number | null;
  petPolicy: PetPolicy;
  hoa: HoaInfo;
  furnishedOnArrival: boolean;
  yearBuilt: number | null;
  physicalNotes: string;

  /* Sleeps configuration */
  sofaBeds: number;
  bunkRooms: number;
  sleepsScore: number;
  sleepsPositives: string[];
  sleepsNegatives: string[];
  sleepsNotes: string;

  /* STR comps */
  geoMatch: GeoMatch;
  comps: StrComp[];
  compsSourceNote?: string;

  /* Regulatory — the property-specific half; the market half comes from the profile */
  zoningStatus: ZoningStatus;
  landlordSubletConsent: SubletConsent;
  femaFloodZone: string;
  floodRisk: "low" | "moderate" | "high";
  extraRegulatoryFlags?: string[];

  /* Risk */
  landlordFlexibility: number;
  riskWatchItems: string[];
  riskReasoning: string;

  /* Positioning */
  targetSegment: GuestSegment;
  secondarySegments: GuestSegment[];
  usp: string;
  photoStrategy: string[];
  pricingStrategy: string[];
  minimumStayStrategy: string;
  weaknesses: R2RWeakness[];

  /** Per-deal override of the global assumptions. */
  assumptionOverrides?: Partial<R2RAssumptions>;
  /** False once this row comes from a live feed. */
  isMock?: boolean;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Mean seasonality multiplier for each season under a given curve. */
function seasonMultipliers(market: FloridaMarket): Record<Season, number> {
  const model = marketProfile(market).seasonality;
  const curve = curveFor(model);
  const seasons = seasonsFor(model);
  const sums: Record<Season, { total: number; count: number }> = {
    peak: { total: 0, count: 0 },
    shoulder: { total: 0, count: 0 },
    off: { total: 0, count: 0 },
  };
  curve.forEach((multiplier, i) => {
    const bucket = sums[seasons[i]];
    bucket.total += multiplier;
    bucket.count += 1;
  });
  return {
    peak: sums.peak.count ? sums.peak.total / sums.peak.count : 1,
    shoulder: sums.shoulder.count ? sums.shoulder.total / sums.shoulder.count : 1,
    off: sums.off.count ? sums.off.total / sums.off.count : 1,
  };
}

/* ------------------------------------------------------------------ *
 * Layer builders
 * ------------------------------------------------------------------ */

function buildStrCompsLayer(seed: R2RSeed, assumedOccupancy: number): R2RStrCompsLayer {
  const { comps, geoMatch, market } = seed;
  const radiusMeters = GEO_MATCH_METERS[geoMatch];
  const inRadius = comps.filter((c) =>
    geoMatch === "same_street" ? c.sameStreet : c.distanceMeters <= radiusMeters
  );
  const used = inRadius.length > 0 ? inRadius : comps;
  const sampleSize = used.length;
  const thinSample = sampleSize < THIN_SAMPLE_BELOW;

  const medianNightly: Record<Season, number> = {
    peak: Math.round(median(used.map((c) => c.nightlyPeak))),
    shoulder: Math.round(median(used.map((c) => c.nightlyShoulder))),
    off: Math.round(median(used.map((c) => c.nightlyOff))),
  };

  // A thin sample is not trusted for occupancy — fall back to the configured
  // assumption and say so, rather than underwriting on three listings.
  const compOccupancy = median(used.map((c) => c.occupancy));
  const annualOccupancy = thinSample ? assumedOccupancy : compOccupancy;

  const multipliers = seasonMultipliers(market);
  const occupancy: Record<Season, number> = {
    peak: Number(Math.min(0.97, annualOccupancy * multipliers.peak).toFixed(3)),
    shoulder: Number(Math.min(0.97, annualOccupancy * multipliers.shoulder).toFixed(3)),
    off: Number(Math.min(0.97, annualOccupancy * multipliers.off).toFixed(3)),
  };

  const blendedNightly =
    (medianNightly.peak + medianNightly.shoulder + medianNightly.off) / 3;

  const reviewScores = used
    .map((c) => c.reviewScore)
    .filter((s): s is number => typeof s === "number");

  return {
    geoMatch,
    radiusMeters,
    sampleSize,
    thinSample,
    medianNightly,
    occupancy,
    annualOccupancy: Number(annualOccupancy.toFixed(3)),
    revPar: Math.round(blendedNightly * annualOccupancy),
    medianReviewScore: reviewScores.length ? Number(median(reviewScores).toFixed(2)) : null,
    comps: [...used].sort((a, b) => a.distanceMeters - b.distanceMeters),
    sourceNote:
      seed.compsSourceNote ??
      (thinSample
        ? `Only ${sampleSize} comps inside the ${radiusMeters} m radius — occupancy falls back to the configured assumption.`
        : `${sampleSize} active comps inside the ${radiusMeters} m radius.`),
  };
}

function buildSleepsLayer(seed: R2RSeed): R2RSleepsLayer {
  const baseSleeps = seed.beds * 2;
  // A sofa bed sleeps 2; a bunk room converts an existing bedroom to sleep 4
  // instead of 2, so it adds 2 — never 4.
  const addedSleeps = seed.sofaBeds * 2 + seed.bunkRooms * 2;
  const setupCost = seed.sofaBeds * 950 + seed.bunkRooms * 1400;

  return {
    baseSleeps,
    sofaBeds: seed.sofaBeds,
    bunkRooms: seed.bunkRooms,
    addedSleeps,
    maxSleeps: baseSleeps + addedSleeps,
    setupCost,
    score: seed.sleepsScore,
    positives: seed.sleepsPositives,
    negatives: seed.sleepsNegatives,
    notes: seed.sleepsNotes,
  };
}

function buildRegulatoryLayer(seed: R2RSeed): R2RRegulatoryLayer {
  const p = marketProfile(seed.market);
  const killReasons = marketKillReasons(seed.market);
  const flags: string[] = [...(seed.extraRegulatoryFlags ?? [])];

  if (p.zoningCheckRequired && seed.zoningStatus === "not_in_str_zone") {
    killReasons.push(
      `${p.city}: address is outside the STR overlay / STRPD zone — nightly letting is not permitted here.`
    );
  }
  if (p.zoningCheckRequired && seed.zoningStatus === "unverified") {
    flags.push("Zoning not yet verified with county planning");
  }
  if (seed.hoa.present && seed.hoa.strAllowed === false) {
    killReasons.push("HOA bylaws prohibit short-term letting regardless of city rules.");
  }
  if (seed.hoa.present && seed.hoa.strAllowed === null) {
    flags.push("HOA bylaws not read");
  }
  if (seed.hoa.present && seed.hoa.minimumLeaseMonths && seed.hoa.minimumLeaseMonths >= 3) {
    killReasons.push(
      `HOA enforces a ${seed.hoa.minimumLeaseMonths}-month minimum lease — nightly letting is blocked.`
    );
  }
  if (seed.landlordSubletConsent === "refused") {
    killReasons.push("Landlord has refused consent to sublet. There is no deal without it.");
  }
  if (seed.landlordSubletConsent === "not_asked") {
    flags.push("Landlord sublet consent not yet requested");
  }
  if (seed.landlordSubletConsent === "verbal") {
    flags.push("Sublet consent is verbal only — get it in the lease");
  }
  if (p.hostRemitsCountyTax) {
    flags.push(`Host remits ${p.county} County bed tax (${p.touristDevelopmentTaxPct}%) directly`);
  }
  if (seed.floodRisk === "high") {
    flags.push(`FEMA zone ${seed.femaFloodZone} — high flood risk, insurance premium loaded`);
  }

  return {
    market: seed.market,
    city: p.city,
    county: p.county,
    legality: p.legality,
    grandfathered: p.grandfathered,
    ordinanceYear: p.ordinanceYear,
    minimumStayNights: p.minimumStayNights,
    dbprLicenceRequired: p.dbprLicenceRequired,
    dbprLicenceClass: p.dbprLicenceClass,
    dbprLicenceCost: p.dbprLicenceCost,
    localRegistrationRequired: p.localRegistrationRequired,
    localRegistrationCost: p.localRegistrationCost,
    stateSalesTaxPct: p.stateSalesTaxPct,
    touristDevelopmentTaxPct: p.touristDevelopmentTaxPct,
    platformRemitsStateTax: p.platformRemitsStateTax,
    hostRemitsCountyTax: p.hostRemitsCountyTax,
    zoningCheckRequired: p.zoningCheckRequired,
    zoningStatus: seed.zoningStatus,
    hoaStrAllowed: seed.hoa.present ? seed.hoa.strAllowed : null,
    landlordSubletConsent: seed.landlordSubletConsent,
    femaFloodZone: seed.femaFloodZone,
    floodRisk: seed.floodRisk,
    kill: killReasons.length > 0,
    killReasons,
    flags,
    sources: p.sources,
  };
}

function buildRiskLayer(
  seed: R2RSeed,
  comps: R2RStrCompsLayer,
  seasonalityIndex: number
): R2RRiskLayer {
  const p = marketProfile(seed.market);
  const competitionDensity = comps.sampleSize;

  // Density is scored against the comp radius: 20 listings inside 250 m is a
  // knife fight; the same 20 inside a kilometre is a healthy market.
  const perKm = competitionDensity / Math.max(0.25, comps.radiusMeters / 1000);
  const competitionScore = clamp(Math.round(perKm / 6), 1, 10);

  const seasonalityVolatility = clamp(Math.round((seasonalityIndex - 1) * 4 + 1), 1, 10);
  const hoaStrictness = seed.hoa.present
    ? seed.hoa.strAllowed === false
      ? 10
      : seed.hoa.strAllowed === null
        ? 7
        : clamp(3 + Math.round(seed.hoa.monthlyFee / 120), 3, 8)
    : 1;

  const overallRiskScore = clamp(
    Math.round(
      competitionScore * 0.25 +
        seasonalityVolatility * 0.25 +
        hoaStrictness * 0.2 +
        (11 - seed.landlordFlexibility) * 0.15 +
        p.hurricaneExposure * 0.15
    ),
    1,
    10
  );

  return {
    competitionDensity,
    competitionScore,
    seasonalityVolatility,
    hoaStrictness,
    landlordFlexibility: seed.landlordFlexibility,
    reviewScoreBar: p.reviewScoreBar,
    hurricaneExposure: p.hurricaneExposure,
    overallRiskScore,
    reasoning: seed.riskReasoning,
    watchItems: seed.riskWatchItems,
  };
}

function buildPositioningLayer(seed: R2RSeed): R2RPositioningLayer {
  return {
    targetSegment: seed.targetSegment,
    secondarySegments: seed.secondarySegments,
    usp: seed.usp,
    photoStrategy: seed.photoStrategy,
    pricingStrategy: seed.pricingStrategy,
    minimumStayStrategy: seed.minimumStayStrategy,
    weaknesses: seed.weaknesses,
  };
}

/* ------------------------------------------------------------------ *
 * The assembler
 * ------------------------------------------------------------------ */

export function assembleR2RDeal(seed: R2RSeed, globals = DEFAULT_R2R_ASSUMPTIONS): R2RDeal {
  const assumptions: R2RAssumptions = { ...globals, ...seed.assumptionOverrides };
  const p = marketProfile(seed.market);

  const sleeps = buildSleepsLayer(seed);
  const strComps = buildStrCompsLayer(seed, assumptions.assumedOccupancyPct / 100);

  const physical: R2RPhysicalLayer = {
    unitType: seed.unitType,
    beds: seed.beds,
    baths: seed.baths,
    sqft: seed.sqft,
    pool: seed.pool,
    poolHeated: seed.poolHeated ?? false,
    parkingSpaces: seed.parkingSpaces,
    acAgeYears: seed.acAgeYears,
    petPolicy: seed.petPolicy,
    hoa: seed.hoa,
    furnishedOnArrival: seed.furnishedOnArrival,
    yearBuilt: seed.yearBuilt,
    notes: seed.physicalNotes,
  };

  const regulatory = buildRegulatoryLayer(seed);

  const setupCapital = buildSetupCapital({
    bedrooms: seed.beds,
    furnishedOnArrival: seed.furnishedOnArrival,
    furnishingBudgetPerBedroom: assumptions.furnishingBudgetPerBedroom,
    sleepsUpgrade: sleeps.setupCost,
    monthlyRent: seed.monthlyRent,
    licenceFees:
      (regulatory.dbprLicenceRequired ? regulatory.dbprLicenceCost : 0) +
      (regulatory.localRegistrationRequired ? regulatory.localRegistrationCost : 0),
    contingencyPct: assumptions.contingencyPct,
  });

  const scenarios = buildAllScenarios({
    compOccupancy: strComps.annualOccupancy,
    nightlyBySeason: strComps.medianNightly,
    seasonalityModel: p.seasonality,
    cashInvested: setupCapital.total,
    costs: {
      monthlyRent: seed.monthlyRent,
      bedrooms: seed.beds,
      cleaningFeePerTurnover: assumptions.cleaningFeePerTurnover,
      avgStayNights: assumptions.avgStayNights,
      managementFeePct: assumptions.managementFeePct,
      hostRemittedTaxPct: regulatory.hostRemitsCountyTax
        ? regulatory.touristDevelopmentTaxPct
        : 0,
      hoaMonthlyFee: seed.hoa.present ? seed.hoa.monthlyFee : 0,
    },
  });

  const base = scenarios.base;
  const verdict = r2rQuality(base, regulatory.killReasons);

  const arbitrage: R2RArbitrageLayer = {
    scenarios,
    quality: verdict.quality,
    killed: verdict.killed,
    killReasons: regulatory.killReasons,
    scoreNotes: verdict.notes,
  };

  const curve = buildMonthlyCurve({
    model: p.seasonality,
    annualOccupancy: base.occupancy,
    nightlyBySeason: strComps.medianNightly,
  });

  // Mid-term fallback: a 1-3 month corporate or snowbird let at a premium over
  // the long-term rent. Not as profitable, but it survives a regulatory squeeze.
  const midTermRent = Math.round(seed.monthlyRent * 1.45);

  const seasonality: R2RSeasonalityLayer = {
    model: p.seasonality,
    months: curve.months,
    peakMonths: curve.peakMonths,
    annualRevenue: curve.annualRevenue,
    flatAverageAnnualRevenue: curve.flatAverageAnnualRevenue,
    seasonalityIndex: curve.seasonalityIndex,
    midTermFallback: {
      monthlyRent: midTermRent,
      minimumStayNights: 30,
      note:
        regulatory.minimumStayNights >= 30
          ? `A ${regulatory.minimumStayNights}-night minimum is the only legal model here, so mid-term is the deal, not the fallback.`
          : `30-night minimum lets at roughly ${Math.round(
              (midTermRent / seed.monthlyRent - 1) * 100
            )}% over the lease rent. Lower ceiling, but it dodges nightly-let rules and the cleaning bill.`,
    },
    notes: `${p.label} runs on a ${p.seasonality.replace(/_/g, " ")} curve — peak ${curve.peakMonths.join(
      ", "
    )}. Peak months gross ${curve.seasonalityIndex.toFixed(
      2
    )}× an off-season month, so a flat annual average hides the months that lose money.`,
  };

  const risk = buildRiskLayer(seed, strComps, curve.seasonalityIndex);
  const positioning = buildPositioningLayer(seed);

  return {
    id: seed.id,
    address: seed.address,
    city: seed.city,
    county: seed.county,
    zip: seed.zip,
    market: seed.market,
    unitType: seed.unitType,
    monthlyRent: seed.monthlyRent,
    beds: seed.beds,
    baths: seed.baths,
    sqft: seed.sqft,
    maxSleeps: sleeps.maxSleeps,
    photos: seed.photos,
    listingUrl: seed.listingUrl,
    description: seed.description,
    coords: seed.coords,

    netMonthlyProfit: base.netMonthlyProfit,
    cashToStart: setupCapital.total,
    cashOnCashRoi: base.cashOnCashRoi,
    paybackMonths: base.paybackMonths,
    breakEvenOccupancy: base.breakEvenOccupancy,
    compOccupancy: strComps.annualOccupancy,

    quality: verdict.quality,
    capitalTag: capitalTagFromCashIn(setupCapital.total, assumptions.capital),
    regulatoryKill: regulatory.kill,
    isMock: seed.isMock ?? true,
    createdAt: seed.createdAt,

    layers: {
      physical,
      sleeps,
      strComps,
      setupCapital,
      arbitrage,
      seasonality,
      regulatory,
      risk,
      positioning,
    },
  };
}

/** Re-tag an assembled deal against a different capital figure. */
export function retagForCapital(deal: R2RDeal, capital: number): R2RDeal {
  return { ...deal, capitalTag: capitalTagFromCashIn(deal.cashToStart, capital) };
}

export type { DealQuality };
