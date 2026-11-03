/**
 * Monthly revenue curves.
 *
 * A flat annual average is the single most common error in Florida STR
 * underwriting. Central Florida earns its year between January and April on
 * snowbird and school-holiday demand; the Panhandle earns it in June and July.
 * A deal that "works at 68% occupancy" can still be cash-negative every
 * September, which is when the landlord's rent still arrives.
 *
 * Multipliers apply to the annual mean, so each curve sums to 12.0 by
 * construction — `normalise()` enforces that rather than trusting the table.
 */
import type { MonthRevenue, Season, SeasonalityModel } from "@/types/r2r";

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Raw shape by model. Normalised to mean 1.0 before use. */
const RAW_CURVES: Record<SeasonalityModel, readonly number[]> = {
  /** Snowbird + theme-park: peak Jan-Apr, trough Aug-Sep. */
  florida_snowbird: [1.25, 1.35, 1.45, 1.2, 0.85, 0.85, 0.9, 0.7, 0.65, 0.8, 0.9, 1.1],
  /** Panhandle beach: peak Jun-Jul, trough Nov-Jan. */
  beach_summer: [0.55, 0.6, 0.95, 1.1, 1.2, 1.5, 1.55, 1.15, 0.7, 0.75, 0.6, 0.65],
  /** No seasonality. Only honest for corporate / mid-term positioning. */
  flat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};

export const SEASONALITY_MODEL_LABELS: Record<SeasonalityModel, string> = {
  florida_snowbird: "Florida snowbird (peak Jan–Apr)",
  beach_summer: "Panhandle beach (peak Jun–Jul)",
  flat: "Flat (corporate / mid-term)",
};

function normalise(raw: readonly number[]): number[] {
  const mean = raw.reduce((s, v) => s + v, 0) / raw.length;
  return raw.map((v) => v / mean);
}

export function curveFor(model: SeasonalityModel): number[] {
  return normalise(RAW_CURVES[model]);
}

/** Peak ≥ 1.15× the mean, off ≤ 0.80×, everything else shoulder. */
export function seasonForMultiplier(multiplier: number): Season {
  if (multiplier >= 1.15) return "peak";
  if (multiplier <= 0.8) return "off";
  return "shoulder";
}

export function seasonsFor(model: SeasonalityModel): Season[] {
  return curveFor(model).map(seasonForMultiplier);
}

/** Which months a model treats as peak, e.g. ["Jan","Feb","Mar","Apr"]. */
export function peakMonthsFor(model: SeasonalityModel): string[] {
  const seasons = seasonsFor(model);
  return MONTH_LABELS.filter((_, i) => seasons[i] === "peak");
}

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export interface MonthlyCurveInput {
  model: SeasonalityModel;
  /** Annual mean occupancy, 0-1. */
  annualOccupancy: number;
  /** Nightly rate by season. */
  nightlyBySeason: Record<Season, number>;
}

export interface MonthlyCurveResult {
  months: MonthRevenue[];
  annualRevenue: number;
  /** What a flat annual average would have told you. Shown for contrast only. */
  flatAverageAnnualRevenue: number;
  /** Peak-month revenue ÷ off-month revenue. 1.0 = no seasonality. */
  seasonalityIndex: number;
  /** Revenue-weighted blended ADR across the year. */
  blendedAdr: number;
  peakMonths: string[];
}

/**
 * Build the 12-month revenue curve.
 *
 * Occupancy is capped at 97% — a 100%-occupied STR has no turnover gap and
 * does not exist. The cap is applied per month, so a hot peak does not let a
 * weak off-season hide behind an impossible January.
 */
export function buildMonthlyCurve({
  model,
  annualOccupancy,
  nightlyBySeason,
}: MonthlyCurveInput): MonthlyCurveResult {
  const curve = curveFor(model);
  const months: MonthRevenue[] = curve.map((multiplier, i) => {
    const season = seasonForMultiplier(multiplier);
    const occupancy = Math.min(0.97, annualOccupancy * multiplier);
    const adr = nightlyBySeason[season];
    const nights = DAYS_IN_MONTH[i] * occupancy;
    return {
      month: MONTH_LABELS[i],
      season,
      occupancy,
      adr,
      revenue: Math.round(nights * adr),
    };
  });

  const annualRevenue = months.reduce((s, m) => s + m.revenue, 0);
  const totalNights = months.reduce((s, m, i) => s + DAYS_IN_MONTH[i] * m.occupancy, 0);
  const blendedAdr = totalNights > 0 ? annualRevenue / totalNights : 0;

  // The naive figure: one blended rate at the flat annual occupancy.
  const flatAverageAnnualRevenue = Math.round(365 * annualOccupancy * blendedAdr);

  const peak = months.filter((m) => m.season === "peak");
  const off = months.filter((m) => m.season === "off");
  const peakAvg = peak.length ? peak.reduce((s, m) => s + m.revenue, 0) / peak.length : 0;
  const offAvg = off.length ? off.reduce((s, m) => s + m.revenue, 0) / off.length : 0;
  const seasonalityIndex = offAvg > 0 ? Number((peakAvg / offAvg).toFixed(2)) : 1;

  return {
    months,
    annualRevenue,
    flatAverageAnnualRevenue,
    seasonalityIndex,
    blendedAdr: Math.round(blendedAdr),
    peakMonths: peak.map((m) => m.month),
  };
}
