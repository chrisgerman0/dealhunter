/**
 * Long-term Florida rental listings — the units Deal Hunter can lease.
 *
 * Source: RentCast (`https://api.rentcast.io/v1/listings/rental/long-term`).
 * Recommended in `reports/florida-r2r-data-sources-2026-11-03.md` as the
 * cheapest reliable feed ($74/mo for 1,000 calls; free tier is 50/mo,
 * dev/test only) after checking Zillow (partner-only), Realtor.com (no
 * official API, ToS prohibits scraping), Apartments.com/Rent.com (no API,
 * ToS prohibits scraping), Bridge Interactive and ATTOM (both $500+/mo
 * enterprise) and local MLS/IDX (membership-gated).
 *
 * NO KEY, NO CALL. Without `RENTCAST_API_KEY` this module is never invoked —
 * `src/lib/r2r/live-deals.ts` falls back to the mock catalogue and labels it
 * as such. There is no silent downgrade to a scraper for this data: Realtor/
 * Zillow/Apartments.com ToS explicitly prohibit automated access and the
 * research report flags that risk as HIGH — so unlike Airbnb comps, this one
 * genuinely needs the paid key or stays mock.
 *
 * BUDGET DISCIPLINE: the free tier is 50 calls/month across every market
 * combined — about 1.6/day. One call per market (not per bed-size, not per
 * request) with a long cache is the only way that budget survives casual
 * browsing. See the 24h revalidate below.
 */
import type { FloridaMarket, PetPolicy, UnitType } from "@/types/r2r";
import { cached } from "@/lib/enrich/cache";
import { marketProfile } from "./markets";

export function hasRentCastKey(): boolean {
  return Boolean(process.env.RENTCAST_API_KEY?.trim());
}

/** One rental row as RentCast returns it. Field names per their public docs
 * (developers.rentcast.io/reference/rental-listings-long-term); defensively
 * parsed below since the live shape has not been exercised against a real
 * key in this session — Chris should spot-check the first live response. */
export interface RentCastListingRaw {
  id?: string;
  formattedAddress?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  yearBuilt?: number;
  price?: number;
  status?: string;
  listedDate?: string;
  daysOnMarket?: number;
  listingUrl?: string;
  photos?: Array<string | { href?: string; url?: string }>;
  hoa?: { fee?: number };
  [key: string]: unknown;
}

type RentCastListResponse = RentCastListingRaw[];

function mapPropertyType(raw?: string): UnitType {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("condo")) return "condo";
  if (v.includes("town")) return "townhouse";
  if (v.includes("duplex") || v.includes("multi")) return "duplex";
  if (v.includes("apartment")) return "apartment";
  return "single_family";
}

function extractPhotoUrl(p: string | { href?: string; url?: string }): string | null {
  if (typeof p === "string") return p;
  return p.href ?? p.url ?? null;
}

export interface RentCastListing {
  id: string;
  address: string;
  city: string;
  county: string;
  zip: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  unitType: UnitType;
  yearBuilt: number | null;
  coords: { lat: number; lng: number } | null;
  photos: string[];
  listingUrl: string;
  daysOnMarket: number | null;
  hoaMonthlyFee: number | null;
  petPolicy: PetPolicy;
}

function normalize(raw: RentCastListingRaw): RentCastListing | null {
  // Rent and an address are the floor — without them this is not a listing
  // we can underwrite, live or not.
  if (!raw.price || raw.price <= 0) return null;
  const address = raw.formattedAddress ?? raw.addressLine1;
  if (!address) return null;

  return {
    id: raw.id ?? `rentcast-${address}`,
    address,
    city: raw.city ?? "",
    county: raw.county ?? "",
    zip: raw.zipCode ?? "",
    rent: Math.round(raw.price),
    beds: raw.bedrooms ?? 0,
    baths: raw.bathrooms ?? 0,
    sqft: raw.squareFootage ?? 0,
    unitType: mapPropertyType(raw.propertyType),
    yearBuilt: raw.yearBuilt ?? null,
    coords:
      typeof raw.latitude === "number" && typeof raw.longitude === "number"
        ? { lat: raw.latitude, lng: raw.longitude }
        : null,
    // RentCast's listing feed is not known (as of this build) to carry MLS
    // photos — never substitute a stock photo for a real listing. Empty here
    // means the UI shows an honest "no photo provided" state.
    photos: (raw.photos ?? []).map(extractPhotoUrl).filter((p): p is string => Boolean(p)),
    listingUrl: raw.listingUrl ?? "",
    daysOnMarket: raw.daysOnMarket ?? null,
    hoaMonthlyFee: raw.hoa?.fee ?? null,
    petPolicy: "unknown",
  };
}

const RENTCAST_BASE = "https://api.rentcast.io/v1/listings/rental/long-term";
/** 24h — see the budget-discipline note above. One fetch per market per day. */
const RENTCAST_REVALIDATE_SECONDS = 86_400;

async function fetchRentCastRaw(market: FloridaMarket): Promise<RentCastListingRaw[]> {
  const apiKey = process.env.RENTCAST_API_KEY?.trim();
  if (!apiKey) throw new Error("RENTCAST_API_KEY is not set");

  const p = marketProfile(market);
  const params = new URLSearchParams({
    city: p.city,
    state: "FL",
    status: "Active",
    limit: "20",
  });
  const url = `${RENTCAST_BASE}?${params.toString()}`;

  const res = await fetch(url, {
    headers: { "X-Api-Key": apiKey, Accept: "application/json" },
    next: { revalidate: RENTCAST_REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`RentCast HTTP ${res.status} for ${p.city}, FL: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as RentCastListResponse;
  return Array.isArray(data) ? data : [];
}

/**
 * One market's live long-term rental listings, cached hard against the free
 * tier's 50-calls/month ceiling. Throws if unkeyed or if RentCast errors —
 * `live-deals.ts` is the layer that decides what to show instead.
 */
export async function fetchRentCastListings(market: FloridaMarket): Promise<RentCastListing[]> {
  return cached(`rentcast:${market}`, RENTCAST_REVALIDATE_SECONDS * 1000, async () => {
    const raw = await fetchRentCastRaw(market);
    return raw.map(normalize).filter((l): l is RentCastListing => l !== null);
  });
}
