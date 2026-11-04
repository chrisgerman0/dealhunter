/**
 * Florida rent-to-rent (STR rental arbitrage) domain model.
 *
 * Mirrors `src/types/deal.ts` layer-for-layer but models a *lease*, not a
 * purchase: there is no GDV, no bridge, no refinance. The money question is
 * "does the nightly spread beat the rent plus the running costs, and how long
 * until the furnishing money comes back".
 *
 * Currency is USD throughout — use `formatUSD`, never `formatGBP`.
 */
import type { CapitalTag, Coords, DealQuality, EnrichmentStatus, LayerEnrichmentMeta } from "./deal";

export type { CapitalTag, Coords, DealQuality, EnrichmentStatus, LayerEnrichmentMeta };

/** Florida markets Deal Hunter knows the STR rules for. See `src/lib/r2r/markets.ts`. */
export type FloridaMarket =
  | "kissimmee"
  | "tampa"
  | "broward"
  | "clearwater-stpete"
  | "destin"
  | "panama-city-beach"
  | "miami-beach"
  | "orlando-city"
  | "key-west"
  | "naples";

export type UnitType = "single_family" | "condo" | "townhouse" | "duplex" | "apartment";

export type Season = "peak" | "shoulder" | "off";

export type R2RScenario = "best" | "base" | "worst";

/**
 * How a comp set was matched to the subject property. Recorded on every comp
 * set — a median nightly rate is meaningless without the radius it came from.
 */
export type GeoMatch = "same_street" | "radius_250m" | "radius_500m" | "radius_1km";

export type PetPolicy = "allowed" | "allowed_with_fee" | "not_allowed" | "unknown";

export type SeasonalityModel = "florida_snowbird" | "beach_summer" | "flat";

/**
 * STR legality for the subject address.
 *
 * `prohibited` is a hard kill, not a score penalty — Florida only preempts
 * local bans adopted after 1 June 2011, so pre-2011 ordinances (Miami Beach,
 * Key West) still stand and genuinely end the deal.
 */
export type StrLegality =
  | "permitted"
  | "permitted_with_zoning_check"
  | "restricted"
  | "prohibited";

export type ZoningStatus = "in_str_zone" | "not_in_str_zone" | "unverified" | "not_applicable";

export type SubletConsent = "granted" | "verbal" | "not_asked" | "refused";

export type GuestSegment =
  | "disney_families"
  | "beach_families"
  | "snowbirds"
  | "corporate_midterm"
  | "couples_weekend"
  | "groups_events"
  | "medical_travel";

/* ------------------------------------------------------------------ *
 * Layer 1 — Physical
 * ------------------------------------------------------------------ */

export interface HoaInfo {
  present: boolean;
  monthlyFee: number;
  /** Have the bylaws actually been read, or is this an assumption? */
  rulesVerified: boolean;
  /** null = unknown. `false` kills the deal the same way a city ban does. */
  strAllowed: boolean | null;
  minimumLeaseMonths: number | null;
  note: string;
}

export interface R2RPhysicalLayer {
  unitType: UnitType;
  beds: number;
  baths: number;
  sqft: number;
  pool: boolean;
  poolHeated: boolean;
  parkingSpaces: number;
  /** Years. Florida A/C dies at ~12-15 years and a dead A/C in July cancels bookings. */
  acAgeYears: number | null;
  petPolicy: PetPolicy;
  hoa: HoaInfo;
  furnishedOnArrival: boolean;
  yearBuilt: number | null;
  notes: string;
}

/* ------------------------------------------------------------------ *
 * Layer 2 — Sleeps configuration
 *
 * The R2R equivalent of BMV's bedroom conversion. Sleeps drives the nightly
 * rate harder than bedroom count does, and adding sleeps is furniture, not
 * building work.
 * ------------------------------------------------------------------ */

export interface R2RSleepsLayer {
  /** Beds × 2 — the honest starting point before any sofa bed. */
  baseSleeps: number;
  sofaBeds: number;
  bunkRooms: number;
  /** Sleeps added by sofa beds and bunk rooms. */
  addedSleeps: number;
  maxSleeps: number;
  /** Capital cost of the added sleeping capacity (rolls into layer 4). */
  setupCost: number;
  /** 1-10. How well this unit scales sleeps without feeling crowded. */
  score: number;
  positives: string[];
  negatives: string[];
  notes: string;
}

