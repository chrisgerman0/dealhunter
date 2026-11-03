/**
 * Server-side read of Chris's competitor-pricing scraper output.
 *
 * The scraper writes `nfstay-hq/live-data/competitor-pricing.json` on its own
 * cron. A browser cannot open that path, so the adapter in
 * `src/lib/r2r/comps.ts` comes through here.
 *
 * Read-only, by design. This route never writes to the scraper's directory and
 * never invokes the scraper — it is a reader of someone else's artefact.
 *
 * The path is overridable with `R2R_COMPETITOR_PRICING_PATH` so a measurement
 * or a deploy can be pointed at a copy without editing code.
 */
import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import {
  compSetFromCompetitorPricing,
  type CompetitorPricingFile,
  MARKET_SCAN_NAMES,
} from "@/lib/r2r/comps";
import type { FloridaMarket, GeoMatch } from "@/types/r2r";

const DEFAULT_PATH =
  "/root/.openclaw/workspace/nfstay-hq/live-data/competitor-pricing.json";

/**
 * Sterling → dollars for the scraper's current `airbnb.co.uk` queries.
 *
 * No fallback guess: without the env var the route refuses rather than invent a
 * rate, because a wrong rate produces a plausible-looking wrong verdict.
 * A Florida scan placed against `airbnb.com` is already USD, so set this to 1.
 */
function fxToUsd(): number | null {
  const raw = process.env.R2R_COMP_FX_TO_USD;
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const GEO_MATCHES: GeoMatch[] = ["same_street", "radius_250m", "radius_500m", "radius_1km"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const market = url.searchParams.get("market") as FloridaMarket | null;
  const geoMatchParam = url.searchParams.get("geoMatch");
  const bedsParam = url.searchParams.get("beds");

  if (!market || !(market in MARKET_SCAN_NAMES)) {
    return NextResponse.json({ error: "Unknown or missing `market`." }, { status: 400 });
  }
  const geoMatch: GeoMatch = GEO_MATCHES.includes(geoMatchParam as GeoMatch)
    ? (geoMatchParam as GeoMatch)
    : "radius_500m";
  const beds = Number(bedsParam);

  const fx = fxToUsd();
  if (fx == null) {
    return NextResponse.json(
      {
        error:
          "R2R_COMP_FX_TO_USD is not set. The scraper reads airbnb.co.uk in GBP; set the rate " +
          "explicitly, or set it to 1 once the scraper queries airbnb.com in USD.",
      },
      { status: 503 }
    );
  }

  const path = process.env.R2R_COMPETITOR_PRICING_PATH || DEFAULT_PATH;

  let file: CompetitorPricingFile;
  try {
    file = JSON.parse(await readFile(path, "utf8")) as CompetitorPricingFile;
  } catch (err) {
    return NextResponse.json(
      {
        error: `Could not read the scraper output at ${path}.`,
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 503 }
    );
  }

  const set = compSetFromCompetitorPricing(
    file,
    { market, geoMatch, beds: Number.isFinite(beds) ? beds : 3, coords: { lat: 0, lng: 0 } },
    { fxToUsd: fx }
  );

  if (!set) {
    return NextResponse.json(
      {
        error:
          `The scraper has no Entire home/apt scan for ${MARKET_SCAN_NAMES[market].name}. ` +
          `Add it to SEARCHES in nfstay-hq/scripts/competitor-pricing.js with query ` +
          `"${MARKET_SCAN_NAMES[market].airbnbSlug}", then re-run the scan.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(set);
}
