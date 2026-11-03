/**
 * ═══════════════════════════════════════════════════════════════════════
 *  WHERE AIRBNB COMPS COME FROM — THE SWAP POINT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Every nightly rate in the R2R model enters through one interface,
 * `StrCompSource`, and exactly one line decides which implementation is live:
 *
 *     export const ACTIVE_COMP_SOURCE = MOCK_COMP_SOURCE;
 *
 * Change that to `COMPETITOR_PRICING_SOURCE` and the whole experience reads
 * Chris's own scraper instead of the mock catalogue. Nothing else moves — not
 * the assembler, not the finance maths, not the verdict bands, not the UI.
 *
 * NO PAID VENDORS. Chris's ruling, 2026-11-03: "You are my price labs."
 * AirDNA / PriceLabs / RentCast are not options here and no code path reaches
 * for one. The comp engine is
 * `/root/.openclaw/workspace/nfstay-hq/scripts/competitor-pricing.js`, which
 * already computes min / max / median / avg / p25 / p75 nightly rates from live
 * Airbnb search pages.
 *
 * THE SCRAPER IS NOT MODIFIED. It stays Chris's tool, on its own cron, writing
 * its own file. This module adapts its output shape to ours — the dependency
 * points one way only.
 *
 * WHAT THE SCRAPER GIVES US, AND WHAT IT DOES NOT
 * -----------------------------------------------
 * Gives us (verified against `live-data/competitor-pricing.json`, 8 scans):
 *   · `pricePerNight.{min,max,median,avg,p25,p75}` — a real nightly-rate
 *     distribution, already de-duplicated and floor-guarded
 *   · `totalListings` — the sample size behind that distribution
 *   · `location` + `roomType` + a check-in/check-out window
 *
 * Does NOT give us:
 *   · per-listing rows, so there are no individual comps to table
 *   · coordinates, so a 250 m / 500 m / 1 km radius cannot be computed from it
 *   · occupancy, which Airbnb search pages do not expose at all
 *
 * That gap is reported, never papered over. An aggregate comp set comes back
 * flagged `aggregateOnly`, which makes the engine treat it as a thin sample and
 * fall back to the configured occupancy assumption — the behaviour that already
 * exists for sparse mock comps. The UI prints the real geo match it got.
 *
 * TO MAKE THE RADIUS REAL, the scraper needs per-listing coordinates. That is a
 * change to Chris's scraper, so it is his call, not a silent patch from here:
 * `SEARCHES` would gain a Florida entry and `fetchAirbnbPrices` would need to
 * keep each listing's `lat`/`lng` alongside its price. Until then, the honest
 * statement is "area-level aggregate", and that is what this module says.
 */
import type {
  FloridaMarket,
  GeoMatch,
  Season,
  StrComp,
  StrCompRequest,
} from "@/types/r2r";
import { GEO_MATCH_METERS } from "./thresholds";

/* ------------------------------------------------------------------ *
 * The interface
 * ------------------------------------------------------------------ */

/** What a source can actually supply. Drives the provenance line in the UI. */
export interface CompSourceCapabilities {
  /** Individual listings with their own rate and distance. */
  perListingRows: boolean;
  /** Real distance from the subject address, so a radius means something. */
  geoRadius: boolean;
  /** Occupancy. No public Airbnb surface exposes this; only a vendor claims to. */
  occupancy: boolean;
  /** Separate peak / shoulder / off rates rather than one blended figure. */
  seasonalRates: boolean;
}

export interface StrCompSet {
  /** The geo match actually achieved — not the one requested. */
  geoMatch: GeoMatch;
  radiusMeters: number;
  /** Per-listing comps. Empty for an area-level aggregate. */
  comps: StrComp[];
  /**
   * True when the figures are a distribution over an area rather than a set of
   * matched listings. Forces the thin-sample path.
   */
  aggregateOnly: boolean;
  /** Nightly rate by season, when the source can supply it directly. */
  medianNightly: Record<Season, number> | null;
  /** Listings behind the figures, aggregate or not. */
  sampleSize: number;
  /** Annual occupancy, 0-1. `null` means the source cannot measure it. */
  annualOccupancy: number | null;
  sourceId: string;
  /** Printed verbatim on the comps layer. States the basis, always. */
  sourceNote: string;
  /** ISO timestamp of the underlying data, not of this call. */
  dataAsOf: string | null;
}

export interface StrCompSource {
  id: string;
  label: string;
  capabilities: CompSourceCapabilities;
  /** One line for the Settings page. */
  description: string;
  fetchComps(request: StrCompRequest & { market: FloridaMarket }): Promise<StrCompSet>;
}

/* ------------------------------------------------------------------ *
 * Source 1 — the mock catalogue (live in this build)
 * ------------------------------------------------------------------ */

/**
 * The comps already baked into `src/data/mock-r2r-properties.ts`.
 *
 * Carries per-listing rows and distances because they were generated that way,
 * which is exactly why it is the wrong thing to ship against: the radius is
 * real arithmetic over invented listings. `isMock` on every deal says so in
 * the UI, on every card and every detail page.
 */
