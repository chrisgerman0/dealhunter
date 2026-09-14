export function formatGBP(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000) {
    const k = value / 1000;
    return `£${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function qualityLabel(q: string): string {
  const map: Record<string, string> = {
    excellent: "Excellent",
    good: "Good",
    marginal: "Marginal",
  };
  return map[q] ?? q;
}

export function capitalTagLabel(tag: string): string {
  const map: Record<string, string> = {
    solo_doable: "Solo doable",
    jv_recommended: "JV recommended",
    jv_required: "JV required",
  };
  return map[tag] ?? tag;
}

export function qualityFromStuck(capitalStuck: number): "excellent" | "good" | "marginal" {
  if (capitalStuck < 15000) return "excellent";
  if (capitalStuck <= 30000) return "good";
  return "marginal";
}

export function capitalTagFromCashIn(cashIn: number, capital: number): "solo_doable" | "jv_recommended" | "jv_required" {
  if (cashIn <= capital) return "solo_doable";
  if (cashIn <= capital * 1.5) return "jv_recommended";
  return "jv_required";
}
