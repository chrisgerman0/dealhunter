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
import { fetchJson, UpstreamError } from "@/lib/enrich/http";

const PROPERTYDATA_BASE = "https://api.propertydata.co.uk";

/** BMV-oriented sourcing lists. Override with PROPERTYDATA_LISTS (comma-separated). */
const DEFAULT_LISTS = "unmodernised-properties,reduced-properties";

export function hasPropertyDataKey(): boolean {
  return Boolean(process.env.PROPERTYDATA_API_KEY?.trim());
}

/** Raw /sourced-properties item — extra fields ignored. */
export interface PropertyDataSourcedProperty {
  id?: string | number;
  uprn?: string;
  address?: string;
  postcode?: string;
  price?: number;
  bedrooms?: number;
  beds?: number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  type?: string;
  type_standardised?: string;
  url?: string;
  image_url?: string;
  tenure?: string;
  floor_area?: number;
  sqf?: number;
  sqft?: number;
}

export interface PropertyDataSourcedResponse {
  status?: string;
  properties?: PropertyDataSourcedProperty[];
  data?: PropertyDataSourcedProperty[];
  results?: PropertyDataSourcedProperty[];
}

function cityFromPostcode(postcode: string): City {
  const compact = postcode.toUpperCase().replace(/\s+/g, "");
  if (compact.startsWith("M")) return "manchester";
  return "liverpool";
}

function tenureFrom(value: string | undefined): Tenure {
  return (value ?? "").toLowerCase().includes("lease") ? "leasehold" : "freehold";
}

export function mapSourcedPropertyToListing(
  p: PropertyDataSourcedProperty,
  index: number
): Listing {
  const postcode = (p.postcode ?? "").toUpperCase();
  const beds = p.bedrooms ?? p.beds ?? 0;
  const sqft = p.sqft ?? p.sqf ?? p.floor_area ?? 0;
  const lat = p.lat ?? p.latitude ?? 0;
  const lng = p.lng ?? p.longitude ?? 0;
  const id = String(p.id ?? p.uprn ?? `pd-${postcode || "unk"}-${index}`);
  return {
    id,
    address: p.address ?? "Unknown address",
    postcode,
    price: p.price ?? 0,
    beds,
    sqft,
    photos: p.image_url ? [p.image_url] : [],
    coords: { lat, lng },
    city: cityFromPostcode(postcode),
    tenure: tenureFrom(p.tenure),
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
      const ok = params.postcodes.some(
        (p) => d.postcode.startsWith(p.toUpperCase()) || d.postcode.replace(/\s+/g, "").startsWith(p.toUpperCase().replace(/\s+/g, ""))
      );
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
      const hay = `${d.address} ${d.postcode}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/**
 * Licensed listings via PropertyData `/sourced-properties`.
 * Does **not** scrape Rightmove or Zoopla.
 *
 * When PROPERTYDATA_API_KEY is set, searchListings hits the live API.
 * Sold comps / flood still use the free clients in `src/lib/enrich/`.
 */
export class PropertyDataDataSource implements PropertyDataSource {
  async searchListings(params: SearchParams): Promise<Listing[]> {
    const key = process.env.PROPERTYDATA_API_KEY?.trim();
    if (!key) {
      throw new Error(
        "PROPERTYDATA_API_KEY is not set. Keep DATA_SOURCE=mock, or add the key in Vercel. Do not scrape Rightmove/Zoopla."
      );
    }

    const lists = process.env.PROPERTYDATA_LISTS?.trim() || DEFAULT_LISTS;
    const cities = params.cities?.length ? params.cities : (["liverpool", "manchester"] as City[]);
    const postcodes = params.postcodes?.length
      ? params.postcodes
      : cities.map(defaultPostcodeForCity);

    const pages = await Promise.all(
      postcodes.map(async (postcode) => {
        const qs = new URLSearchParams({
          key,
          list: lists,
          postcode,
          radius: "15",
          results: "50",
          page: "1",
          standardised_type: "terraced_house,semi-detached_house",
          exclude_sstc: "1",
        });
        try {
          return await fetchJson<PropertyDataSourcedResponse>(
            `${PROPERTYDATA_BASE}/sourced-properties?${qs.toString()}`
          );
        } catch (err) {
          if (err instanceof UpstreamError) throw err;
          throw new Error(
            `PropertyData sourced-properties failed: ${err instanceof Error ? err.message : String(err)}`
          );
        }
      })
    );

    const merged = new Map<string, Listing>();
    for (const page of pages) {
      for (const listing of listingsFromResponse(page)) {
        merged.set(listing.id, listing);
      }
    }
    return applyListingFilters(Array.from(merged.values()), params);
  }

  async getListingDetail(id: string): Promise<ListingDetail> {
    void id;
    throw new Error(
      "PropertyData getListingDetail is not wired yet — search returns listing cards; detail still uses the mock deal catalogue until a listing→Deal assembler is added."
    );
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
