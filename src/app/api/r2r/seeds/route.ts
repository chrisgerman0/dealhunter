import { NextResponse } from "next/server";
import { getLiveR2RSeeds } from "@/lib/r2r/live-deals";
import { isFloridaMarket } from "@/lib/r2r/markets";
import type { FloridaMarket, GeoMatch } from "@/types/r2r";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const GEO_MATCHES: GeoMatch[] = ["same_street", "radius_250m", "radius_500m", "radius_1km"];

/**
 * R2R's one data endpoint: live RentCast listings (each with its own live
 * Airbnb comp set attached) when `RENTCAST_API_KEY` is set, the mock
 * catalogue otherwise. Returns raw seeds, not assembled deals — the client
 * runs them through `assembleR2RDeal()` with the user's own settings, the
 * same function the mock catalogue has always used.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const marketParams = url.searchParams.getAll("market").filter(isFloridaMarket) as FloridaMarket[];
  const geoMatchParam = url.searchParams.get("geoMatch");
  const geoMatch = GEO_MATCHES.includes(geoMatchParam as GeoMatch)
    ? (geoMatchParam as GeoMatch)
    : undefined;

  try {
    const result = await getLiveR2RSeeds({ markets: marketParams, geoMatch });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load R2R seeds" },
      { status: 502 }
    );
  }
}
