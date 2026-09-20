import { NextResponse } from "next/server";
import { MockPropertyDataSource } from "@/lib/data-sources/mock";
import { PropertyDataDataSource, hasPropertyDataKey } from "@/lib/data-sources/propertydata";
import type { City, SearchParams } from "@/types/deal";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

function num(value: string | null): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseSearchParams(url: URL): SearchParams {
  const cities = url.searchParams.getAll("city").filter(Boolean) as City[];
  const postcodes = url.searchParams.getAll("postcode").filter(Boolean);
  return {
    cities: cities.length ? cities : undefined,
    postcodes: postcodes.length ? postcodes : undefined,
    minPrice: num(url.searchParams.get("minPrice")),
    maxPrice: num(url.searchParams.get("maxPrice")),
    minBeds: num(url.searchParams.get("minBeds")),
    maxBeds: num(url.searchParams.get("maxBeds")),
    query: url.searchParams.get("query") ?? undefined,
  };
}

/**
 * Listings search shaped for PropertyData `/sourced-properties`.
 * Without PROPERTYDATA_API_KEY this returns the mock catalogue.
 * Never scrapes Rightmove or Zoopla.
 */
export async function GET(req: Request) {
  const params = parseSearchParams(new URL(req.url));
  const keyed = hasPropertyDataKey();

  if (keyed) {
    try {
      const listings = await new PropertyDataDataSource().searchListings(params);
      return NextResponse.json({
        source: "propertydata" as const,
        keyed: true,
        listings,
        note: "Live PropertyData sourced-properties. Do not scrape Rightmove/Zoopla.",
      });
    } catch (err) {
      return NextResponse.json(
        {
          error: err instanceof Error ? err.message : "PropertyData search failed",
          source: "propertydata",
          keyed: true,
        },
        { status: 502 }
      );
    }
  }

  const listings = await new MockPropertyDataSource().searchListings(params);
  return NextResponse.json({
    source: "mock" as const,
    keyed: false,
    listings,
    note: "Mock listings. Set PROPERTYDATA_API_KEY to search PropertyData sourced lists (unmodernised / reduced). Do not scrape Rightmove or Zoopla.",
  });
}
