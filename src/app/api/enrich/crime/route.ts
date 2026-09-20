import { NextResponse } from "next/server";
import { getLiveCrimeData } from "@/lib/enrich/crime";
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
    const data = await getLiveCrimeData({ lat, lng });
    return NextResponse.json(
      {
        data,
        source: "live" as const,
        updatedAt: new Date().toISOString(),
        provider: "police.uk street-level crime",
      },
      { headers: { "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Crime lookup failed", source: "upstream" },
      { status: 502 }
    );
  }
}
