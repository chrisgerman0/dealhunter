/**
 * Florida STR regulation, per market.
 *
 * Sourced from `/root/.openclaw/workspace/reports/florida-r2r-data-sources-2026-11-03.md`
 * (statutory citations re-verified there on 2026-11-03). This is a static
 * reference table, not a feed: Florida ordinances change by council vote, so
 * every row carries its `sources` and a `verifiedOn` date and the UI shows both.
 *
 * THE RULE THAT DECIDES EVERYTHING
 * --------------------------------
 * Fla. Stat. § 509.032(7)(b) preempts local STR bans — but only for
 * ordinances adopted AFTER 1 June 2011. A pre-2011 ordinance survives
 * preemption in full. That single date splits the state in two and is why
 * Miami Beach and Key West are dead markets while Tampa and Broward are not.
 */
import type { FloridaMarket, SeasonalityModel, StrLegality } from "@/types/r2r";

export interface MarketProfile {
  id: FloridaMarket;
  label: string;
  city: string;
  county: string;
  /** Representative centre, used for map framing and mock geo. */
  center: { lat: number; lng: number };
  legality: StrLegality;
  grandfathered: boolean;
  /** Year the governing local ordinance was adopted. null = no local ordinance. */
  ordinanceYear: number | null;
  minimumStayNights: number;
  dbprLicenceRequired: boolean;
  dbprLicenceClass: string;
  dbprLicenceCost: number;
  localRegistrationRequired: boolean;
  localRegistrationCost: number;
  stateSalesTaxPct: number;
  touristDevelopmentTaxPct: number;
  platformRemitsStateTax: boolean;
  hostRemitsCountyTax: boolean;
  zoningCheckRequired: boolean;
  seasonality: SeasonalityModel;
  /** Typical review score needed to rank in this market. */
  reviewScoreBar: number;
  /** 1-10, higher = more hurricane / insurance exposure. */
  hurricaneExposure: number;
  /** Short verdict shown in the filter rail and on the regulatory layer. */
  verdict: string;
  sources: string[];
  verifiedOn: string;
}

/** Florida state transient rental sales tax. Fla. Stat. § 212.03. */
export const FL_STATE_SALES_TAX_PCT = 6;

