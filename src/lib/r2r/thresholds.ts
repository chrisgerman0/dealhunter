/**
 * ═══════════════════════════════════════════════════════════════════════
 *  R2R DEAL QUALITY — THE ONE FILE TO EDIT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Every Excellent / Good / Marginal verdict in the R2R experience comes from
 * the numbers below. Nothing else in the codebase hard-codes a threshold.
 * Change a number here and every card, badge, filter and detail page moves
 * with it — no other file needs touching.
 *
 * HOW THE VERDICT IS REACHED
 * --------------------------
 * 1. Regulatory kill is checked FIRST and overrides everything. An
 *    STR-illegal address is not a marginal deal, it is not a deal.
 * 2. Otherwise the BASE scenario is scored on four gates:
 *      · cash-on-cash ROI          (annual net profit ÷ cash invested)
 *      · net monthly profit        (dollars in hand after every cost)
 *      · payback months           (how long the furnishing money is at risk)
 *      · occupancy headroom       (comp occupancy − break-even occupancy)
 * 3. ALL FOUR gates must clear a tier for the deal to earn that tier.
 *    One weak gate drops the deal a tier. That is deliberate: a 40% ROI
 *    deal that breaks even at 72% occupancy in a 74%-occupancy market is
 *    one bad season from losing money, and should not read "Excellent".
 * 4. Anything that fails the Marginal floor is still shown as Marginal —
 *    the floor exists so the reason can be stated, not to hide the deal.
 *
 * WHY THESE NUMBERS (Florida STR arbitrage, 2026)
 * -----------------------------------------------
 * Calibrated against the cost benchmarks in the 2026-11-03 research report
 * and a functional-to-mid fit-out: roughly $26k-38k of cash to open a 3-4
 * bed, netting $600-1,600/mo in a workable market.
 *
 * · ROI — 45% cash-on-cash is the top of what one well-placed Florida unit
 *   does on a self-managed basis. Below 25% the return is not paying for the
 *   operational load of running a hospitality business.
 * · Net profit — under $600/mo one A/C replacement or one soft month erases
 *   the year. $1,200/mo is where a single unit is worth the attention.
 * · Payback — a residential Florida lease is typically 12 months with no
 *   obligation to renew. 24 months is already two renewals of landlord risk;
 *   past 36 months the furnishing capital is effectively the landlord's
 *   option, not yours.
 * · Headroom — the single most useful number in the model, and the one most
 *   often skipped. 12 points of occupancy headroom survives a soft season;
 *   4 points does not.
 */
import type { DealQuality, R2RScenarioModel } from "@/types/r2r";

export interface QualityGate {
  /** Cash-on-cash ROI as a fraction (0.6 = 60%). */
  minCashOnCashRoi: number;
  /** Net monthly profit, USD. */
  minNetMonthlyProfit: number;
  /** Payback must be at or under this many months. */
  maxPaybackMonths: number;
  /** Comp occupancy minus break-even occupancy, as a fraction (0.15 = 15pp). */
  minOccupancyHeadroom: number;
}

export const R2R_QUALITY_THRESHOLDS: {
  excellent: QualityGate;
  good: QualityGate;
  /** Below this floor the deal is Marginal *and* the reason is spelled out. */
  marginalFloor: QualityGate;
} = {
  excellent: {
    minCashOnCashRoi: 0.45,
    minNetMonthlyProfit: 1200,
    maxPaybackMonths: 24,
    minOccupancyHeadroom: 0.12,
  },
  good: {
    minCashOnCashRoi: 0.25,
    minNetMonthlyProfit: 600,
    maxPaybackMonths: 36,
    minOccupancyHeadroom: 0.06,
  },
  marginalFloor: {
    minCashOnCashRoi: 0.1,
    minNetMonthlyProfit: 200,
    maxPaybackMonths: 60,
    minOccupancyHeadroom: 0,
  },
};

/**
 * Comp sets smaller than this are flagged thin. A median nightly rate from
 * three listings is an anecdote; the UI says so rather than hiding it.
 */
