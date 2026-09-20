import { NextResponse } from "next/server";
import { getLiveSoldComps } from "@/lib/enrich/comps";
import { isUkishCoord, parseCoordParam } from "@/lib/enrich/geo";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postcode = url.searchParams.get("postcode")?.trim() ?? "";
  const bedsRaw = url.searchParams.get("beds");
  const beds = bedsRaw != null && bedsRaw !== "" ? Number(bedsRaw) : 3;
  const lat = parseCoordParam(url.searchParams.get("lat"));
  const lng = parseCoordParam(url.searchParams.get("lng"));

  if (!postcode) {
    return NextResponse.json({ error: "Provide a postcode query param." }, { status: 400 });
  }
  if (!Number.isFinite(beds) || beds < 1 || beds > 10) {
    return NextResponse.json({ error: "beds must be a number between 1 and 10." }, { status: 400 });
  }

  const coords =
    lat != null && lng != null && isUkishCoord(lat, lng) ? { lat, lng } : undefined;

  try {
    const result = await getLiveSoldComps({ postcode, beds, coords });
    return NextResponse.json(
      {
        data: result.comps,
        bands: result.bands,
        note: result.note,
        source: "live" as const,
        updatedAt: result.updatedAt,
        provider: "HM Land Registry Price Paid",
      },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Comps lookup failed", source: "upstream" },
      { status: 502 }
    );
  }
}
