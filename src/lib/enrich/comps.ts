import type { City, Comp, Coords, SoldCompsLayer } from "@/types/deal";
import { cached, TTL_24H_MS } from "./cache";
import { haversineMiles } from "./geo";
import { fetchJson, fetchUpstream, UpstreamError } from "./http";
import {
  bulkLookupCoords,
  nearbyPostcodes,
  normalizePostcode,
  resolveLocation,
} from "./postcodes";

const SPARQL_ENDPOINT = "https://landregistry.data.gov.uk/landregistry/query";
const PPD_REST = "https://landregistry.data.gov.uk/data/ppi/transaction-record.json";
const MIN_SAMPLE_FOR_GDV = 3;
const HOUSE_TYPES = new Set(["terraced", "semi-detached", "detached", "flat-maisonette"]);

export interface SoldCompsQuery {
  postcode: string;
  beds: number;
  coords?: Coords;
  address?: string;
  city?: City;
}

export interface SoldCompsResult {
  comps: Comp[];
  bands: Pick<
    SoldCompsLayer,
    "median" | "sampleSize" | "gdvRealistic" | "gdvStretch" | "gdvConservative"
  > & { thinSample: boolean };
  note: string;
  updatedAt: string;
}

interface SparqlBinding {
  [key: string]: { value?: string } | undefined;
}

interface SparqlResponse {
  results?: { bindings?: SparqlBinding[] };
}

interface LdaLabel {
  _value?: string;
}

interface LdaTransaction {
  pricePaid?: number;
  transactionDate?: string;
  transactionCategory?: { prefLabel?: LdaLabel[] | string; _about?: string };
  propertyType?: { prefLabel?: LdaLabel[] | string; _about?: string };
  propertyAddress?: {
    paon?: string;
    saon?: string;
    street?: string;
    town?: string;
    postcode?: string;
  };
}

interface LdaPage {
  result?: { items?: LdaTransaction[] };
}

interface RawSale {
  paon?: string;
  saon?: string;
  street?: string;
  town?: string;
  postcode: string;
  price: number;
  date: string;
  propertyType: string;
  category: string;
}

function labelValue(input: LdaLabel[] | string | undefined): string {
  if (!input) return "";
  if (typeof input === "string") return input;
  return input[0]?._value ?? "";
}

function uriTail(uri: string | undefined): string {
  if (!uri) return "";
  return uri.split("/").pop()?.replace(/-/g, " ") ?? "";
}

function isSafePostcode(pc: string): boolean {
  return /^[A-Z]{1,2}\d[A-Z\d]?( \d[A-Z]{2})?$/.test(pc);
}

function parsePrice(value: string | number | undefined): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function toIsoDate(value: string | undefined): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

function formatAddress(sale: RawSale): string {
  const building = [sale.saon, sale.paon].filter(Boolean).join(", ");
  return [building, sale.street].filter(Boolean).join(" ") || "Unknown address";
}

function saleKey(sale: RawSale): string {
  return `${sale.postcode}|${formatAddress(sale)}|${sale.date}|${sale.price}`;
}

function preferredTypes(beds: number): Set<string> {
  if (beds <= 1) return new Set(["flat-maisonette", "terraced"]);
  if (beds >= 5) return new Set(["terraced", "semi-detached", "detached"]);
  return new Set(["terraced", "semi-detached"]);
}

function isStandard(category: string): boolean {
  const c = category.toLowerCase();
  return c.includes("standard") || c === "";
}

export function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (idx - lo);
}

export function roundTo(value: number, step = 500): number {
  return Math.round(value / step) * step;
}

export function gdvBandsFromPrices(prices: number[]): SoldCompsResult["bands"] {
  const sorted = [...prices].sort((a, b) => a - b);
  const sampleSize = sorted.length;
  const thinSample = sampleSize < MIN_SAMPLE_FOR_GDV;
  const median = roundTo(percentile(sorted, 0.5));
  const stretch = roundTo(percentile(sorted, 0.75));
  const conservative = roundTo(percentile(sorted, 0.25));
  return {
    median,
    sampleSize,
    gdvRealistic: median,
    gdvStretch: stretch,
    gdvConservative: conservative,
    thinSample,
  };
}

