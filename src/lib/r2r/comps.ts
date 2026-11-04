/**
 * ═══════════════════════════════════════════════════════════════════════
 *  WHERE AIRBNB COMPS COME FROM — THE SWAP POINT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Every nightly rate in the R2R model enters through one interface,
 * `StrCompSource`. `ACTIVE_COMP_SOURCE` at the bottom of this file decides
 * which implementation is live.
 *
 * NO PAID VENDORS. Chris's ruling, 2026-11-03: "You are my price labs."
 * AirDNA / PriceLabs / RentCast are not options for comps and no code path
 * here reaches for one.
 *
 * Chris already owns a scraper for this idea —
 * `nfstay-hq/scripts/competitor-pricing.js` — but it is Liverpool/Manchester,
 * sterling, on its own cron, and the hard rule for this build is "do not
 * touch nfstay-hq." So this file does not read its output file or depend on
 * its cron. Instead `src/lib/r2r/airbnb-live.ts` is Deal Hunter's own,
 * Florida-native, USD implementation of the same idea: same embedded-JSON
 * extraction technique, same live Airbnb search pages, verified working
 * end-to-end on 2026-11-04 (see that file's header for what was proven).
 *
 * It goes further than the aggregate-only design this file used to have:
 * live testing showed the search page still carries each listing's lat/lng,
 * so comps here are real per-listing rows with a real geo radius — not an
 * area-level distribution standing in for one.
 */
import type {
  FloridaMarket,
  GeoMatch,
  Season,
  StrComp,
  StrCompRequest,
} from "@/types/r2r";
import { GEO_MATCH_METERS } from "./thresholds";
import { fetchMarketAirbnbScan, haversineMeters, type LiveAirbnbListing } from "./airbnb-live";

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

const GEO_MATCH_LABEL: Record<GeoMatch, string> = {
  same_street: "same-street",
  radius_250m: "250 m",
  radius_500m: "500 m",
  radius_1km: "1 km",
};

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function quantile(values: number[], q: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
}

/* ------------------------------------------------------------------ *
 * Source 1 — the mock catalogue (fallback when the live scrape fails)
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
 * Source 2 — Deal Hunter's own live Airbnb scrape
 * ------------------------------------------------------------------ */

function toStrComp(listing: LiveAirbnbListing, distanceMeters: number, beds: number): StrComp {
  return {
    title: listing.title,
    // Not measured per listing — see airbnb-live.ts header. Stated as the
    // subject's own bed count, never presented as something read off the page.
    unitType: "single_family",
    beds,
    sleeps: beds * 2,
    nightlyPeak: listing.nightlyUsd,
    nightlyShoulder: listing.nightlyUsd,
    nightlyOff: listing.nightlyUsd,
    occupancy: 0,
    reviewScore: listing.reviewScore,
    reviewCount: listing.reviewCount,
    distanceMeters: Math.round(distanceMeters),
    sameStreet: distanceMeters <= GEO_MATCH_METERS.same_street,
    listingUrl: undefined,
  };
}

/**
 * Pure adapter: a market's live listing pool, a request → one comp set.
 * Exported separately so it can be exercised without a network call.
 */