export const MARKET_PROFILES: Record<FloridaMarket, MarketProfile> = {
  kissimmee: {
    id: "kissimmee",
    label: "Kissimmee / Disney corridor",
    city: "Kissimmee",
    county: "Osceola",
    center: { lat: 28.2919, lng: -81.4076 },
    legality: "permitted_with_zoning_check",
    grandfathered: false,
    ordinanceYear: 2019,
    minimumStayNights: 1,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 150,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 6,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: true,
    seasonality: "florida_snowbird",
    reviewScoreBar: 4.8,
    hurricaneExposure: 5,
    verdict:
      "Workable — but only inside an STR Overlay or STRPD zone. Standard residential zoning kills the deal.",
    sources: [
      "https://strlawmap.com/orlando-kissimmee-short-term-rental-rules/",
      "https://truenorthmanaged.com/orlando/osceola-county/osceola-county-rental-regulations/",
    ],
    verifiedOn: "2026-11-03",
  },
  tampa: {
    id: "tampa",
    label: "Tampa",
    city: "Tampa",
    county: "Hillsborough",
    center: { lat: 27.9506, lng: -82.4572 },
    legality: "permitted",
    grandfathered: false,
    ordinanceYear: 2017,
    minimumStayNights: 1,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 100,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 5,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: false,
    seasonality: "florida_snowbird",
    reviewScoreBar: 4.75,
    hurricaneExposure: 6,
    verdict: "Workable — registration plus business tax receipt, no ban, no minimum stay.",
    sources: ["https://florida-estate.com/regulations/"],
    verifiedOn: "2026-11-03",
  },
  broward: {
    id: "broward",
    label: "Fort Lauderdale / Broward",
    city: "Fort Lauderdale",
    county: "Broward",
    center: { lat: 26.1224, lng: -80.1373 },
    legality: "permitted",
    grandfathered: false,
    ordinanceYear: 2016,
    minimumStayNights: 1,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 350,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 6,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: false,
    seasonality: "florida_snowbird",
    reviewScoreBar: 4.8,
    hurricaneExposure: 7,
    verdict: "Workable — whole-home allowed with city registration and a business tax receipt.",
    sources: ["https://florida-estate.com/regulations/"],
    verifiedOn: "2026-11-03",
  },
  "clearwater-stpete": {
    id: "clearwater-stpete",
    label: "Clearwater / St. Pete",
    city: "Clearwater",
    county: "Pinellas",
    center: { lat: 27.9659, lng: -82.8001 },
    legality: "permitted",
    grandfathered: false,
    ordinanceYear: 2018,
    minimumStayNights: 1,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 200,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 6,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: false,
    seasonality: "florida_snowbird",
    reviewScoreBar: 4.8,
    hurricaneExposure: 7,
    verdict: "Workable — local vacation rental licence on top of the state DBPR licence.",
    sources: ["https://florida-estate.com/regulations/"],
    verifiedOn: "2026-11-03",
  },
  destin: {
    id: "destin",
    label: "Destin / Panhandle",
    city: "Destin",
    county: "Okaloosa",
    center: { lat: 30.3935, lng: -86.4958 },
    legality: "permitted",
    grandfathered: false,
    ordinanceYear: 2021,
    minimumStayNights: 1,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 300,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 5,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: false,
    seasonality: "beach_summer",
    reviewScoreBar: 4.85,
    hurricaneExposure: 8,
    verdict:
      "Workable — vacation rental licence plus proof of DBPR. Summer-peaked, so a soft June hurts.",
    sources: ["https://florida-estate.com/regulations/"],
    verifiedOn: "2026-11-03",
  },
  "panama-city-beach": {
    id: "panama-city-beach",
    label: "Panama City Beach",
    city: "Panama City Beach",
    county: "Bay",
    center: { lat: 30.1766, lng: -85.8055 },
    legality: "permitted",
    grandfathered: false,
    ordinanceYear: 2020,
    minimumStayNights: 1,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 375,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 4,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: false,
    seasonality: "beach_summer",
    reviewScoreBar: 4.7,
    hurricaneExposure: 8,
    verdict:
      "Best regulatory profile on this list — allowed in residential zones, no minimum stay, lowest bed tax at 4%.",
    sources: ["https://www.gowithsurge.com/blog/florida-short-term-rental-laws"],
    verifiedOn: "2026-11-03",
  },

  /* ---- Hard-kill markets. Kept in the model deliberately so the kill is
         visible and explained, rather than the market quietly missing. ---- */

  "miami-beach": {
    id: "miami-beach",
    label: "Miami Beach",
    city: "Miami Beach",
    county: "Miami-Dade",
    center: { lat: 25.7907, lng: -80.13 },
    legality: "prohibited",
    grandfathered: true,
    ordinanceYear: 2010,
    minimumStayNights: 180,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 1000,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 6,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: true,
    seasonality: "florida_snowbird",
    reviewScoreBar: 4.9,
    hurricaneExposure: 8,
    verdict:
      "DEAD — pre-2011 ordinance survives state preemption. STRs banned in single-family residential zones, fines historically $500-$5,000/day.",
    sources: [
      "https://www.miamibeachfl.gov/business/vacation-short-term-rentals/",
      "https://strlawmap.com/florida-short-term-rental-laws/",
    ],
    verifiedOn: "2026-11-03",
  },
  "orlando-city": {
    id: "orlando-city",
    label: "Orlando (city proper)",
    city: "Orlando",
    county: "Orange",
    center: { lat: 28.5384, lng: -81.3789 },
    legality: "prohibited",
    grandfathered: false,
    ordinanceYear: 2018,
    minimumStayNights: 30,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 275,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 6,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: true,
    seasonality: "florida_snowbird",
    reviewScoreBar: 4.8,
    hurricaneExposure: 5,
    verdict:
      "DEAD for arbitrage — whole-home STRs prohibited inside city limits; owner-occupied home-share only, which defeats the model. Use Osceola instead.",
    sources: ["https://strlawmap.com/orlando-kissimmee-short-term-rental-rules/"],
    verifiedOn: "2026-11-03",
  },
  "key-west": {
    id: "key-west",
    label: "Key West",
    city: "Key West",
    county: "Monroe",
    center: { lat: 24.5551, lng: -81.78 },
    legality: "prohibited",
    grandfathered: true,
    ordinanceYear: 1998,
    minimumStayNights: 30,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 1200,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 5,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: true,
    seasonality: "florida_snowbird",
    reviewScoreBar: 4.9,
    hurricaneExposure: 10,
    verdict:
      "DEAD — grandfathered pre-2011 rules enforce a 30-night minimum and transient licences are effectively unobtainable.",
    sources: ["https://awning.com/post/key-west-short-term-rental-regulations-2026"],
    verifiedOn: "2026-11-03",
  },
  naples: {
    id: "naples",
    label: "Naples",
    city: "Naples",
    county: "Collier",
    center: { lat: 26.142, lng: -81.7948 },
    legality: "restricted",
    grandfathered: true,
    ordinanceYear: 2007,
    minimumStayNights: 30,
    dbprLicenceRequired: true,
    dbprLicenceClass: "Vacation Rental — Dwelling",
    dbprLicenceCost: 650,
    localRegistrationRequired: true,
    localRegistrationCost: 400,
    stateSalesTaxPct: FL_STATE_SALES_TAX_PCT,
    touristDevelopmentTaxPct: 5,
    platformRemitsStateTax: true,
    hostRemitsCountyTax: true,
    zoningCheckRequired: true,
    seasonality: "florida_snowbird",
    reviewScoreBar: 4.85,
    hurricaneExposure: 8,
    verdict:
      "DEAD for nightly lets — ~30-day minimum stay in most residential zones. Marco Island is more flexible but needs an address-level check.",
    sources: ["https://agentsgather.com/short-term-rental-rules-in-southwest-florida-2026/"],
    verifiedOn: "2026-11-03",
  },
};