export const MOCK_COMP_SOURCE: StrCompSource = {
  id: "mock-catalogue",
  label: "Mock catalogue",
  description:
    "Deterministic comp sets generated inside the app. Shapes are real, numbers are not.",
  capabilities: {
    perListingRows: true,
    geoRadius: true,
    occupancy: true,
    seasonalRates: true,
  },
  // The assembler reads mock comps straight off the seed, so this source is
  // never actually called in the mock build. It exists so the mock path and
  // the live path describe themselves through the same interface.
  async fetchComps(request) {
    return {
      geoMatch: request.geoMatch,
      radiusMeters: GEO_MATCH_METERS[request.geoMatch],
      comps: [],
      aggregateOnly: false,
      medianNightly: null,
      sampleSize: 0,
      annualOccupancy: null,
      sourceId: "mock-catalogue",
      sourceNote: "Comps supplied by the mock catalogue on the seed.",
      dataAsOf: null,
    };
  },
};

/* ------------------------------------------------------------------ *
 * Source 2 — Chris's competitor-pricing scraper
 * ------------------------------------------------------------------ */

/** One scan row as `competitor-pricing.js` writes it. Do not widen loosely. */
export interface CompetitorPricingScan {
  location: string;
  roomType: string;
  dateRange: string;
  checkin: string;
  checkout: string;
  eventType: "baseline" | "event" | string;
  totalListings: number;
  extraction: string;
  pricePerNight: {
    min: number;
    max: number;
    median: number;
    avg: number;
    p25: number;
    p75: number;
  };
  samplePrices?: number[];
}

export interface CompetitorPricingFile {
  lastUpdated: string;
  scans: CompetitorPricingScan[];
}

/**
 * Market → the `location` name to look for in the scraper's `SEARCHES`.
 *
 * Adding a Florida market end-to-end is two edits, neither of which is in this
 * file's maths: add the search to the scraper's `SEARCHES` array, then add its
 * name here. The slug beside each name is the Airbnb location slug the
 * scraper's `query` field wants.
 */
export const MARKET_SCAN_NAMES: Record<FloridaMarket, { name: string; airbnbSlug: string }> = {
  kissimmee: { name: "Kissimmee", airbnbSlug: "Kissimmee--FL--United-States" },
  tampa: { name: "Tampa", airbnbSlug: "Tampa--FL--United-States" },
  broward: { name: "Fort Lauderdale", airbnbSlug: "Fort-Lauderdale--FL--United-States" },
  "clearwater-stpete": { name: "Clearwater", airbnbSlug: "Clearwater--FL--United-States" },
  destin: { name: "Destin", airbnbSlug: "Destin--FL--United-States" },
  "panama-city-beach": {
    name: "Panama City Beach",
    airbnbSlug: "Panama-City-Beach--FL--United-States",
  },
  "miami-beach": { name: "Miami Beach", airbnbSlug: "Miami-Beach--FL--United-States" },
  "orlando-city": { name: "Orlando", airbnbSlug: "Orlando--FL--United-States" },
  "key-west": { name: "Key West", airbnbSlug: "Key-West--FL--United-States" },
  naples: { name: "Naples", airbnbSlug: "Naples--FL--United-States" },
};

export interface CompetitorPricingAdapterOptions {
  /**
   * Multiplier onto the scraper's figures.
   *
   * The scraper currently queries `airbnb.co.uk` and reads `£` amounts, so a
   * Liverpool scan is sterling and needs a real rate. A Florida scan placed on
   * `airbnb.com` returns dollars and wants `1`. There is no default guess and
   * no silent conversion: whoever wires the source states the rate.
   */
  fxToUsd: number;
  /** Only `Entire home/apt` scans are comparable to a whole-unit arbitrage let. */
  roomType?: string;
}

/**
 * Scraper distribution → seasonal nightly rates.
 *
 * The scraper samples specific date windows, not seasons, so the seasonal
 * spread is taken from the price distribution instead: the top quartile of
 * live asks is what a well-run listing holds in peak, the median is shoulder,
 * the bottom quartile is off-season. That is an assumption, stated here and
 * printed in the UI — not a measurement.
 */
export function seasonalRatesFromScan(
  scan: CompetitorPricingScan,
  fxToUsd: number
): Record<Season, number> {
  const fx = (v: number) => Math.round(v * fxToUsd);
  return {
    peak: fx(scan.pricePerNight.p75),
    shoulder: fx(scan.pricePerNight.median),
    off: fx(scan.pricePerNight.p25),
  };
}

/**
 * Pure adapter: the scraper's file plus a request → one comp set.
 *
 * Exported separately from the source so it can be exercised without a network
 * call or a filesystem. Returns `null` when the scraper has no scan for the
 * market, which is a real answer — the caller must not substitute a guess.
 */