export function compSetFromLiveListings(
  scan: { listings: LiveAirbnbListing[]; fetchedAt: string },
  request: StrCompRequest & { market: FloridaMarket }
): StrCompSet {
  const withDistance = scan.listings.map((l) => ({
    listing: l,
    distanceMeters: haversineMeters(request.coords, { lat: l.lat, lng: l.lng }),
  }));

  // "same_street" cannot be honoured — Airbnb's public search page carries no
  // street address, only an approximate (privacy-jittered) point. Report the
  // tightest band we can actually measure instead of pretending to match it.
  const requestedMatch: GeoMatch = request.geoMatch === "same_street" ? "radius_250m" : request.geoMatch;
  const bandsInOrder: GeoMatch[] = ["radius_250m", "radius_500m", "radius_1km"];
  const startIdx = Math.max(0, bandsInOrder.indexOf(requestedMatch));

  let achieved: GeoMatch = bandsInOrder[startIdx] ?? "radius_1km";
  let inRadius = withDistance.filter((d) => d.distanceMeters <= GEO_MATCH_METERS[achieved]);

  // Widen if the requested band came back empty — a real but honestly-reported
  // compromise, same principle as the old aggregate-only fallback.
  for (let i = startIdx + 1; inRadius.length === 0 && i < bandsInOrder.length; i++) {
    achieved = bandsInOrder[i];
    inRadius = withDistance.filter((d) => d.distanceMeters <= GEO_MATCH_METERS[achieved]);
  }

  const prices = inRadius.map((d) => d.listing.nightlyUsd);
  const medianNightly: Record<Season, number> =
    prices.length > 0
      ? {
          peak: Math.round(quantile(prices, 0.75)),
          shoulder: Math.round(median(prices)),
          off: Math.round(quantile(prices, 0.25)),
        }
      : { peak: 0, shoulder: 0, off: 0 };

  const comps = inRadius
    .map((d) => toStrComp(d.listing, d.distanceMeters, request.beds))
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  const requestedLabel = GEO_MATCH_LABEL[request.geoMatch];
  const achievedLabel = GEO_MATCH_LABEL[achieved];
  const matchNote =
    request.geoMatch === "same_street"
      ? `"same-street" was requested but Airbnb's public search page carries no street address, only an ` +
        `approximate point — the tightest band actually measurable (${achievedLabel}) was used instead.`
      : achieved !== requestedMatch
        ? `${requestedLabel} was requested and came back empty, so the band was widened to ${achievedLabel}.`
        : `${achievedLabel} match, as requested.`;

  return {
    geoMatch: achieved,
    radiusMeters: GEO_MATCH_METERS[achieved],
    comps,
    aggregateOnly: false,
    medianNightly: prices.length > 0 ? medianNightly : null,
    sampleSize: comps.length,
    annualOccupancy: null,
    sourceId: "airbnb-live",
    sourceNote:
      `${comps.length} live Airbnb entire-home listings within ${matchNote} ` +
      `Scraped from airbnb.com, ${scan.fetchedAt.slice(0, 10)}. Seasonal spread (peak/shoulder/off) is the ` +
      `p75/median/p25 of the live price distribution, not measured seasons. Occupancy is not measurable from ` +
      `Airbnb search pages, so the configured assumption is used. Comps are not filtered by bedroom count — ` +
      `the search page does not expose it per listing.`,
    dataAsOf: scan.fetchedAt,
  };
}

/**
 * The live-scrape source. No API key, no vendor — reads airbnb.com directly.
 * Can fail (network, rate limit, page-shape change); callers must catch and
 * fall back rather than let a failed scrape take down deal assembly.
 */
export const LIVE_AIRBNB_SOURCE: StrCompSource = {
  id: "airbnb-live",
  label: "Live Airbnb scrape (Deal Hunter's own)",
  description:
    "Real-time Airbnb entire-home listings for the target market, scraped directly from airbnb.com. " +
    "Per-listing coordinates give a real geo radius. No occupancy, no vendor, no key required.",
  capabilities: {
    perListingRows: true,
    geoRadius: true,
    occupancy: false,
    seasonalRates: false,
  },
  async fetchComps(request) {
    const scan = await fetchMarketAirbnbScan(request.market);
    return compSetFromLiveListings(scan, request);
  },
};

/* ------------------------------------------------------------------ *
 * ⇩⇩⇩  THE ONE LINE  ⇩⇩⇩
 * ------------------------------------------------------------------ */

/**
 * Live by default — scraping needs no key, so there is no "unkeyed" state to
 * guard. `src/lib/r2r/live-deals.ts` still wraps every call in a try/catch and
 * falls back to the mock catalogue per-market if a scrape fails, so a single
 * blocked or malformed fetch degrades one market, never the whole app.
 */
export const ACTIVE_COMP_SOURCE: StrCompSource = LIVE_AIRBNB_SOURCE;

export const ALL_COMP_SOURCES: StrCompSource[] = [MOCK_COMP_SOURCE, LIVE_AIRBNB_SOURCE];