function streetFromAddress(address: string | undefined): string | null {
  if (!address) return null;
  const first = address.split(",")[0]?.trim() ?? "";
  const withoutNumber = first.replace(/^\d+\s*(?:[-–]\s*\d+\s*)?/, "").trim();
  return withoutNumber ? withoutNumber.toUpperCase() : null;
}

function townFromCity(city?: City): string | null {
  if (city === "liverpool") return "LIVERPOOL";
  if (city === "manchester") return "MANCHESTER";
  return null;
}

async function sparqlSales(postcodes: string[]): Promise<RawSale[]> {
  const safe = Array.from(new Set(postcodes.map(normalizePostcode).filter(isSafePostcode))).slice(0, 25);
  if (!safe.length) return [];
  const values = safe.map((pc) => `"${pc}"^^xsd:string`).join(" ");
  const query = `
prefix xsd: <http://www.w3.org/2001/XMLSchema#>
prefix lrppi: <http://landregistry.data.gov.uk/def/ppi/>
prefix lrcommon: <http://landregistry.data.gov.uk/def/common/>
prefix skos: <http://www.w3.org/2004/02/skos/core#>
SELECT ?paon ?saon ?street ?town ?postcode ?amount ?date ?ptype ?category
WHERE {
  VALUES ?postcode { ${values} }
  ?addr lrcommon:postcode ?postcode.
  ?transx lrppi:propertyAddress ?addr ;
          lrppi:pricePaid ?amount ;
          lrppi:transactionDate ?date .
  FILTER(?date >= "2022-01-01"^^xsd:date)
  OPTIONAL { ?addr lrcommon:paon ?paon }
  OPTIONAL { ?addr lrcommon:saon ?saon }
  OPTIONAL { ?addr lrcommon:street ?street }
  OPTIONAL { ?addr lrcommon:town ?town }
  OPTIONAL { ?transx lrppi:propertyType/skos:prefLabel ?ptype }
  OPTIONAL { ?transx lrppi:transactionCategory/skos:prefLabel ?category }
}
ORDER BY DESC(?date)
LIMIT 80
`.trim();

  const res = await fetchUpstream(SPARQL_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/sparql-results+json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ query }).toString(),
  });
  if (!res.ok) {
    throw new UpstreamError(`Land Registry SPARQL HTTP ${res.status}`, res.status);
  }
  const data = (await res.json()) as SparqlResponse;
  const bindings = data.results?.bindings ?? [];
  return bindings.flatMap((b) => {
    const price = parsePrice(b.amount?.value);
    const postcode = b.postcode?.value ?? "";
    if (!price || !postcode) return [];
    const sale: RawSale = {
      paon: b.paon?.value,
      saon: b.saon?.value,
      street: b.street?.value,
      town: b.town?.value,
      postcode: normalizePostcode(postcode),
      price,
      date: toIsoDate(b.date?.value),
      propertyType: (b.ptype?.value ?? "").toLowerCase(),
      category: b.category?.value ?? "",
    };
    return [sale];
  });
}

async function restExactPostcode(postcode: string): Promise<RawSale[]> {
  const pc = normalizePostcode(postcode);
  if (!isSafePostcode(pc) || !pc.includes(" ")) return [];
  const params = new URLSearchParams({
    "propertyAddress.postcode": pc,
    "min-transactionDate": "2022-01-01",
    _pageSize: "40",
    _sort: "-transactionDate",
  });
  const data = await fetchJson<LdaPage>(`${PPD_REST}?${params.toString()}`);
  return (data.result?.items ?? []).map(ldaToSale).filter((s): s is RawSale => s != null);
}

async function restStreetTown(street: string, town: string): Promise<RawSale[]> {
  const params = new URLSearchParams({
    "propertyAddress.street": street,
    "propertyAddress.town": town,
    "min-transactionDate": "2023-01-01",
    _pageSize: "20",
    _sort: "-transactionDate",
  });
  const data = await fetchJson<LdaPage>(`${PPD_REST}?${params.toString()}`);
  return (data.result?.items ?? []).map(ldaToSale).filter((s): s is RawSale => s != null);
}

