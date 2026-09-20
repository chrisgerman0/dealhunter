import type { PropertyDataSource } from "./types";
import type {
  AirbnbComp,
  City,
  Comp,
  Coords,
  CrimeData,
  FloodData,
  Listing,
  ListingDetail,
  PlanningFlags,
  SearchParams,
  Tenure,
} from "@/types/deal";
import { getLiveFloodData } from "@/lib/enrich/flood";
import { getLiveSoldComps } from "@/lib/enrich/comps";
import { fetchJson, redactUrl, UpstreamError } from "@/lib/enrich/http";
import { DataSourceNotAvailableError, MISSING_PROPERTYDATA_KEY_MESSAGE } from "./errors";

const PROPERTYDATA_BASE = "https://api.propertydata.co.uk";

/** BMV-oriented sourcing lists (max 5 per request). Override with PROPERTYDATA_LISTS. */
const DEFAULT_LISTS = "unmodernised-properties,reduced-properties";

/** Terraces / semis for Liverpool–Manchester BRRR. */
const DEFAULT_TYPES = "terraced_house,semi-detached_house";

export function hasPropertyDataKey(): boolean {
  return Boolean(process.env.PROPERTYDATA_API_KEY?.trim());
}

function requirePropertyDataKey(): string {
  const key = process.env.PROPERTYDATA_API_KEY?.trim();
  if (!key) {
    throw new DataSourceNotAvailableError("propertydata", MISSING_PROPERTYDATA_KEY_MESSAGE);
  }
  return key;
}

/**
 * Raw `/sourced-properties` / `/sourced-property` item.
 * Fields from https://propertydata.co.uk/api/documentation/sourced-properties
 */
export interface PropertyDataSourcedProperty {
  id?: string | number;
  uprn?: string;
  address?: string;
  postcode?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  price?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  baths?: number;
  type?: string;
  type_standardised?: string;
  url?: string;
  image_url?: string;
  tenure?: string;
  floor_area?: number;
  sqf?: number;
  sqft?: number;
  description?: string;
  lists?: string[];
  reduced_by?: number;
  months_on_market?: number;
  years_remaining?: number;
  highest_offer?: number;
  plot_size_acres?: number;
  distance?: number;
}

export interface PropertyDataSourcedResponse {
  status?: string;
  code?: string;
  message?: string;
  properties?: PropertyDataSourcedProperty[];
  data?: PropertyDataSourcedProperty[];
  results?: PropertyDataSourcedProperty[];
  lists?: unknown[];
  property?: PropertyDataSourcedProperty;
}

function cityFromPostcode(postcode: string): City {
  const compact = postcode.toUpperCase().replace(/\s+/g, "");
  if (compact.startsWith("M")) return "manchester";
  return "liverpool";
}

function tenureFrom(value: string | undefined): Tenure {
  return (value ?? "").toLowerCase().includes("lease") ? "leasehold" : "freehold";
}

