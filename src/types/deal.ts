export type Tenure = "freehold" | "leasehold";
export type AgeCategory = "pre-1919" | "1919-1945" | "1945-1980" | "post-1980" | "new-build";
export type DealQuality = "excellent" | "good" | "marginal";
export type CapitalTag = "solo_doable" | "jv_recommended" | "jv_required";
export type Scenario = "best" | "base" | "worst";
export type FinanceStrategy = "bridge_brrr" | "cash_refi";
export type City = "liverpool" | "manchester";

export interface Coords {
  lat: number;
  lng: number;
}

export interface Comp {
  address: string;
  postcode: string;
  price: number;
  beds: number;
  sqft: number;
  soldDate: string;
  distanceMiles: number;
  /** Price Paid Data property type when known (terraced, semi-detached, …). */
  propertyType?: string;
}

export interface AirbnbComp {
  title: string;
  nightlyRate: number;
  occupancy: number;
  monthlyRevenue: number;
  beds: number;
  distanceMiles: number;
}

export interface CrimeData {
  score: number; // 1-10 lower is safer
  burglaryPer1000: number;
  asbPer1000: number;
  summary: string;
  month?: string;
  totalIncidents?: number;
}

export interface PlanningFlags {
  article4: boolean;
  selectiveLicensing: boolean;
  additionalHmo: boolean;
  conservation: boolean;
}

export interface FloodData {
  zone: 1 | 2 | 3;
  risk: "low" | "medium" | "high";
  sourceNote?: string;
}

export interface PhysicalLayer {
  tenure: Tenure;
  floorplanPresent: boolean;
  sqft: number;
  ageCategory: AgeCategory;
  leaseYearsRemaining?: number;
}

export interface ConversionLayer {
  score: number; // 1-10
  positives: string[];
  negatives: string[];
  currentBeds: number;
  targetBeds: number;
  conversionNotes: string;
}

export interface SoldCompsLayer {
  median: number;
  sampleSize: number;
  gdvRealistic: number;
  gdvStretch: number;
  gdvConservative: number;
  comps: Comp[];
  thinSample?: boolean;
  sourceNote?: string;
}

export interface RefurbBreakdown {
  kitchen: number;
  bathrooms: number;
  flooring: number;
  paint: number;
  electrics: number;
  boiler: number;
  roof: number;
  damp: number;
  bedroomConversion: number;
  saFinish: number;
  contingencyPct: number;
  contingencyAmount: number;
  total: number;
}

export interface ScenarioNumbers {
  purchasePrice: number;
  refurb: number;
  purchaseCosts: number;
  bridgeInterest?: number;
  bridgeFees?: number;
  totalProjectCost: number;
  cashIn: number;
  gdv: number;
  refinanceLtv: number;
  refinanceAmount: number;
  cashOut: number;
  capitalStuck: number;
  pullOutPct: number;
}

export interface FinancialLayer {
  bridgeBrrr: Record<Scenario, ScenarioNumbers>;
  cashRefi: Record<Scenario, ScenarioNumbers>;
  quality: DealQuality;
  capitalStuckBase: number;
}

export interface IncomeLayer {
  airbnb75th: number; // monthly
  councilLeaseLhaPct: number; // 75-90
  councilLeaseMonthly: number;
  hybridMonthly: number;
  lhaWeekly: number;
  notes: string;
}

export interface RegulatoryLayer {
  article4: boolean;
  selectiveLicensing: boolean;
  additionalHmo: boolean;
  conservation: boolean;
  floodZone: 1 | 2 | 3;
  floodRisk?: "low" | "medium" | "high";
  flags: string[];
}

export interface RiskMotivationLayer {
  daysOnMarket: number;
  priceReductions: number;
  auction: boolean;
  distressedKeywords: string[];
  crimeScore: number;
  crimeSummary?: string;
  burglaryPer1000?: number;
  asbPer1000?: number;
  ofstedRating: "Outstanding" | "Good" | "Requires Improvement" | "Inadequate" | "N/A";
  transportScore: number; // 1-10
  greenSpaceScore: number; // 1-10
  dealQualityScore: number; // 1-10
  reasoning: string;
}

export type EnrichmentStatus = "live" | "mock-fallback" | "pending";

export interface LayerEnrichmentMeta {
  status: EnrichmentStatus;
  updatedAt: string | null;
  source?: string;
  note?: string;
  thinSample?: boolean;
}

export interface DealEnrichment {
  crime: LayerEnrichmentMeta;
  flood: LayerEnrichmentMeta;
  comps: LayerEnrichmentMeta;
}

export interface VettingLayers {
  physical: PhysicalLayer;
  conversion: ConversionLayer;
  soldComps: SoldCompsLayer;
  refurb: RefurbBreakdown;
  financial: FinancialLayer;
  income: IncomeLayer;
  regulatory: RegulatoryLayer;
  risk: RiskMotivationLayer;
}

export interface Deal {
  id: string;
  address: string;
  postcode: string;
  city: City;
  area: string;
  price: number;
  sqft: number;
  beds: number;
  baths: number;
  propertyType: string;
  photos: string[];
  listingUrl: string;
  description: string;
  coords: Coords;
  tenure: Tenure;
  targetBeds: number;
  gdv: number;
  capitalStuck: number;
  monthlyIncome: number;
  quality: DealQuality;
  capitalTag: CapitalTag;
  cashInBase: number;
  layers: VettingLayers;
  createdAt: string;
  enrichment?: DealEnrichment;
}

export interface Listing {
  id: string;
  address: string;
  postcode: string;
  price: number;
  beds: number;
  sqft: number;
  photos: string[];
  coords: Coords;
  city: City;
  tenure: Tenure;
}

export interface ListingDetail extends Listing {
  baths: number;
  propertyType: string;
  description: string;
  listingUrl: string;
  floorplanUrl?: string;
}

export interface SearchParams {
  cities?: City[];
  postcodes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  tenure?: Tenure | "any";
  minSqft?: number;
  maxSqft?: number;
  qualities?: DealQuality[];
  maxCashIn?: number;
  query?: string;
}

export interface AppSettings {
  capital: number;
  defaultCities: City[];
  freeholdOnly: boolean;
  minPrice: number;
  maxPrice: number;
  bridgeMonths: number;
  bridgeRateMonthly: number;
  refinanceLtv: number;
  contingencyPct: number;
}
