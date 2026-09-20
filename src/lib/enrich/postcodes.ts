import type { Coords } from "@/types/deal";
import { cacheGet, cacheSet, cached, TTL_24H_MS, roundCoord } from "./cache";
import { fetchJson, fetchJsonAllowEmpty } from "./http";

export interface PostcodeInfo {
  postcode: string;
  outcode: string;
  coords: Coords;
  eastings?: number;
  northings?: number;
}

interface PostcodesIoLookup {
  status: number;
  result: {
    postcode: string;
    outcode: string;
    latitude: number;
    longitude: number;
    eastings: number;
    northings: number;
  } | null;
}

interface PostcodesIoList {
  status: number;
  result:
    | Array<{
        postcode: string;
        outcode: string;
        latitude: number;
        longitude: number;
        eastings?: number;
        northings?: number;
      }>
    | {
        outcode: string;
        latitude: number;
        longitude: number;
      }
    | null;
}

interface PostcodesIoBulk {
  status: number;
  result: Array<{
    query: string;
    result: {
      postcode: string;
      latitude: number;
      longitude: number;
    } | null;
  }>;
}

/** `L42EW` / `l4 2ew` → `L4 2EW`; outcodes stay `L4`. */
export function normalizePostcode(input: string): string {
  const compact = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact.length <= 4) return compact;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

export function outcodeFromPostcode(postcode: string): string {
  const n = normalizePostcode(postcode);
  const parts = n.split(" ");
  if (parts.length === 2) return parts[0]!;
  return n.replace(/\d[A-Z]{2}$/, "") || n;
}

function asInfo(row: {
  postcode?: string;
  outcode?: string;
  latitude: number;
  longitude: number;
  eastings?: number;
  northings?: number;
}): PostcodeInfo {
  return {
    postcode: row.postcode ?? "",
    outcode: row.outcode ?? outcodeFromPostcode(row.postcode ?? ""),
    coords: { lat: row.latitude, lng: row.longitude },
    eastings: row.eastings,
    northings: row.northings,
  };
}

export async function lookupPostcode(postcode: string): Promise<PostcodeInfo | null> {
  const normalised = normalizePostcode(postcode);
  if (!normalised) return null;
  return cached(`pc:lookup:${normalised}`, TTL_24H_MS, async () => {
    const data = await fetchJsonAllowEmpty<PostcodesIoLookup>(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(normalised)}`
    );
    if (!data?.result) return null;
    return asInfo(data.result);
  });
}

export async function lookupOutcode(outcode: string): Promise<PostcodeInfo | null> {
  const oc = outcodeFromPostcode(outcode);
  if (!oc) return null;
  return cached(`pc:outcode:${oc}`, TTL_24H_MS, async () => {
    const data = await fetchJsonAllowEmpty<PostcodesIoList>(
      `https://api.postcodes.io/outcodes/${encodeURIComponent(oc)}`
    );
    const result = data?.result;
    if (!result || Array.isArray(result)) return null;
    return {
      postcode: oc,
      outcode: result.outcode,
      coords: { lat: result.latitude, lng: result.longitude },
    };
  });
}

export async function reverseGeocode(coords: Coords): Promise<PostcodeInfo | null> {
  const lat = roundCoord(coords.lat);
  const lng = roundCoord(coords.lng);
  return cached(`pc:rev:${lat},${lng}`, TTL_24H_MS, async () => {
    const data = await fetchJsonAllowEmpty<PostcodesIoList>(
      `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1`
    );
    const list = data?.result;
    if (!Array.isArray(list) || !list[0]) return null;
    return asInfo(list[0]);
  });
}

export async function nearbyPostcodes(
  coords: Coords,
  radiusMetres = 800,
  limit = 20
): Promise<string[]> {
  const lat = roundCoord(coords.lat);
  const lng = roundCoord(coords.lng);
  return cached(`pc:near:${lat},${lng}:${radiusMetres}:${limit}`, TTL_24H_MS, async () => {
    const data = await fetchJsonAllowEmpty<PostcodesIoList>(
      `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=${limit}&radius=${radiusMetres}`
    );
    const list = data?.result;
    if (!Array.isArray(list)) return [];
    return list.map((row) => row.postcode).filter(Boolean);
  });
}

export async function bulkLookupCoords(postcodes: string[]): Promise<Map<string, Coords>> {
  const unique = Array.from(new Set(postcodes.map(normalizePostcode).filter(Boolean)));
  const map = new Map<string, Coords>();
  const missing: string[] = [];
  for (const pc of unique) {
    const hit = cacheGet<Coords>(`pc:coords:${pc}`);
    if (hit) map.set(pc, hit);
    else missing.push(pc);
  }
  for (let i = 0; i < missing.length; i += 100) {
    const chunk = missing.slice(i, i + 100);
    const data = await fetchJson<PostcodesIoBulk>("https://api.postcodes.io/postcodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcodes: chunk }),
    });
    for (const row of data.result ?? []) {
      if (!row.result) continue;
      const pc = normalizePostcode(row.result.postcode);
      const coords = { lat: row.result.latitude, lng: row.result.longitude };
      map.set(pc, coords);
      cacheSet(`pc:coords:${pc}`, coords, TTL_24H_MS);
    }
  }
  return map;
}

export async function resolveLocation(opts: {
  postcode?: string;
  coords?: Coords;
}): Promise<{ info: PostcodeInfo | null; coords: Coords | null; nearby: string[] }> {
  let info: PostcodeInfo | null = null;
  if (opts.postcode) {
    info = await lookupPostcode(opts.postcode);
    if (!info) info = await lookupOutcode(opts.postcode);
  }
  if (!info && opts.coords) {
    info = await reverseGeocode(opts.coords);
  }
  const coords = opts.coords ?? info?.coords ?? null;
  const nearby = coords ? await nearbyPostcodes(coords, 800, 20) : [];
  return { info, coords, nearby };
}