function ldaToSale(item: LdaTransaction): RawSale | null {
  const price = parsePrice(item.pricePaid);
  const addr = item.propertyAddress;
  if (!price || !addr?.postcode) return null;
  const typeAbout = uriTail(item.propertyType?._about);
  const catAbout = uriTail(item.transactionCategory?._about);
  return {
    paon: addr.paon,
    saon: addr.saon,
    street: addr.street,
    town: addr.town,
    postcode: normalizePostcode(addr.postcode),
    price,
    date: toIsoDate(item.transactionDate),
    propertyType: (labelValue(item.propertyType?.prefLabel) || typeAbout).toLowerCase(),
    category: labelValue(item.transactionCategory?.prefLabel) || catAbout,
  };
}

function filterSales(sales: RawSale[], beds: number): RawSale[] {
  const standard = sales.filter((s) => isStandard(s.category));
  const residential = standard.filter((s) => {
    const t = s.propertyType;
    return !t || HOUSE_TYPES.has(t) || t === "flat" || t === "maisonette";
  });
  const pool = residential.length ? residential : standard;
  const prefer = preferredTypes(beds);
  const matched = pool.filter((s) => !s.propertyType || prefer.has(s.propertyType));
  const chosen = matched.length >= MIN_SAMPLE_FOR_GDV ? matched : pool;
  const sane = chosen.filter((s) => s.price >= 30_000 && s.price <= 1_500_000);
  const unique = new Map<string, RawSale>();
  for (const s of sane) unique.set(saleKey(s), s);
  return Array.from(unique.values()).sort((a, b) => b.date.localeCompare(a.date));
}

async function toComps(sales: RawSale[], origin: Coords | null): Promise<Comp[]> {
  const coordMap = await bulkLookupCoords(sales.map((s) => s.postcode));
  return sales.slice(0, 20).map((s) => {
    const here = coordMap.get(normalizePostcode(s.postcode));
    const distanceMiles =
      origin && here ? Math.round(haversineMiles(origin, here) * 100) / 100 : 0;
    return {
      address: formatAddress(s),
      postcode: s.postcode,
      price: s.price,
      beds: 0,
      sqft: 0,
      soldDate: s.date,
      distanceMiles,
      propertyType: s.propertyType || undefined,
    };
  });
}

async function collectSales(query: SoldCompsQuery, nearby: string[]): Promise<RawSale[]> {
  const found: RawSale[] = [];
  const seen = new Set<string>();
  const add = (rows: RawSale[]) => {
    for (const row of rows) {
      const key = saleKey(row);
      if (seen.has(key)) continue;
      seen.add(key);
      found.push(row);
    }
  };

  if (nearby.length) {
    add(await sparqlSales(nearby));
  }

  if (found.length < MIN_SAMPLE_FOR_GDV && nearby[0]) {
    add(await restExactPostcode(nearby[0]));
  }

  const street = streetFromAddress(query.address);
  const town = townFromCity(query.city);
  if (street && town) {
    try {
      add(await restStreetTown(street, town));
    } catch {
      // street search is a boost only
    }
  }

  return found;
}

export async function getLiveSoldComps(query: SoldCompsQuery): Promise<SoldCompsResult> {
  const postcode = normalizePostcode(query.postcode);
  const key = `comps:${postcode}:${query.beds}:${query.address ?? ""}:${query.city ?? ""}`;
  return cached(key, TTL_24H_MS, async () => {
    const { coords, nearby } = await resolveLocation({
      postcode: query.postcode,
      coords: query.coords,
    });
    let postcodes = nearby;
    if (!postcodes.length && coords) {
      postcodes = await nearbyPostcodes(coords, 1200, 20);
    }
    if (!postcodes.length && postcode) {
      postcodes = [postcode];
    }

    const sales = filterSales(await collectSales(query, postcodes), query.beds);
    const comps = await toComps(sales, coords ?? query.coords ?? null);
    const bands = gdvBandsFromPrices(sales.map((s) => s.price));
    const note = bands.thinSample
      ? "Price Paid Data does not include bedroom counts. Nearby sample is thin (n<3), so modelled GDV bands should be kept."
      : "GDV bands from HM Land Registry Price Paid (median / 75th / 25th percentile). Bedroom counts are not in Price Paid Data — comps are recent nearby residential sales.";

    return {
      comps,
      bands: { ...bands, sampleSize: sales.length },
      note,
      updatedAt: new Date().toISOString(),
    };
  });
}
