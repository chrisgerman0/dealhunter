/**
 * The R2R arbitrage model.
 *
 * Replaces BMV's bridge/BRRR maths entirely — there is no purchase, no GDV,
 * no refinance and no capital "stuck" in an asset. The questions are:
 *
 *   · what does the unit gross on the nightly market
 *   · what does it cost to run, including the landlord's rent every month
 *   · what is left
 *   · how long until the furnishing money is back
 *   · at what occupancy does it stop making money
 *
 * Cost benchmarks come from the 2026-11-03 Florida research report
 * (§5 Operating cost benchmarks). They are defaults, not truths: every one
 * is overridable from settings or per deal.
 */
import type {
  R2ROperatingCosts,
  R2RScenario,
  R2RScenarioModel,
  R2RSetupCapitalLayer,
  Season,
  SeasonalityModel,
} from "@/types/r2r";
import {
  PLATFORM_FEE_PCT,
  SCENARIO_ADR_FACTOR,
  SCENARIO_OCCUPANCY_FACTOR,
} from "./thresholds";
import { buildMonthlyCurve } from "./seasonality";

const DAYS_PER_MONTH = 365 / 12;

/* ------------------------------------------------------------------ *
 * Layer 4 — furnishing & setup capital
 * ------------------------------------------------------------------ */

export interface SetupCapitalInput {
  bedrooms: number;
  /** Already-furnished units skip most of the furniture spend. */
  furnishedOnArrival: boolean;
  furnishingBudgetPerBedroom: number;
  /** Capital cost of added sofa beds / bunk rooms (layer 2). */
  sleepsUpgrade: number;
  monthlyRent: number;
  /** DBPR + local registration, from the market profile. */
  licenceFees: number;
  contingencyPct: number;
  /** Months of rent held as a refundable security deposit. Florida norm is 1-2. */
  depositMonths?: number;
  /** Many Florida landlords want first + last up front on a sublet-permitted lease. */
  lastMonthUpFront?: boolean;
}

/**
 * Benchmarks: functional-to-mid furnishing, 2026 Florida retail.
 *
 * Deliberately not the $7k-12k/bedroom "Instagram-ready" tier from the
 * research report. Arbitrage lives or dies on payback months, and a
 * $40k fit-out on a 12-month lease is capital riding on a renewal the
 * landlord does not have to grant. Push the per-bedroom budget up in
 * settings if a market genuinely needs the finish to compete.
 */
const LIVING_AND_DINING_BASE = 4200;
const LINENS_PER_BEDROOM = 420;
const KITCHEN_KIT_BASE = 1450;
const SMART_LOCK = 320;
const WIFI_AND_TECH = 540;
const PHOTOGRAPHY = 450;
const LISTING_SETUP = 300;

export function buildSetupCapital(input: SetupCapitalInput): R2RSetupCapitalLayer {
  const {
    bedrooms,
    furnishedOnArrival,
    furnishingBudgetPerBedroom,
    sleepsUpgrade,
    monthlyRent,
    licenceFees,
    contingencyPct,
    depositMonths = 1,
    lastMonthUpFront = true,
  } = input;

  // A furnished unit still needs STR-grade linens, kitchen kit and styling —
  // landlord furniture is never guest-ready. Budget 25% of a full fit-out.
  const furnishFactor = furnishedOnArrival ? 0.25 : 1;

  const furnitureBedrooms = Math.round(bedrooms * furnishingBudgetPerBedroom * furnishFactor);
  const livingAndDining = Math.round(LIVING_AND_DINING_BASE * furnishFactor);
  const linens = Math.round(bedrooms * LINENS_PER_BEDROOM);
  const kitchenKit = Math.round(KITCHEN_KIT_BASE * (furnishedOnArrival ? 0.7 : 1));

  const securityDeposit = Math.round(monthlyRent * depositMonths);
  const firstMonthRent = Math.round(monthlyRent);
  const lastMonthRent = lastMonthUpFront ? Math.round(monthlyRent) : 0;

  const beforeContingency =
    furnitureBedrooms +
    livingAndDining +
    sleepsUpgrade +
    linens +
    kitchenKit +
    SMART_LOCK +
    WIFI_AND_TECH +
    PHOTOGRAPHY +
    LISTING_SETUP +
    licenceFees +
    securityDeposit +
    firstMonthRent +
    lastMonthRent;

  // Contingency covers the fit-out and licensing, not the rent and deposit —
  // those are known to the dollar and padding them overstates cash needed.
  const contingencyBase = beforeContingency - securityDeposit - firstMonthRent - lastMonthRent;
  const contingencyAmount = Math.round((contingencyBase * contingencyPct) / 100);
  const total = beforeContingency + contingencyAmount;

  return {
    furniturePerBedroom: Math.round(furnishingBudgetPerBedroom * furnishFactor),
    bedrooms,
    furnitureBedrooms,
    livingAndDining,
    sleepsUpgrade,
    linens,
    kitchenKit,
    smartLock: SMART_LOCK,
    wifiAndTech: WIFI_AND_TECH,
    photography: PHOTOGRAPHY,
    listingSetup: LISTING_SETUP,
    licenceFees,
    securityDeposit,
    firstMonthRent,
    lastMonthRent,
    contingencyPct,
    contingencyAmount,
    total,
    refundableDeposit: securityDeposit,
    sunkCapital: total - securityDeposit,
  };
}

