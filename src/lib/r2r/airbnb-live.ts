/**
 * Live Airbnb comps for Florida — Deal Hunter's own copy.
 *
 * Chris's ruling, 2026-11-03: "You are my price labs." He already owns a
 * scraper (`nfstay-hq/scripts/competitor-pricing.js`) for Liverpool/Manchester
 * sterling pricing on its own cron, writing its own file. That tool is NOT
 * modified or depended on here — this module is a separate, Florida-native
 * implementation of the same idea, living entirely inside this app:
 *
 *   · reads `airbnb.com` directly with `currency=USD&locale=en-US`
 *   · parses the same embedded-JSON shape the NFsTay scraper reads
 *     ("N night(s) x $X" inside each search result's price breakdown)
 *   · additionally keeps each listing's lat/lng and review data, which
 *     verified-live testing on 2026-11-04 showed the page still carries
 *     per listing — enough to do real 250m/500m/1km radius matching, not
 *     just an area-level aggregate.
 *
 * WHAT THIS GIVES US
 * ------------------
 *   · per-listing coordinates → a real geo radius, not an aggregate
 *   · per-listing nightly rate, title, review score/count
 *
 * WHAT IT STILL CANNOT GIVE US
 * -----------------------------
 *   · occupancy — no public Airbnb surface exposes it
 *   · a verified street address → "same_street" matching cannot be honoured;
 *     requests for it fall back to the tightest radius band and say so
 *   · bedroom count per listing — not present in the search page's JSON, so
 *     every comp here is tagged with the *subject's* bed count as a stated
 *     assumption, never a measurement
 *   · seasonal (peak/shoulder/off) rates from one scrape — approximated from
 *     the live price distribution's quartiles (p75/median/p25), exactly the
 *     method already documented in `comps.ts` for the aggregate case
 *
 * This is read-only. No booking, login or account action of any kind.
 */
import type { FloridaMarket } from "@/types/r2r";
import { cached, TTL_12H_MS } from "@/lib/enrich/cache";
import { UpstreamError } from "@/lib/enrich/http";

/* ------------------------------------------------------------------ *
 * Market → Airbnb location slug
 * ------------------------------------------------------------------ */

export const AIRBNB_MARKET_SLUGS: Record<FloridaMarket, string> = {
  kissimmee: "Kissimmee--FL--United-States",
  tampa: "Tampa--FL--United-States",
  broward: "Fort-Lauderdale--FL--United-States",
  "clearwater-stpete": "Clearwater--FL--United-States",
  destin: "Destin--FL--United-States",
  "panama-city-beach": "Panama-City-Beach--FL--United-States",
  "miami-beach": "Miami-Beach--FL--United-States",
  "orlando-city": "Orlando--FL--United-States",
  "key-west": "Key-West--FL--United-States",
  naples: "Naples--FL--United-States",
};

export interface LiveAirbnbListing {
  lat: number;
  lng: number;
  title: string;
  nightlyUsd: number;
  reviewScore: number | null;
  reviewCount: number;
}

export interface LiveAirbnbMarketScan {
  market: FloridaMarket;
  slug: string;
  checkin: string;
  checkout: string;
  listings: LiveAirbnbListing[];
  fetchedAt: string;
}

const DEFAULT_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const FETCH_TIMEOUT_MS = 12_000;