/* ------------------------------------------------------------------ *
 * Layer 3 — STR comps (the GDV equivalent; the layer that decides the deal)
 * ------------------------------------------------------------------ */

export interface StrComp {
  title: string;
  unitType: UnitType;
  beds: number;
  sleeps: number;
  nightlyPeak: number;
  nightlyShoulder: number;
  nightlyOff: number;
  /** Annual occupancy, 0-1. */
  occupancy: number;
  reviewScore: number | null;
  reviewCount: number;
  distanceMeters: number;
  sameStreet: boolean;
  listingUrl?: string;
}

export interface R2RStrCompsLayer {
  /** Geo match actually used for this set. Never assume — always display. */
  geoMatch: GeoMatch;
  radiusMeters: number;
  sampleSize: number;
  /** Fewer than `THIN_SAMPLE_BELOW` comps — bands kept, verdict softened. */
  thinSample: boolean;
  medianNightly: Record<Season, number>;
  occupancy: Record<Season, number>;
  annualOccupancy: number;
  /** Median nightly (blended) × annual occupancy. */
  revPar: number;
  medianReviewScore: number | null;
  comps: StrComp[];
  sourceNote?: string;
}

/* ------------------------------------------------------------------ *
 * Layer 4 — Furnishing & setup capital (the refurb equivalent)
 * ------------------------------------------------------------------ */

export interface R2RSetupCapitalLayer {
  furniturePerBedroom: number;
  bedrooms: number;
  furnitureBedrooms: number;
  livingAndDining: number;
  sleepsUpgrade: number;
  linens: number;
  kitchenKit: number;
  smartLock: number;
  wifiAndTech: number;
  photography: number;
  listingSetup: number;
  licenceFees: number;
  securityDeposit: number;
  firstMonthRent: number;
  lastMonthRent: number;
  contingencyPct: number;
  contingencyAmount: number;
  total: number;
  /** Refundable at lease end — recoverable, but still cash out on day one. */
  refundableDeposit: number;
  /** `total` less the refundable deposit: the money genuinely spent. */
  sunkCapital: number;
}

/* ------------------------------------------------------------------ *
 * Layer 5 — Arbitrage model
 * ------------------------------------------------------------------ */

export interface R2ROperatingCosts {
  /** Rent paid to the landlord — the lease cost, every month, occupied or not. */
  rentToLandlord: number;
  cleaning: number;
  utilities: number;
  internet: number;
  insurance: number;
  suppliesMaintenance: number;
  pms: number;
  managementFee: number;
  platformFee: number;
  /**
   * County tourist development tax the host remits directly, when applicable.
   *
   * Collected FROM the guest on top of the nightly rate, so it is a
   * pass-through and is NOT part of `total`. Reported because the money moves
   * through the host's account and failing to remit it is the most common
   * Florida compliance failure — not because the host funds it.
   */
  hostRemittedTax: number;
  hoaFee: number;
  total: number;
}

export interface R2RScenarioModel {
  occupancy: number;
  /** Blended ADR across the seasonality curve. */
  adrBlended: number;
  grossMonthlyRevenue: number;
  grossAnnualRevenue: number;
  costs: R2ROperatingCosts;
  netMonthlyProfit: number;
  netAnnualProfit: number;
  /** Cash out of pocket to open the doors (layer 4 total). */
  cashInvested: number;
  /** Annual net profit ÷ cash invested, as a fraction. */
  cashOnCashRoi: number;
  /** null when the deal never pays back. */
  paybackMonths: number | null;
  /** Occupancy at which net profit is exactly zero, as a fraction. */
  breakEvenOccupancy: number;
  /** Comp occupancy − break-even occupancy. Negative means under water. */
  occupancyHeadroom: number;
}

export interface R2RArbitrageLayer {
  scenarios: Record<R2RScenario, R2RScenarioModel>;
  quality: DealQuality;
  /** Regulatory kill overrides the score entirely. */
  killed: boolean;
  killReasons: string[];
  /** Plain-English reasons behind the quality tier. */
  scoreNotes: string[];
}

/* ------------------------------------------------------------------ *
 * Layer 6 — Revenue & seasonality
 * ------------------------------------------------------------------ */

export interface MonthRevenue {
  /** "Jan" … "Dec" */
  month: string;
  season: Season;
  occupancy: number;
  adr: number;
  revenue: number;
}