/* ------------------------------------------------------------------ *
 * Layer 5 — operating costs and the scenario model
 * ------------------------------------------------------------------ */

export interface OperatingCostInput {
  monthlyRent: number;
  bedrooms: number;
  cleaningFeePerTurnover: number;
  /** Average guest stay in nights. Drives turnover count, so drives cleaning. */
  avgStayNights: number;
  managementFeePct: number;
  /** County tourist development tax %, only charged here if the host remits it. */
  hostRemittedTaxPct: number;
  hoaMonthlyFee: number;
  /**
   * Share of the cleaning bill recovered from the guest-facing cleaning fee,
   * as a percentage. Standard practice is to pass most of it on; modelling
   * cleaning as a pure cost understates every Florida deal by $500-900/mo.
   */
  cleaningRecoveryPct?: number;
  /** Optional overrides for the benchmark fixed costs. */
  utilities?: number;
  internet?: number;
  insurance?: number;
  suppliesMaintenance?: number;
  pms?: number;
}

/** Fixed monthly costs that do not move with occupancy. */
export interface FixedCosts {
  rentToLandlord: number;
  utilities: number;
  internet: number;
  insurance: number;
  suppliesMaintenance: number;
  pms: number;
  hoaFee: number;
  total: number;
}

export function buildFixedCosts(input: OperatingCostInput): FixedCosts {
  const { monthlyRent, bedrooms, hoaMonthlyFee } = input;

  // Report benchmarks for a 3-bed, scaled off bedroom count.
  const utilities = input.utilities ?? Math.round(170 + bedrooms * 45);
  const internet = input.internet ?? 85;
  const insurance = input.insurance ?? Math.round(130 + bedrooms * 35);
  const suppliesMaintenance = input.suppliesMaintenance ?? Math.round(90 + bedrooms * 40);
  const pms = input.pms ?? 35;

  const total =
    monthlyRent + utilities + internet + insurance + suppliesMaintenance + pms + hoaMonthlyFee;

  return {
    rentToLandlord: monthlyRent,
    utilities,
    internet,
    insurance,
    suppliesMaintenance,
    pms,
    hoaFee: hoaMonthlyFee,
    total,
  };
}

/**
 * Share of gross revenue genuinely taken off the top, as a fraction.
 *
 * Transient taxes are NOT in here. Florida state sales tax and the county
 * tourist development tax are added to the guest's bill on top of the nightly
 * rate — the host collects them, holds them, and remits them. They never come
 * out of the host's revenue.
 *
 * Including them was a real bug and it killed every deal in the catalogue: on
 * a Kissimmee 5-bed it charged $296/mo against a $31/mo net, so all 21 deals
 * read Marginal and the Good and Excellent bands were unreachable. Revenue
 * here is modelled ex-tax (nights × ADR), so deducting the tax from it
 * double-counted a pass-through. Found 2026-11-03.
 *
 * The remittance obligation is still real, and still the most common way a
 * Florida host gets caught out — it is surfaced on the regulatory layer via
 * `hostRemitsCountyTax`, where it belongs, rather than as a cost.
 */
