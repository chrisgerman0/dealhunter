# Architecture

## Purpose

Deal Hunter separates **UI state**, **domain models**, and **property data sources** so the polished MVP can run on mock listings today while **crime, flood and sold-comps layers hit live free UK APIs**.

## High-level layout

```
src/
  app/                    # App Router pages + Route Handlers under app/api
  components/             # UI: deals, map, detail, shortlist, settings, layout
  data/mock-properties.ts # 46 fully-vetted mock deals (8 layers each)
  lib/
    data-sources/         # PropertyDataSource interface + Mock / stubs / factory
    enrich/               # Live UK clients (crime, flood, comps) + deal merge
    format.ts             # GBP, quality, capital tags
  store/useDealStore.ts   # Zustand + persist
  types/deal.ts           # Shared domain types
```

## Domain model

Every deal carries eight typed vetting layers:

1. **Physical** — tenure, floorplan, sqft, age
2. **Conversion** — score 1–10 + positives/negatives
3. **Sold comps** — median, sample, GDV bands + comps table (live Price Paid when available)
4. **Refurb** — line items + 15% contingency
5. **Financial** — Bridge BRRR (70% LTV, 1%/mo, 9mo) and Cash+refi; best/base/worst; quality from capital stuck
6. **Income** — Airbnb 75th, council lease % LHA, hybrid
7. **Regulatory** — Article 4, selective licensing, additional HMO, conservation, flood zone (live EA zones)
8. **Risk / motivation** — DOM, reductions, auction keywords, crime (live police.uk), Ofsted, transport, green space, deal score

Quality bands (capital stuck, base Bridge scenario):

- **Excellent** &lt; £15k
- **Good** £15–30k
- **Marginal** &gt; £30k

Capital tags vs user capital:

- cash-in ≤ capital → solo doable
- ≤ 1.5× capital → JV recommended
- else → JV required

## Data source stub design

```ts
interface PropertyDataSource {
  searchListings(params): Promise<Listing[]>
  getListingDetail(id): Promise<ListingDetail>
  getSoldComps(postcode, beds): Promise<Comp[]>
  getAirbnbComps(coords, beds): Promise<AirbnbComp[]>
  getLHARate(postcode, beds): Promise<number>
  getCrimeData(coords): Promise<CrimeData>
  getPlanningData(coords): Promise<PlanningFlags>
  getFloodData(coords): Promise<FloodData>
}
```

| Class | Status |
|-------|--------|
| `MockPropertyDataSource` | Listings from mock catalogue. `getCrimeData` / `getFloodData` / `getSoldComps` call live clients and fall back to mock on failure. |
| `RightmoveDataSource` | Stub — throws until wired. Do not scrape. |
| `ZooplaDataSource` | Stub — throws until wired. Do not scrape. |
| `PropertyDataListingsSource` | Stub for a keyed listings API. |
| `AirDNADataSource` | Stub for STR comps |
| `createPropertyDataSource()` | Factory — listings hard-wired to Mock via `propertyDataSource` export |

UI Explore / shortlist still read enriched `Deal` objects from `src/data/mock-properties.ts`. Deal detail calls `GET /api/deals/[id]/enrich` on load and overlays live layers.

## Live enrichment

Shared clients live in `src/lib/enrich/` and are used by both the Route Handlers and `MockPropertyDataSource`.

| Client | Upstream | Cache | Timeout |
|--------|----------|-------|---------|
| `crime.ts` | `https://data.police.uk/api/crimes-street/all-crime` | 12h in-memory | ~8s |
| `flood.ts` | EA OGC Features Flood Map for Planning (ArcGIS FeatureServer fallback) | 24h | ~8s |
| `comps.ts` | Land Registry SPARQL `VALUES` nearby postcodes + PPD REST street/postcode | 24h | ~8s |
| `postcodes.ts` | postcodes.io lookup / reverse / nearby / bulk | 24h | ~8s |

`merge.ts` (`enrichDeal`) fans the three live calls out with `Promise.allSettled`. Each layer independently:

- **success** → write into the deal + `enrichment.*.status = "live"` + timestamp
- **failure** → keep the mock layer + `status = "mock-fallback"`

Sold-comps GDV: if live sample size ≥ 3, replace median / stretch (p75) / conservative (p25) and top-level `deal.gdv`. If the sample is thinner, keep modelled GDV and set `thinSample`.

Price Paid Data does **not** include bedrooms or floor area. Comps are recent nearby residential sales (standard price paid), with type heuristics for the requested bed count.

### Route Handlers

- `GET /api/enrich/crime?lat=&lng=`
- `GET /api/enrich/flood?lat=&lng=`
- `GET /api/enrich/comps?postcode=&beds=` (optional `lat`/`lng` for better nearby matching)
- `GET /api/deals/[id]/enrich` — always returns Deal JSON (404 if unknown id)

### Rate-limit notes

- **police.uk** — public, no key; identify the app with User-Agent; data is monthly so 12h cache is enough.
- **Land Registry SPARQL / LDA** — shared public SPARQL; prefer exact postcode `VALUES` queries (fast) over `STRSTARTS` (often times out). Cache 24h.
- **EA OGC / ArcGIS** — open data; tiny bbox / point intersect; cache 24h.
- **postcodes.io** — free, fair use; cache lookups.

Keep batch jobs off these endpoints; deal-detail traffic is the intended use.

## Swap path for remaining integrations

1. **Listings** — Implement `searchListings` / `getListingDetail` against PropertyData (or another licensed feed). Map remote fields → `Listing` / `ListingDetail`. Do not scrape Rightmove/Zoopla.
2. **Comps** — Already live via Land Registry. Optional: join EPC (free key) later for bedrooms / sqft.
3. **Airbnb** — AirDNA / PriceLabs / internal scrape in `getAirbnbComps` (and optionally `AirDNADataSource`).
4. **LHA** — VOA LHA tables by BRMA from postcode → `getLHARate`.
5. **Planning / licensing** — planning.data.gov.uk `entity.json` (Article 4, conservation) → `getPlanningData`.
6. **Deal assembly** — listing detail + `enrichDeal()` + shared financial model (extract `buildScenario` from the mock generator into `lib/finance.ts`).
7. Flip `DATA_SOURCE` / factory to the live listings class. Keep Mock for demos and tests.

Suggested next extraction: move `buildScenario` from the mock generator into `src/lib/finance.ts` so live and mock paths share one calculator. Settings (bridge months, rate, LTV, contingency) should feed that calculator once live.

## Client state

Zustand store (`dealhunter-store` in `localStorage`):

- shortlisted / dismissed / snoozed IDs
- settings (capital, cities, freehold, price band, finance defaults)
- Explore filters (derived defaults from settings)
- selected map pin / compare IDs

No auth — personal-use prototype.

## Maps

`DealMap` / `MiniMap` use MapLibre GL with **Esri World Street Map** raster tiles — no API key. `MapFallback` is only used if the basemap fails to load. Do not revert to Mapbox or CARTO.