export const THIN_SAMPLE_BELOW = 6;

/** Default comp radius when nothing is configured, in metres per geo match. */
export const GEO_MATCH_METERS = {
  same_street: 120,
  radius_250m: 250,
  radius_500m: 500,
  radius_1km: 1000,
} as const;

/**
 * Scenario occupancy as a multiple of the comp annual occupancy.
 * Worst case assumes you under-perform the market while you build reviews.
 */
export const SCENARIO_OCCUPANCY_FACTOR: Record<"best" | "base" | "worst", number> = {
  best: 1.1,
  base: 1.0,
  worst: 0.78,
};

/** Scenario ADR as a multiple of the comp median. */
export const SCENARIO_ADR_FACTOR: Record<"best" | "base" | "worst", number> = {
  best: 1.08,
  base: 1.0,
  worst: 0.9,
};

/** Airbnb host service fee on gross, as a fraction. */
export const PLATFORM_FEE_PCT = 0.03;

interface GateResult {
  passed: boolean;
  failures: string[];
}

function checkGate(model: R2RScenarioModel, gate: QualityGate): GateResult {
  const failures: string[] = [];
  if (model.cashOnCashRoi < gate.minCashOnCashRoi) {
    failures.push(
      `ROI ${(model.cashOnCashRoi * 100).toFixed(0)}% below ${(gate.minCashOnCashRoi * 100).toFixed(0)}%`
    );
  }
  if (model.netMonthlyProfit < gate.minNetMonthlyProfit) {
    failures.push(
      `net $${Math.round(model.netMonthlyProfit).toLocaleString("en-US")}/mo below $${gate.minNetMonthlyProfit.toLocaleString("en-US")}`
    );
  }
  if (model.paybackMonths == null || model.paybackMonths > gate.maxPaybackMonths) {
    failures.push(
      model.paybackMonths == null
        ? "never pays back"
        : `payback ${Math.round(model.paybackMonths)}mo over ${gate.maxPaybackMonths}mo`
    );
  }
  if (model.occupancyHeadroom < gate.minOccupancyHeadroom) {
    failures.push(
      `headroom ${(model.occupancyHeadroom * 100).toFixed(0)}pp below ${(gate.minOccupancyHeadroom * 100).toFixed(0)}pp`
    );
  }
  return { passed: failures.length === 0, failures };
}

export interface R2RQualityVerdict {
  quality: DealQuality;
  /** True when a regulatory kill decided this, not the maths. */
  killed: boolean;
  /** Plain-English notes — what cleared, what did not. */
  notes: string[];
}

/**
 * The single entry point for an R2R quality verdict.
 *
 * @param base       the BASE scenario (never best, never worst)
 * @param killReasons regulatory hard kills; non-empty forces Marginal
 */
export function r2rQuality(base: R2RScenarioModel, killReasons: string[] = []): R2RQualityVerdict {
  if (killReasons.length > 0) {
    return {
      quality: "marginal",
      killed: true,
      notes: ["Regulatory kill overrides the arbitrage score.", ...killReasons],
    };
  }

  const excellent = checkGate(base, R2R_QUALITY_THRESHOLDS.excellent);
  if (excellent.passed) {
    return {
      quality: "excellent",
      killed: false,
      notes: ["Clears every Excellent gate on the base scenario."],
    };
  }

  const good = checkGate(base, R2R_QUALITY_THRESHOLDS.good);
  if (good.passed) {
    return {
      quality: "good",
      killed: false,
      notes: [`Good, not Excellent — ${excellent.failures.join("; ")}.`],
    };
  }

  const floor = checkGate(base, R2R_QUALITY_THRESHOLDS.marginalFloor);
  return {
    quality: "marginal",
    killed: false,
    notes: floor.passed
      ? [`Marginal — ${good.failures.join("; ")}.`]
      : [`Below the Marginal floor — ${floor.failures.join("; ")}.`],
  };
}
