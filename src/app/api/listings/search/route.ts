import { NextResponse } from "next/server";
import {
  createPropertyDataSource,
  hasPropertyDataKey,
  resolveDataSourceKind,
} from "@/lib/data-sources";
import { DataSourceNotAvailableError } from "@/lib/data-sources/errors";
import type { DataSourceKind } from "@/lib/data-sources/types";
import type { City, Listing, SearchParams, Tenure } from "@/types/deal";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

export interface ListingsSearchResponse {
  source: DataSourceKind;
  keyed: boolean;
  listings: Listing[];
  note: string;
}

export interface ListingsSearchError {
  error: string;
  source: DataSourceKind;
  keyed: boolean;
}

function num(value: string | null): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseSearchParams(url: URL): SearchParams {
  const cities = url.searchParams.getAll("city").filter(Boolean) as City[];
  const postcodes = url.searchParams.getAll("postcode").filter(Boolean);
  const tenureRaw = url.searchParams.get("tenure");
  const tenure =
    tenureRaw === "freehold" || tenureRaw === "leasehold" || tenureRaw === "any"
      ? (tenureRaw as Tenure | "any")
      : undefined;
  return {
    cities: cities.length ? cities : undefined,
    postcodes: postcodes.length ? postcodes : undefined,
    minPrice: num(url.searchParams.get("minPrice")),
    maxPrice: num(url.searchParams.get("maxPrice")),
    minBeds: num(url.searchParams.get("minBeds")),
    maxBeds: num(url.searchParams.get("maxBeds")),
    minSqft: num(url.searchParams.get("minSqft")),
    maxSqft: num(url.searchParams.get("maxSqft")),
    tenure,
    query: url.searchParams.get("query") ?? undefined,
  };
}

function noteFor(kind: DataSourceKind, keyed: boolean): string {
  if (kind === "propertydata") {
    return "Live PropertyData /sourced-properties (licensed). Do not scrape Rightmove/Zoopla. Next: listing→Deal assembler + enrichDeal() for Land Registry GDV.";
  }
  if (kind === "rightmove" || kind === "zoopla") {
    return "This source is a no-scrape stub. Use PROPERTYDATA_API_KEY.";
  }
  return keyed
    ? "Mock listings because DATA_SOURCE=mock. Unset DATA_SOURCE or set DATA_SOURCE=propertydata to search PropertyData."
    : "Mock listings. Set PROPERTYDATA_API_KEY to search PropertyData sourced lists (unmodernised / reduced). Do not scrape Rightmove or Zoopla.";
}

/**
 * Listings search shaped for PropertyData `/sourced-properties`.
 * Source is chosen by `createPropertyDataSource()` / `DATA_SOURCE` / `PROPERTYDATA_API_KEY`.
 * Never scrapes Rightmove or Zoopla.
 */
export async function GET(req: Request) {
  const params = parseSearchParams(new URL(req.url));
  const kind = resolveDataSourceKind();
  const keyed = hasPropertyDataKey();

  try {
    const listings = await createPropertyDataSource().searchListings(params);
    const body: ListingsSearchResponse = {
      source: kind,
      keyed,
      listings,
      note: noteFor(kind, keyed),
    };
    return NextResponse.json(body);
  } catch (err) {
    const status = err instanceof DataSourceNotAvailableError ? err.status : 502;
    const body: ListingsSearchError = {
      error: err instanceof Error ? err.message : "Listings search failed",
      source: kind,
      keyed,
    };
    return NextResponse.json(body, { status });
  }
}