export function variableRevenueShare(input: OperatingCostInput): number {
  return PLATFORM_FEE_PCT + input.managementFeePct / 100;
}

export const DEFAULT_CLEANING_RECOVERY_PCT = 80;

/**
 * Net cleaning cost per occupied night: one clean per `avgStayNights`, less
 * whatever the guest-facing cleaning fee recovers.
 */
export function cleaningPerOccupiedNight(input: OperatingCostInput): number {
  const stay = Math.max(1, input.avgStayNights);
  const recovery = (input.cleaningRecoveryPct ?? DEFAULT_CLEANING_RECOVERY_PCT) / 100;
  return (input.cleaningFeePerTurnover * (1 - recovery)) / stay;
}

/**
 * Occupancy at which net monthly profit is exactly zero.
 *
 * Monthly net is linear in occupancy O:
 *
 *   net(O) = O · [ days · adr · (1 − v) − days · cleanPerNight ] − fixed
 *
 * so break-even is `fixed / marginPerOccupancyPoint`. Returns 1 (i.e. never
 * profitable at any achievable occupancy) when the margin is non-positive.
 */
export function breakEvenOccupancy(
  adr: number,
  input: OperatingCostInput,
  fixed: FixedCosts
): number {
  const v = variableRevenueShare(input);
  const marginPerFullOccupancy =
    DAYS_PER_MONTH * adr * (1 - v) - DAYS_PER_MONTH * cleaningPerOccupiedNight(input);
  if (marginPerFullOccupancy <= 0) return 1;
  return Math.min(1, fixed.total / marginPerFullOccupancy);
}

export interface ScenarioInput {
  scenario: R2RScenario;
  /** Comp annual occupancy, 0-1. */
  compOccupancy: number;
  nightlyBySeason: Record<Season, number>;
  seasonalityModel: SeasonalityModel;
  costs: OperatingCostInput;
  /** Layer 4 total — the cash that has to come back. */
  cashInvested: number;
}

export function buildScenario(input: ScenarioInput): R2RScenarioModel {
  const { scenario, compOccupancy, nightlyBySeason, seasonalityModel, costs, cashInvested } = input;

  const occupancy = Math.min(0.95, compOccupancy * SCENARIO_OCCUPANCY_FACTOR[scenario]);
  const adrFactor = SCENARIO_ADR_FACTOR[scenario];
  const scenarioNightly: Record<Season, number> = {
    peak: Math.round(nightlyBySeason.peak * adrFactor),
    shoulder: Math.round(nightlyBySeason.shoulder * adrFactor),
    off: Math.round(nightlyBySeason.off * adrFactor),
  };

  const curve = buildMonthlyCurve({
    model: seasonalityModel,
    annualOccupancy: occupancy,
    nightlyBySeason: scenarioNightly,
  });

  const grossAnnualRevenue = curve.annualRevenue;
  const grossMonthlyRevenue = Math.round(grossAnnualRevenue / 12);

  const fixed = buildFixedCosts(costs);

  const platformFee = Math.round(grossMonthlyRevenue * PLATFORM_FEE_PCT);
  const managementFee = Math.round((grossMonthlyRevenue * costs.managementFeePct) / 100);
  const hostRemittedTax = Math.round((grossMonthlyRevenue * costs.hostRemittedTaxPct) / 100);

  const occupiedNightsPerMonth = DAYS_PER_MONTH * occupancy;
  const cleaning = Math.round(occupiedNightsPerMonth * cleaningPerOccupiedNight(costs));

  const operating: R2ROperatingCosts = {
    rentToLandlord: fixed.rentToLandlord,
    cleaning,
    utilities: fixed.utilities,
    internet: fixed.internet,
    insurance: fixed.insurance,
    suppliesMaintenance: fixed.suppliesMaintenance,
    pms: fixed.pms,
    managementFee,
    platformFee,
    hostRemittedTax,
    hoaFee: fixed.hoaFee,
    // `hostRemittedTax` is deliberately absent from this sum — see
    // `variableRevenueShare`. It is guest money passing through the account,
    // reported so the cashflow is visible, not an expense the host funds.
    total: fixed.total + cleaning + managementFee + platformFee,
  };

  const netMonthlyProfit = grossMonthlyRevenue - operating.total;
  const netAnnualProfit = netMonthlyProfit * 12;

  const cashOnCashRoi = cashInvested > 0 ? netAnnualProfit / cashInvested : 0;
  const paybackMonths =
    netMonthlyProfit > 0 ? Number((cashInvested / netMonthlyProfit).toFixed(1)) : null;

  const be = breakEvenOccupancy(curve.blendedAdr, costs, fixed);

  return {
    occupancy,
    adrBlended: curve.blendedAdr,
    grossMonthlyRevenue,
    grossAnnualRevenue,
    costs: operating,
    netMonthlyProfit,
    netAnnualProfit,
    cashInvested,
    cashOnCashRoi: Number(cashOnCashRoi.toFixed(4)),
    paybackMonths,
    breakEvenOccupancy: Number(be.toFixed(4)),
    occupancyHeadroom: Number((occupancy - be).toFixed(4)),
  };
}

