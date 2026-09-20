import { formatGBP } from "@/lib/format";

export type BmvTone = "strong" | "modest" | "none";

export interface GdvVerdict {
  asking: number;
  gdv: number;
  gap: number;
  pctBelow: number;
  refinance75: number;
  coversAsking: boolean;
  tone: BmvTone;
  headline: string;
  refinanceNote: string;
}

/** Asking vs live (or modelled) GDV — used on deal detail for a first-time buyer. */
export function gdvVerdict(asking: number, gdv: number): GdvVerdict {
  const gap = gdv - asking;
  const pctBelow = gdv > 0 ? gap / gdv : 0;
  const refinance75 = Math.round(gdv * 0.75);
  const coversAsking = refinance75 >= asking;

  let tone: BmvTone = "none";
  let headline: string;
  if (gdv <= 0) {
    headline = "No GDV available yet.";
  } else if (pctBelow >= 0.15) {
    tone = "strong";
    headline = `Asking is ${Math.round(pctBelow * 100)}% below nearby sold median (${formatGBP(gap)} of headroom vs Land Registry comps).`;
  } else if (pctBelow >= 0.05) {
    tone = "modest";
    headline = `Asking is ${Math.round(pctBelow * 100)}% below nearby sold median — a modest discount on current sold prices.`;
  } else if (pctBelow >= 0) {
    headline = "Asking is close to nearby sold median. Not a clear below-market buy on these comps.";
  } else {
    headline = `Asking is ${formatGBP(-gap)} above nearby sold median. Treat as full market, not BMV.`;
  }

  const refinanceNote = coversAsking
    ? `A 75% refinance of this GDV (${formatGBP(refinance75)}) would cover the asking price.`
    : `A 75% refinance of this GDV (${formatGBP(refinance75)}) would not cover the asking price — you would still have capital in.`;

  return { asking, gdv, gap, pctBelow, refinance75, coversAsking, tone, headline, refinanceNote };
}
