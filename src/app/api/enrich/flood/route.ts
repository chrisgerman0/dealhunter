import { NextResponse } from "next/server";
import { getLiveFloodData } from "@/lib/enrich/flood";
import { isUkishCoord, parseCoordParam } from "@/lib/enrich/geo";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = parseCoordParam(url.searchParams.get("lat"));
  const lng = parseCoordParam(url.searchParams.get("lng"));
  if (lat == null || lng == null || !isUkishCoord(lat, lng)) {
    return NextResponse.json(
      { error: "Provide lat and lng query params within the UK." },
      { status: 400 }
    );
  }
  try {
    const data = await getLiveFloodData({ lat, lng });
    return NextResponse.json(
      {
        data,
        source: "live" as const,
        updatedAt: new Date().toISOString(),
        provider: "Environment Agency Flood Map for Planning",
      },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Flood lookup failed", source: "upstream" },
      { status: 502 }
    );
  }
}