export function compSetFromCompetitorPricing(
  file: CompetitorPricingFile,
  request: StrCompRequest & { market: FloridaMarket },
  options: CompetitorPricingAdapterOptions
): StrCompSet | null {
  const target = MARKET_SCAN_NAMES[request.market];
  if (!target) return null;

  const wantedRoomType = options.roomType ?? "Entire home/apt";
  const matches = file.scans.filter(
    (s) =>
      s.location.toLowerCase().includes(target.name.toLowerCase()) &&
      s.roomType === wantedRoomType
  );
  if (matches.length === 0) return null;

  // Baseline windows describe normal trading. Event windows are a spike and
  // would overstate every month of the year if blended in.
  const baselines = matches.filter((s) => s.eventType === "baseline");
  const used = baselines.length > 0 ? baselines : matches;

  // Widest distribution across the baseline windows, weighted by listing count.
  const totalListings = used.reduce((sum, s) => sum + s.totalListings, 0);
  const weighted = (pick: (s: CompetitorPricingScan) => number) =>
    totalListings > 0
      ? used.reduce((sum, s) => sum + pick(s) * s.totalListings, 0) / totalListings
      : 0;

  const blended: CompetitorPricingScan = {
    ...used[0],
    totalListings,
    pricePerNight: {
      min: Math.round(Math.min(...used.map((s) => s.pricePerNight.min))),
      max: Math.round(Math.max(...used.map((s) => s.pricePerNight.max))),
      median: Math.round(weighted((s) => s.pricePerNight.median)),
      avg: Math.round(weighted((s) => s.pricePerNight.avg)),
      p25: Math.round(weighted((s) => s.pricePerNight.p25)),
      p75: Math.round(weighted((s) => s.pricePerNight.p75)),
    },
  };

  const medianNightly = seasonalRatesFromScan(blended, options.fxToUsd);

  return {
    // The request asked for a radius; the source can only answer at area
    // level. Report what was achieved, so no surface claims a 250 m match it
    // did not make.
    geoMatch: "radius_1km",
    radiusMeters: GEO_MATCH_METERS.radius_1km,
    comps: [],
    aggregateOnly: true,
    medianNightly,
    sampleSize: blended.totalListings,
    annualOccupancy: null,
    sourceId: "competitor-pricing",
    sourceNote:
      `${blended.totalListings} live Airbnb asks across ${used.length} baseline window(s) for ` +
      `${target.name} (${wantedRoomType}), via competitor-pricing.js. Area-level aggregate — ` +
      `the ${GEO_MATCH_LABEL[request.geoMatch]} match was requested but the scraper does not ` +
      `emit per-listing coordinates, so it could not be honoured. Seasonal spread is taken from ` +
      `the p25/median/p75 of live asks, not from measured seasons. Occupancy is not measurable ` +
      `from Airbnb search pages, so the configured assumption is used.`,
    dataAsOf: file.lastUpdated,
  };
}

const GEO_MATCH_LABEL: Record<GeoMatch, string> = {
  same_street: "same-street",
  radius_250m: "250 m",
  radius_500m: "500 m",
  radius_1km: "1 km",
};

/**
 * The live-scraper source.
 *
 * Reads through `/api/r2r/comps`, which does the filesystem read server-side —
 * the scraper's JSON lives outside this app and a browser cannot open it.
 */
export const COMPETITOR_PRICING_SOURCE: StrCompSource = {
  id: "competitor-pricing",
  label: "competitor-pricing.js (Chris's scraper)",
  description:
    "Live Airbnb asks from nfstay-hq/scripts/competitor-pricing.js. Area-level aggregate: real " +
    "nightly distribution, no per-listing coordinates, no occupancy.",
  capabilities: {
    perListingRows: false,
    geoRadius: false,
    occupancy: false,
    seasonalRates: false,
  },
  async fetchComps(request) {
    const params = new URLSearchParams({
      market: request.market,
      geoMatch: request.geoMatch,
      beds: String(request.beds),
    });
    const res = await fetch(`/api/r2r/comps?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Comp source returned ${res.status}`);
    return (await res.json()) as StrCompSet;
  },
};

/* ------------------------------------------------------------------ *
 * ⇩⇩⇩  THE ONE LINE  ⇩⇩⇩
 * ------------------------------------------------------------------ */

/**
 * Swap `MOCK_COMP_SOURCE` for `COMPETITOR_PRICING_SOURCE` to go live.
 *
 * Still mock because the scraper has no Florida scans in it yet — its
 * `SEARCHES` array is Liverpool and Manchester, in sterling. Pointing this at
 * the scraper today would return `null` for every Florida market, which is
 * worse than a mock that is labelled as one.
 */
export const ACTIVE_COMP_SOURCE: StrCompSource = MOCK_COMP_SOURCE;

export const ALL_COMP_SOURCES: StrCompSource[] = [
  MOCK_COMP_SOURCE,
  COMPETITOR_PRICING_SOURCE,
];
