/**
 * Debug/inspection endpoint for the live Airbnb comp source. Not on the
 * critical path for Explore (that goes through `/api/r2r/seeds`, which calls
 * `ACTIVE_COMP_SOURCE` server-side directly) — this exists so a comp set for
 * a specific market + coordinate can be curl-verified in isolation.
 */
import { NextResponse } from "next/server";
import { LIVE_AIRBNB_SOURCE } from "@/lib/r2r/comps";
import { isFloridaMarket } from "@/lib/r2r/markets";
import type { FloridaMarket, GeoMatch } from "@/types/r2r";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

const GEO_MATCHES: GeoMatch[] = ["same_street", "radius_250m", "radius_500m", "radius_1km"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const market = url.searchParams.get("market");
  const geoMatchParam = url.searchParams.get("geoMatch");
  const beds = Number(url.searchParams.get("beds") ?? "3");
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));

  if (!market || !isFloridaMarket(market)) {
    return NextResponse.json({ error: "Unknown or missing `market`." }, { status: 400 });
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "`lat` and `lng` are required." }, { status: 400 });
  }
  const geoMatch: GeoMatch = GEO_MATCHES.includes(geoMatchParam as GeoMatch)
    ? (geoMatchParam as GeoMatch)
    : "radius_500m";

  try {
    const set = await LIVE_AIRBNB_SOURCE.fetchComps({
      coords: { lat, lng },
      beds: Number.isFinite(beds) ? beds : 3,
      geoMatch,
      market: market as FloridaMarket,
    });
    return NextResponse.json(set);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Comp scrape failed" },
      { status: 502 }
    );
  }
}