export function buildAllScenarios(
  base: Omit<ScenarioInput, "scenario">
): Record<R2RScenario, R2RScenarioModel> {
  return {
    best: buildScenario({ ...base, scenario: "best" }),
    base: buildScenario({ ...base, scenario: "base" }),
    worst: buildScenario({ ...base, scenario: "worst" }),
  };
}

/* ------------------------------------------------------------------ *
 * Spread verdict — the GDV-callout equivalent
 * ------------------------------------------------------------------ */

export type SpreadTone = "strong" | "modest" | "none" | "dead";

export interface SpreadVerdict {
  monthlyRent: number;
  grossMonthlyRevenue: number;
  /** Gross STR revenue ÷ the rent paid out. 2.0 = revenue is double the rent. */
  rentMultiple: number;
  netMonthlyProfit: number;
  tone: SpreadTone;
  headline: string;
  headroomNote: string;
}

/**
 * The first thing to read on a deal page: does the nightly market pay enough
 * more than the landlord wants to be worth the work and the risk.
 *
 * Rent multiple is the industry shorthand (gross ÷ rent). Below ~1.8× there
 * is rarely enough left after costs; above ~2.5× the deal has real room.
 */
export function spreadVerdict(
  monthlyRent: number,
  model: R2RScenarioModel,
  killed = false
): SpreadVerdict {
  const rentMultiple = monthlyRent > 0 ? model.grossMonthlyRevenue / monthlyRent : 0;
  const headroomPp = Math.round(model.occupancyHeadroom * 100);

  const headroomNote =
    model.occupancyHeadroom > 0
      ? `Breaks even at ${Math.round(model.breakEvenOccupancy * 100)}% occupancy against ${Math.round(
          model.occupancy * 100
        )}% in the comps — ${headroomPp}pp of headroom.`
      : `Breaks even at ${Math.round(
          model.breakEvenOccupancy * 100
        )}% occupancy but the comps only run at ${Math.round(
          model.occupancy * 100
        )}% — under water before a single soft month.`;

  if (killed) {
    return {
      monthlyRent,
      grossMonthlyRevenue: model.grossMonthlyRevenue,
      rentMultiple: Number(rentMultiple.toFixed(2)),
      netMonthlyProfit: model.netMonthlyProfit,
      tone: "dead",
      headline:
        "Short-term letting is not legal at this address. The spread below is arithmetic, not an opportunity.",
      headroomNote,
    };
  }

  let tone: SpreadTone = "none";
  let headline: string;
  if (rentMultiple >= 2.5) {
    tone = "strong";
    headline = `Nightly market grosses ${rentMultiple.toFixed(
      2
    )}× the rent — strong spread with room for a soft season.`;
  } else if (rentMultiple >= 1.8) {
    tone = "modest";
    headline = `Nightly market grosses ${rentMultiple.toFixed(
      2
    )}× the rent — workable, but the margin is thin once costs land.`;
  } else if (rentMultiple > 0) {
    headline = `Nightly market grosses only ${rentMultiple.toFixed(
      2
    )}× the rent. Costs eat a spread this small.`;
  } else {
    headline = "No comp revenue available yet.";
  }

  return {
    monthlyRent,
    grossMonthlyRevenue: model.grossMonthlyRevenue,
    rentMultiple: Number(rentMultiple.toFixed(2)),
    netMonthlyProfit: model.netMonthlyProfit,
    tone,
    headline,
    headroomNote,
  };
}
