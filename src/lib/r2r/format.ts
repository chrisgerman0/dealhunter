/**
 * USD formatting and label maps for the R2R experience.
 *
 * Deliberately separate from `formatGBP` in `src/lib/format.ts` — BMV is a
 * sterling product and R2R is a dollar one. Nothing here touches the BMV
 * formatter, and nothing in BMV should call these.
 */
import type {
  GeoMatch,
  GuestSegment,
  PetPolicy,
  R2RScenario,
  Season,
  StrLegality,
  SubletConsent,
  UnitType,
  ZoningStatus,
} from "@/types/r2r";

export function formatUSD(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000) {
    const k = value / 1000;
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** `$1,450/mo`. */
export function formatUSDPerMonth(value: number, compact = false): string {
  return `${formatUSD(value, compact)}/mo`;
}

/** `$185/night`. */
export function formatUSDPerNight(value: number): string {
  return `${formatUSD(value)}/night`;
}

export function formatUsNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Fraction in, percent out. `0.634` → `"63%"`. */
export function formatPct(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** Percentage points, for occupancy headroom. `0.14` → `"+14pp"`. */
export function formatPp(fraction: number): string {
  const pp = Math.round(fraction * 100);
  return `${pp > 0 ? "+" : ""}${pp}pp`;
}

export function formatRoi(fraction: number): string {
  return `${(fraction * 100).toFixed(0)}%`;
}

export function formatPayback(months: number | null): string {
  if (months == null) return "Never";
  if (months < 12) return `${Math.round(months)} mo`;
  const years = months / 12;
  return `${years.toFixed(1)} yr`;
}

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  single_family: "Single-family",
  condo: "Condo",
  townhouse: "Townhouse",
  duplex: "Duplex",
  apartment: "Apartment",
};

export const SEASON_LABELS: Record<Season, string> = {
  peak: "Peak",
  shoulder: "Shoulder",
  off: "Off-season",
};

export const GEO_MATCH_LABELS: Record<GeoMatch, string> = {
  same_street: "Same street",
  radius_250m: "250 m radius",
  radius_500m: "500 m radius",
  radius_1km: "1 km radius",
};

export const LEGALITY_LABELS: Record<StrLegality, string> = {
  permitted: "Permitted",
  permitted_with_zoning_check: "Permitted — zoning check required",
  restricted: "Restricted",
  prohibited: "Prohibited",
};

export const ZONING_STATUS_LABELS: Record<ZoningStatus, string> = {
  in_str_zone: "Confirmed in STR zone",
  not_in_str_zone: "Not in an STR zone",
  unverified: "Not yet verified",
  not_applicable: "No zoning overlay in this market",
};

export const SUBLET_CONSENT_LABELS: Record<SubletConsent, string> = {
  granted: "Granted in writing",
  verbal: "Verbal only — not enforceable",
  not_asked: "Not asked yet",
  refused: "Refused",
};

export const PET_POLICY_LABELS: Record<PetPolicy, string> = {
  allowed: "Pets allowed",
  allowed_with_fee: "Pets allowed with fee",
  not_allowed: "No pets",
  unknown: "Unknown",
};

export const GUEST_SEGMENT_LABELS: Record<GuestSegment, string> = {
  disney_families: "Disney families",
  beach_families: "Beach families",
  snowbirds: "Snowbirds (long winter stays)",
  corporate_midterm: "Corporate / mid-term",
  couples_weekend: "Couples weekends",
  groups_events: "Groups & events",
  medical_travel: "Medical travel",
};

export const SCENARIO_LABELS: Record<R2RScenario, string> = {
  best: "Best",
  base: "Base",
  worst: "Worst",
};
