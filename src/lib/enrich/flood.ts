import type { Coords, FloodData } from "@/types/deal";
import { cached, TTL_24H_MS, roundCoord } from "./cache";
import { fetchJson } from "./http";

const OGC_ITEMS =
  "https://environment.data.gov.uk/spatialdata/flood-map-for-planning-flood-zones/ogc/features/v1/collections/Flood_Zones_2_3_Rivers_and_Sea/items";

const ARCGIS_FZ3 =
  "https://environment.data.gov.uk/KB6uNVj5ZcJr7jUP/ArcGIS/rest/services/Flood_Map_for_Planning/FeatureServer/1/query";
const ARCGIS_FZ2 =
  "https://environment.data.gov.uk/KB6uNVj5ZcJr7jUP/ArcGIS/rest/services/Flood_Map_for_Planning/FeatureServer/2/query";

interface OgcFeature {
  properties?: {
    flood_zone?: string;
    flood_source?: string;
    origin?: string;
  };
}

interface OgcCollection {
  features?: OgcFeature[];
}

interface ArcGisQuery {
  features?: Array<{ attributes?: Record<string, unknown> }>;
  error?: { message?: string };
}

function zoneToRisk(zone: 1 | 2 | 3): FloodData["risk"] {
  if (zone === 3) return "high";
  if (zone === 2) return "medium";
  return "low";
}

function parseZone(value: string | undefined): 2 | 3 | null {
  const v = (value ?? "").toUpperCase().replace(/\s+/g, "");
  if (v === "FZ3" || v === "3" || v.includes("ZONE3")) return 3;
  if (v === "FZ2" || v === "2" || v.includes("ZONE2")) return 2;
  return null;
}

async function fromOgc(coords: Coords): Promise<FloodData> {
  const pad = 0.0003;
  const bbox = [
    roundCoord(coords.lng - pad, 5),
    roundCoord(coords.lat - pad, 5),
    roundCoord(coords.lng + pad, 5),
    roundCoord(coords.lat + pad, 5),
  ].join(",");
  const url = `${OGC_ITEMS}?bbox=${bbox}&limit=10`;
  const data = await fetchJson<OgcCollection>(url);
  const features = data.features ?? [];
  let zone: 1 | 2 | 3 = 1;
  const sources = new Set<string>();
  for (const f of features) {
    const parsed = parseZone(f.properties?.flood_zone);
    if (parsed && parsed > zone) zone = parsed;
    if (f.properties?.flood_source) sources.add(f.properties.flood_source);
  }
  return {
    zone,
    risk: zoneToRisk(zone),
    sourceNote:
      zone === 1
        ? "Outside Flood Zones 2 and 3 (Flood Map for Planning, rivers and sea)"
        : `Flood Zone ${zone} · ${Array.from(sources).join(", ") || "rivers and sea"}`,
  };
}

function arcgisUrl(base: string, coords: Coords): string {
  const params = new URLSearchParams({
    geometry: `${coords.lng},${coords.lat}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "*",
    returnGeometry: "false",
    f: "json",
  });
  return `${base}?${params.toString()}`;
}

async function fromArcgis(coords: Coords): Promise<FloodData> {
  const [z3, z2] = await Promise.all([
    fetchJson<ArcGisQuery>(arcgisUrl(ARCGIS_FZ3, coords)),
    fetchJson<ArcGisQuery>(arcgisUrl(ARCGIS_FZ2, coords)),
  ]);
  if (z3.error || z2.error) {
    throw new Error(z3.error?.message || z2.error?.message || "ArcGIS flood query failed");
  }
  const inZ3 = (z3.features?.length ?? 0) > 0;
  const inZ2 = (z2.features?.length ?? 0) > 0;
  const zone: 1 | 2 | 3 = inZ3 ? 3 : inZ2 ? 2 : 1;
  return {
    zone,
    risk: zoneToRisk(zone),
    sourceNote:
      zone === 1
        ? "Outside Flood Zones 2 and 3 (EA Flood Map for Planning)"
        : `Flood Zone ${zone} (EA Flood Map for Planning, rivers and sea)`,
  };
}

export async function getLiveFloodData(coords: Coords): Promise<FloodData> {
  const lat = roundCoord(coords.lat);
  const lng = roundCoord(coords.lng);
  return cached(`flood:${lat},${lng}`, TTL_24H_MS, async () => {
    try {
      return await fromOgc(coords);
    } catch {
      return await fromArcgis(coords);
    }
  });
}