export interface R2RSeasonalityLayer {
  model: SeasonalityModel;
  months: MonthRevenue[];
  peakMonths: string[];
  annualRevenue: number;
  /** The naive flat-average figure, shown for contrast — never used to decide. */
  flatAverageAnnualRevenue: number;
  /** Peak-month revenue ÷ off-month revenue. */
  seasonalityIndex: number;
  midTermFallback: {
    monthlyRent: number;
    minimumStayNights: number;
    note: string;
  };
  notes: string;
}

/* ------------------------------------------------------------------ *
 * Layer 7 — Regulatory
 * ------------------------------------------------------------------ */

export interface R2RRegulatoryLayer {
  market: FloridaMarket;
  city: string;
  county: string;
  legality: StrLegality;
  /** Ordinance adopted on or before 1 June 2011 — Florida preemption does not reach it. */
  grandfathered: boolean;
  ordinanceYear: number | null;
  /** 1 = nightly lets allowed. 30 = the arbitrage model is dead. */
  minimumStayNights: number;
  dbprLicenceRequired: boolean;
  dbprLicenceClass: string;
  dbprLicenceCost: number;
  localRegistrationRequired: boolean;
  localRegistrationCost: number;
  stateSalesTaxPct: number;
  touristDevelopmentTaxPct: number;
  platformRemitsStateTax: boolean;
  /** When true the county bed tax is the host's job — the most common failure. */
  hostRemitsCountyTax: boolean;
  zoningCheckRequired: boolean;
  zoningStatus: ZoningStatus;
  hoaStrAllowed: boolean | null;
  landlordSubletConsent: SubletConsent;
  /** FEMA flood zone code, e.g. "X", "AE", "VE". */
  femaFloodZone: string;
  floodRisk: "low" | "moderate" | "high";
  /** True = hard kill. The arbitrage score is not shown as a verdict. */
  kill: boolean;
  killReasons: string[];
  flags: string[];
  sources: string[];
}

/* ------------------------------------------------------------------ *
 * Layer 8 — Risk
 * ------------------------------------------------------------------ */

export interface R2RRiskLayer {
  /** Active comps inside the comp radius. */
  competitionDensity: number;
  /** 1-10, higher = more crowded. */
  competitionScore: number;
  /** 1-10, higher = more violent swing between peak and off. */
  seasonalityVolatility: number;
  /** 1-10, higher = stricter HOA. */
  hoaStrictness: number;
  /** 1-10, higher = more flexible landlord. */
  landlordFlexibility: number;
  /** Review score needed to rank in this market. */
  reviewScoreBar: number;
  /** 1-10, higher = more hurricane/insurance exposure. */
  hurricaneExposure: number;
  /** 1-10, lower is safer. */
  overallRiskScore: number;
  reasoning: string;
  watchItems: string[];
}

/* ------------------------------------------------------------------ *
 * Layer 9 — Positioning
 * ------------------------------------------------------------------ */

export interface R2RWeakness {
  weakness: string;
  mitigation: string;
}

export interface R2RPositioningLayer {
  targetSegment: GuestSegment;
  secondarySegments: GuestSegment[];
  usp: string;
  photoStrategy: string[];
  pricingStrategy: string[];
  minimumStayStrategy: string;
  /** Honest weaknesses. An empty list here is a defect, not a clean deal. */
  weaknesses: R2RWeakness[];
}

/* ------------------------------------------------------------------ *
 * Deal
 * ------------------------------------------------------------------ */

export interface R2RVettingLayers {
  physical: R2RPhysicalLayer;
  sleeps: R2RSleepsLayer;
  strComps: R2RStrCompsLayer;
  setupCapital: R2RSetupCapitalLayer;
  arbitrage: R2RArbitrageLayer;
  seasonality: R2RSeasonalityLayer;
  regulatory: R2RRegulatoryLayer;
  risk: R2RRiskLayer;
  positioning: R2RPositioningLayer;
}

export interface R2RDealEnrichment {
  strComps: LayerEnrichmentMeta;
  regulatory: LayerEnrichmentMeta;
  flood: LayerEnrichmentMeta;
}

export interface R2RDeal {
  id: string;
  address: string;
  city: string;
  county: string;
  zip: string;
  market: FloridaMarket;
  unitType: UnitType;
  /** Landlord's asking monthly rent, USD. The BMV `price` equivalent. */
  monthlyRent: number;
  beds: number;
  baths: number;
  sqft: number;
  maxSleeps: number;
  photos: string[];
  listingUrl: string;
  description: string;
  coords: Coords;