/** Next check-in roughly two weeks out — far enough to have real inventory, near enough to be current pricing. */
function defaultCheckin(): { checkin: string; checkout: string } {
  const now = new Date();
  const checkin = new Date(now.getTime() + 14 * 86_400_000);
  const checkout = new Date(checkin.getTime() + 2 * 86_400_000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { checkin: fmt(checkin), checkout: fmt(checkout) };
}

function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/**
 * The search page repeats its listing block (server markup + hydration JSON)
 * and the repeat is usually a truncated echo. Same guard the NFsTay scraper
 * uses: detect the tail-is-a-prefix-of-the-head repeat and keep one copy.
 */
function dedupeRepeatedBlock<T>(arr: T[], keyOf: (v: T) => string): T[] {
  const keys = arr.map(keyOf);
  const n = keys.length;
  for (let k = Math.ceil(n / 2); k < n; k++) {
    let repeat = true;
    for (let i = 0; i + k < n; i++) {
      if (keys[i] !== keys[i + k]) {
        repeat = false;
        break;
      }
    }
    if (repeat) return arr.slice(0, k);
  }
  return arr;
}

/**
 * Parse one Airbnb search results page into per-listing rows.
 *
 * Each listing's fields (coordinate, title, rating, price breakdown) sit
 * close together inside the same `StaySearchResult` JSON object in document
 * order, bounded by consecutive `"__typename":"DemandStayListing"` markers.
 * Verified against a live Kissimmee fetch on 2026-11-04: 37 of 38 blocks
 * parsed cleanly (the one miss had no price breakdown on the page at all).
 */
export function parseAirbnbSearchHtml(html: string): LiveAirbnbListing[] {
  const markerRe = /"__typename":"DemandStayListing"/g;
  const markers: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = markerRe.exec(html))) markers.push(m.index);

  const out: LiveAirbnbListing[] = [];
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i];
    const end = i + 1 < markers.length ? markers[i + 1] : Math.min(html.length, start + 6000);
    const chunk = html.slice(start, end);

    const coord = chunk.match(/"latitude":(-?\d+\.?\d*),"longitude":(-?\d+\.?\d*)/);
    const nightly = chunk.match(/"description":"(\d+)\s+nights?\s+x\s+\$([\d,.]+)"/);
    if (!coord || !nightly) continue;

    const price = parseFloat(nightly[2].replace(/,/g, ""));
    // No real Florida entire-home listing lets for under this; anything lower
    // is a parse artefact (tax/fee line mismatched to this block).
    if (!(price >= 15 && price < 3000)) continue;

    const titleMatch = chunk.match(/"localizedStringWithTranslationPreference":"([^"]*)"/);
    const ratingMatch = chunk.match(/"avgRatingA11yLabel":"([^"]*)"/);
    let reviewScore: number | null = null;
    let reviewCount = 0;
    if (ratingMatch) {
      const parsed = ratingMatch[1].match(/^([\d.]+)\s+out of 5.*?(\d+)\s+review/);
      if (parsed) {
        reviewScore = Number(parsed[1]);
        reviewCount = Number(parsed[2]);
      }
    }

    out.push({
      lat: parseFloat(coord[1]),
      lng: parseFloat(coord[2]),
      title: (titleMatch?.[1] ?? "Untitled listing").replace(/\\n/g, " ").trim(),
      nightlyUsd: price,
      reviewScore,
      reviewCount,
    });
  }

  const deBlocked = dedupeRepeatedBlock(out, (l) => `${l.lat},${l.lng},${l.nightlyUsd}`);

  // The page also repeats individual listings outside the trailing-echo
  // pattern — e.g. the same unit rendered twice with a slightly different
  // cached price or review count between the server markup and the
  // hydration JSON. Same coordinate + same title is a far more reliable
  // duplicate signal than an exact price match; keep the first occurrence.
  const seen = new Set<string>();
  return deBlocked.filter((l) => {
    const key = `${l.lat},${l.lng},${l.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchAirbnbSearchHtml(
  slug: string,
  checkin: string,
  checkout: string
): Promise<string> {
  const params = new URLSearchParams({
    checkin,
    checkout,
    adults: "2",
    price_max: "900",
    currency: "USD",
    locale: "en-US",
    "room_types[]": "Entire home/apt",
  });
  const url = `https://www.airbnb.com/s/${slug}/homes?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      signal: timeoutSignal(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": DEFAULT_UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      // Vercel Data Cache — survives across serverless invocations, unlike
      // the in-process `cached()` map. 12h: comps don't need to be fresher
      // than that and it keeps us well clear of rate limits.
      next: { revalidate: 43_200 },
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "Error";
    throw new UpstreamError(`Airbnb search request failed for ${slug}`, undefined, name);
  }
  if (!res.ok) {
    throw new UpstreamError(`Airbnb search returned HTTP ${res.status} for ${slug}`, res.status);
  }
  return res.text();
}

/**
 * One market's live comp pool, cached. Shared across every deal in that
 * market so adding more candidate listings never multiplies scrape traffic.
 */
export async function fetchMarketAirbnbScan(market: FloridaMarket): Promise<LiveAirbnbMarketScan> {
  const slug = AIRBNB_MARKET_SLUGS[market];
  return cached(`airbnb-live:${market}`, TTL_12H_MS, async () => {
    const { checkin, checkout } = defaultCheckin();
    const html = await fetchAirbnbSearchHtml(slug, checkin, checkout);
    const listings = parseAirbnbSearchHtml(html);
    return {
      market,
      slug,
      checkin,
      checkout,
      listings,
      fetchedAt: new Date().toISOString(),
    };
  });
}

/** Great-circle distance in meters — radius matching needs meters, not miles. */
export function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