function num(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function mapSourcedPropertyToListing(
  p: PropertyDataSourcedProperty,
  index: number
): Listing {
  const postcode = (p.postcode ?? "").toUpperCase();
  const lat = p.lat ?? p.latitude ?? 0;
  const lng = p.lng ?? p.longitude ?? 0;
  const id = String(p.id ?? p.uprn ?? `pd-${postcode || "unk"}-${index}`);
  const propertyType = p.type_standardised || p.type;
  const listingUrl = p.url;
  return {
    id,
    address: p.address ?? "Unknown address",
    postcode,
    price: num(p.price),
    beds: p.bedrooms ?? p.beds ?? 0,
    sqft: p.sqft ?? p.sqf ?? p.floor_area ?? 0,
    photos: p.image_url ? [p.image_url] : [],
    coords: { lat, lng },
    city: cityFromPostcode(postcode),
    tenure: tenureFrom(p.tenure),
    propertyType,
    listingUrl,
    sourceLists: Array.isArray(p.lists) ? p.lists : undefined,
    reducedBy: typeof p.reduced_by === "number" ? p.reduced_by : undefined,
    monthsOnMarket: typeof p.months_on_market === "number" ? p.months_on_market : undefined,
  };
}

export function mapSourcedPropertyToListingDetail(
  p: PropertyDataSourcedProperty,
  index = 0
): ListingDetail {
  const listing = mapSourcedPropertyToListing(p, index);
  return {
    ...listing,
    baths: p.bathrooms ?? p.baths ?? 0,
    propertyType: listing.propertyType ?? p.type ?? "Unknown",
    description: p.description ?? "",
    listingUrl: listing.listingUrl ?? "",
  };
}

function listingsFromResponse(payload: PropertyDataSourcedResponse): Listing[] {
  const rows = payload.properties ?? payload.data ?? payload.results ?? [];
  return rows.map(mapSourcedPropertyToListing);
}

function defaultPostcodeForCity(city: City): string {
  return city === "manchester" ? "M13" : "L4";
}

function applyListingFilters(listings: Listing[], params: SearchParams): Listing[] {
  return listings.filter((d) => {
    if (params.cities?.length && !params.cities.includes(d.city)) return false;
    if (params.postcodes?.length) {
      const ok = params.postcodes.some((p) => {
        const needle = p.toUpperCase().replace(/\s+/g, "");
        const hay = d.postcode.toUpperCase().replace(/\s+/g, "");
        return hay.startsWith(needle) || d.postcode.toUpperCase().startsWith(p.toUpperCase());
      });
      if (!ok) return false;
    }
    if (params.minPrice != null && d.price < params.minPrice) return false;
    if (params.maxPrice != null && d.price > params.maxPrice) return false;
    if (params.minBeds != null && d.beds < params.minBeds) return false;
    if (params.maxBeds != null && d.beds > params.maxBeds) return false;
    if (params.tenure && params.tenure !== "any" && d.tenure !== params.tenure) return false;
    if (params.minSqft != null && d.sqft < params.minSqft) return false;
    if (params.maxSqft != null && d.sqft > params.maxSqft) return false;
    if (params.query?.trim()) {
      const q = params.query.toLowerCase();
      const hay = `${d.address} ${d.postcode} ${d.propertyType ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

async function fetchPropertyData<T extends PropertyDataSourcedResponse>(pathAndQuery: string): Promise<T> {
  const url = `${PROPERTYDATA_BASE}${pathAndQuery}`;
  const payload = await fetchJson<T>(url);
  if (payload.status && payload.status !== "success") {
    throw new UpstreamError(
      `PropertyData ${payload.code ?? payload.status}: ${payload.message ?? "request failed"} (${redactUrl(url)})`
    );
  }
  return payload;
}

/**
 * Licensed listings via PropertyData `/sourced-properties`.
 * Does **not** scrape Rightmove or Zoopla (PropertyData is the licensed feed of those portals).
 *
 * Sold comps / flood still use the free clients in `src/lib/enrich/` — not PropertyData credits.
 *
 * TODO when PROPERTYDATA_API_KEY is live in Vercel:
 * 1. Point Explore at GET /api/listings/search
 * 2. Assemble ListingDetail → Deal (shared finance model)
 * 3. Keep calling enrichDeal() so Land Registry comps still drive GDV
 */
export class PropertyDataDataSource implements PropertyDataSource {
  async searchListings(params: SearchParams): Promise<Listing[]> {
    const key = requirePropertyDataKey();
    const lists = process.env.PROPERTYDATA_LISTS?.trim() || DEFAULT_LISTS;
    const cities = params.cities?.length ? params.cities : (["liverpool", "manchester"] as City[]);
    const postcodes = params.postcodes?.length
      ? params.postcodes
      : cities.map(defaultPostcodeForCity);

    const pages = await Promise.allSettled(
      postcodes.map(async (postcode) => {
        const qs = new URLSearchParams({
          key,
          list: lists,
          postcode,
          radius: "15",
          results: "50",
          page: "1",
          standardised_type: DEFAULT_TYPES,
          exclude_sstc: "1",
        });
        return fetchPropertyData<PropertyDataSourcedResponse>(`/sourced-properties?${qs.toString()}`);
      })
    );

    const merged = new Map<string, Listing>();
    const failures: unknown[] = [];
    for (const page of pages) {
      if (page.status === "rejected") {
        failures.push(page.reason);
        continue;
      }
      for (const listing of listingsFromResponse(page.value)) {
        merged.set(listing.id, listing);
      }
    }

    if (merged.size === 0 && failures.length > 0) {
      const first = failures[0];
      if (first instanceof UpstreamError || first instanceof Error) throw first;
      throw new Error(`PropertyData sourced-properties failed: ${String(first)}`);
    }

    return applyListingFilters(Array.from(merged.values()), params);
  }

  /**
   * Licensed `/sourced-property` card. Not a Deal — Explore still uses the mock
   * catalogue until a listing→Deal assembler is added.
   */
  async getListingDetail(id: string): Promise<ListingDetail> {
    const key = requirePropertyDataKey();
    const qs = new URLSearchParams({ key, property_id: id });
    const payload = await fetchPropertyData<PropertyDataSourcedResponse>(
      `/sourced-property?${qs.toString()}`
    );
    const row = payload.property ?? payload.properties?.[0] ?? (payload as PropertyDataSourcedProperty);
    if (!row || (!row.id && !row.address && !row.postcode)) {
      throw new Error(`PropertyData sourced-property returned no property for ${id}`);
    }
    return mapSourcedPropertyToListingDetail({ ...row, id: row.id ?? id });
  }

  async getSoldComps(postcode: string, beds: number): Promise<Comp[]> {
    const live = await getLiveSoldComps({ postcode, beds });
    return live.comps;
  }

  async getAirbnbComps(coords: Coords, beds: number): Promise<AirbnbComp[]> {
    void coords;
    void beds;
    throw new Error("Airbnb comps are not implemented on PropertyDataDataSource.");
  }

  async getLHARate(postcode: string, beds: number): Promise<number> {
    void postcode;
    void beds;
    throw new Error("LHA rates are not implemented on PropertyDataDataSource.");
  }

  async getCrimeData(coords: Coords): Promise<CrimeData> {
    void coords;
    return {
      score: 5,
      burglaryPer1000: 0,
      asbPer1000: 0,
      summary: "Crime scoring is not used for buying decisions in this build.",
    };
  }

  async getPlanningData(coords: Coords): Promise<PlanningFlags> {
    void coords;
    return {
      article4: false,
      selectiveLicensing: false,
      additionalHmo: false,
      conservation: false,
    };
  }

  async getFloodData(coords: Coords): Promise<FloodData> {
    return getLiveFloodData(coords);
  }
}

/** @deprecated Use PropertyDataDataSource */
export class PropertyDataListingsSource extends PropertyDataDataSource {}