export const FLORIDA_MARKETS = Object.keys(MARKET_PROFILES) as FloridaMarket[];

/** Markets where whole-home nightly arbitrage can legally work. */
export const WORKABLE_MARKETS: FloridaMarket[] = FLORIDA_MARKETS.filter(
  (m) =>
    MARKET_PROFILES[m].legality === "permitted" ||
    MARKET_PROFILES[m].legality === "permitted_with_zoning_check"
);

export function marketProfile(market: FloridaMarket): MarketProfile {
  return MARKET_PROFILES[market];
}

export function marketLabel(market: FloridaMarket): string {
  return MARKET_PROFILES[market]?.label ?? market;
}

export function isFloridaMarket(value: unknown): value is FloridaMarket {
  return typeof value === "string" && value in MARKET_PROFILES;
}

/** Total guest-facing tax load: state + county. */
export function totalTaxPct(market: FloridaMarket): number {
  const p = MARKET_PROFILES[market];
  return p.stateSalesTaxPct + p.touristDevelopmentTaxPct;
}

/**
 * The hard kills for an address in this market, before any property-specific
 * check. Non-empty means the deal is dead — not penalised.
 */
export function marketKillReasons(market: FloridaMarket): string[] {
  const p = MARKET_PROFILES[market];
  const reasons: string[] = [];
  if (p.legality === "prohibited") {
    reasons.push(
      `${p.label}: whole-home short-term lets are prohibited${
        p.grandfathered ? ` (pre-2011 ordinance, ${p.ordinanceYear} — survives state preemption)` : ""
      }.`
    );
  }
  if (p.minimumStayNights >= 30) {
    reasons.push(
      `${p.label}: ${p.minimumStayNights}-night minimum stay removes the nightly arbitrage model.`
    );
  }
  return reasons;
}