  /* Lifted headline numbers so cards and filters never walk the layer tree. */
  netMonthlyProfit: number;
  /** Cash out of pocket on day one, including the refundable deposit. */
  cashToStart: number;
  /** Annual net ÷ cash invested, as a fraction. */
  cashOnCashRoi: number;
  paybackMonths: number | null;
  breakEvenOccupancy: number;
  /** Comp annual occupancy, for headroom against break-even. */
  compOccupancy: number;

  quality: DealQuality;
  capitalTag: CapitalTag;
  /** Regulatory hard kill. Overrides `quality` in every surface. */
  regulatoryKill: boolean;
  /** Always true in this build. Surfaced in the UI so no figure is mistaken for real. */
  isMock: boolean;
  createdAt: string;
  layers: R2RVettingLayers;
  enrichment?: R2RDealEnrichment;
}

/* ------------------------------------------------------------------ *
 * Rental-listing side (finding the unit to lease)
 * ------------------------------------------------------------------ */

export interface RentalListing {
  id: string;
  address: string;
  city: string;
  county?: string;
  zip: string;
  /** Monthly asking rent, USD. */
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  unitType: UnitType;
  photos: string[];
  coords: Coords;
  market?: FloridaMarket;
  listingUrl?: string;
  /** Provider feed this row came from, e.g. "rentcast". */
  source?: string;
  daysOnMarket?: number;
  petPolicy?: PetPolicy;
  hoaMonthlyFee?: number;
  pool?: boolean;
}

/**
 * Which feed produced the rows currently on screen.
 *
 * Three values, never ambiguous, and the UI must read differently for each:
 * `rentcast` and `apartmentguide` are REAL listings; `mock` is the sample
 * catalogue and is the only one allowed to say "sample data". A real scrape
 * labelled as mock is as much a defect as mock labelled as real.
 *
 * Produced by `getLiveR2RSeeds()` in `src/lib/r2r/live-deals.ts`.
 */
export type R2RSeedSource = "rentcast" | "mirror" | "apartmentguide" | "mock";

export interface RentalListingDetail extends RentalListing {
  description: string;
  listingUrl: string;
  yearBuilt?: number;
  parkingSpaces?: number;
  amenities?: string[];
}

export interface R2RSearchParams {
  markets?: FloridaMarket[];
  zips?: string[];
  minRent?: number;
  maxRent?: number;
  minBeds?: number;
  maxBeds?: number;
  unitTypes?: UnitType[];
  query?: string;
}

export interface StrCompRequest {
  coords: Coords;
  beds: number;
  /** Street name, required for `same_street` matching. */
  street?: string;
  geoMatch: GeoMatch;
}

/* ------------------------------------------------------------------ *
 * Settings / filters (persisted, per-mode — see `src/store/useDealStore.ts`)
 * ------------------------------------------------------------------ */

export interface R2RSettings {
  /** Cash available for deposits, furnishing and float, USD. */
  capital: number;
  targetMarkets: FloridaMarket[];
  maxMonthlyRent: number;
  furnishingBudgetPerBedroom: number;
  /** Target cash-on-cash ROI, as a percentage. */
  targetRoiPct: number;
  minNetMonthlyProfit: number;
  /** Management share of gross revenue, as a percentage. 0 = self-managed. */
  managementFeePct: number;
  cleaningFeePerTurnover: number;
  /** Occupancy to assume when comps are thin, as a percentage. */
  assumedOccupancyPct: number;
  seasonalityModel: SeasonalityModel;
  compRadiusDefault: GeoMatch;
  contingencyPct: number;
}

export interface R2RFilters {
  query: string;
  markets: FloridaMarket[];
  minRent: number;
  maxRent: number;
  minBeds: number;
  maxBeds: number;
  unitTypes: UnitType[];
  qualities: DealQuality[];
  maxCashToStart: number | null;
  /** Hard floor on net monthly profit, USD. */
  minNetProfit: number;
  /** Hard floor on cash-on-cash ROI, as a percentage. */
  minRoiPct: number;
  poolOnly: boolean;
  /** On by default — an STR-illegal market is not a deal. */
  hideRegulatoryKills: boolean;
}
