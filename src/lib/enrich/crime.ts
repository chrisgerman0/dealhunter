import type { Coords, CrimeData } from "@/types/deal";
import { cached, TTL_12H_MS, roundCoord } from "./cache";
import { fetchJson } from "./http";

interface PoliceCrime {
  category?: string;
  month?: string;
}

const ESTIMATED_POPULATION_1MI = 12_000;
const POP_PER_1000 = ESTIMATED_POPULATION_1MI / 1000;

function scoreFromTotal(total: number): number {
  if (total <= 20) return 1;
  if (total <= 40) return 2;
  if (total <= 70) return 3;
  if (total <= 110) return 4;
  if (total <= 160) return 5;
  if (total <= 220) return 6;
  if (total <= 300) return 7;
  if (total <= 420) return 8;
  if (total <= 600) return 9;
  return 10;
}

function formatMonth(month: string | undefined): string {
  if (!month) return "the latest published month";
  const [y, m] = month.split("-");
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, 1));
  if (Number.isNaN(date.getTime())) return month;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function crimeFromIncidents(incidents: PoliceCrime[]): CrimeData & {
  month?: string;
  totalIncidents: number;
} {
  const total = incidents.length;
  const burglary = incidents.filter((c) => c.category === "burglary").length;
  const asb = incidents.filter((c) => c.category === "anti-social-behaviour").length;
  const month = incidents[0]?.month;
  const burglaryPer1000 = Math.round(((burglary * 12) / POP_PER_1000) * 10) / 10;
  const asbPer1000 = Math.round(((asb * 12) / POP_PER_1000) * 10) / 10;
  let score = scoreFromTotal(total);
  if (burglary >= 20) score = Math.min(10, score + 1);
  const summary =
    `${total} street-level crimes recorded in ${formatMonth(month)} within about one mile ` +
    `(police.uk), including ${burglary} burglaries and ${asb} anti-social behaviour incidents. ` +
    `Rates are annualised per 1,000 residents assuming ~${ESTIMATED_POPULATION_1MI.toLocaleString("en-GB")} people in that radius.`;
  return {
    score,
    burglaryPer1000,
    asbPer1000,
    summary,
    month,
    totalIncidents: total,
  };
}

export async function getLiveCrimeData(coords: Coords): Promise<CrimeData> {
  const lat = roundCoord(coords.lat);
  const lng = roundCoord(coords.lng);
  return cached(`crime:${lat},${lng}`, TTL_12H_MS, async () => {
    const incidents = await fetchJson<PoliceCrime[]>(
      `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}`
    );
    if (!Array.isArray(incidents)) {
      throw new Error("police.uk returned an unexpected payload");
    }
    const shaped = crimeFromIncidents(incidents);
    return {
      score: shaped.score,
      burglaryPer1000: shaped.burglaryPer1000,
      asbPer1000: shaped.asbPer1000,
      summary: shaped.summary,
      month: shaped.month,
      totalIncidents: shaped.totalIncidents,
    };
  });
}
