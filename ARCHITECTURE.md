# Architecture

## Purpose

Deal Hunter separates **UI state**, **domain models**, and **property data sources** so the polished MVP can run on mock listings today while **sold comps / GDV hit live Land Registry Price Paid**. Flood is a light extra. Crime is not used.

## High-level layout

```
src/
  app/                    # App Router pages + Route Handlers under app/api
  components/             # UI: deals, map, detail, shortlist, settings, layout
  data/mock-properties.ts # 46 fully-vetted mock deals (8 layers each)
  lib/
    data-sources/         # PropertyDataSource interface + Mock / stubs / factory
    enrich/               # Live UK clients (comps, flood) + deal merge
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
8. **Risk / motivation** — DOM, reductions, auction keywords, Ofsted, transport, green space, deal score

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
| `MockPropertyDataSource` | Listings from mock catalogue. `getSoldComps` / `getFloodData` call live clients and fall back to mock on failure. |
| `RightmoveDataSource` | Stub — throws `DataSourceNotAvailableError`. Do not scrape. |
| `ZooplaDataSource` | Stub — throws `DataSourceNotAvailableError`. Do not scrape. |
| `PropertyDataDataSource` | Maps PropertyData `/sourced-properties` → `Listing` (and `/sourced-property` → `ListingDetail`) when `PROPERTYDATA_API_KEY` is set. Comps still Land Registry. |
| `AirDNADataSource` | Stub for STR comps |
| `createPropertyDataSource()` | Single listings switch used by `GET /api/listings/search`. Auto `propertydata` if keyed; honour `DATA_SOURCE`. Explore UI still uses mock deals until a listing→Deal assembler exists. |

UI Explore / shortlist still read enriched `Deal` objects from `src/data/mock-properties.ts`. Deal detail calls `GET /api/deals/[id]/enrich` on load and overlays live layers.

## Live enrichment

Shared clients live in `src/lib/enrich/` and are used by both the Route Handlers and `MockPropertyDataSource`.

| Client | Upstream | Cache | Timeout |
|--------|----------|-------|---------|
| `comps.ts` (primary) | Land Registry SPARQL `VALUES` nearby postcodes + PPD REST street/postcode | 24h | ~8s |
| `flood.ts` | EA OGC Features Flood Map for Planning (ArcGIS FeatureServer fallback) | 24h | ~8s |
| `postcodes.ts` | postcodes.io lookup / reverse / nearby / bulk | 24h | ~8s |

`merge.ts` (`enrichDeal`) fans **comps + flood** with `Promise.allSettled`. Each layer independently:

- **success** → write into the deal + `enrichment.*.status = "live"` + timestamp
- **failure** → keep the mock layer + `status = "mock-fallback"`

Sold-comps GDV: if live sample size ≥ 3, replace median / stretch (p75) / conservative (p25) and top-level `deal.gdv`. If the sample is thinner, keep modelled GDV and set `thinSample`.

Price Paid Data does **not** include bedrooms or floor area. Comps are recent nearby residential sales (standard price paid), with type heuristics for the requested bed count.

### Route Handlers

- `GET /api/enrich/comps?postcode=&beds=` (optional `lat`/`lng` for better nearby matching)
- `GET /api/enrich/flood?lat=&lng=`
- `GET /api/deals/[id]/enrich` — always returns Deal JSON (404 if unknown id); comps + flood only
- `GET /api/listings/search` — `createPropertyDataSource()`; body `{ source, keyed, listings, note }`. Never scrapes Rightmove/Zoopla.

### Rate-limit notes

- **Land Registry SPARQL / LDA** — shared public SPARQL; prefer exact postcode `VALUES` queries (fast) over `STRSTARTS` (often times out). Cache 24h.
- **EA OGC / ArcGIS** — open data; tiny bbox / point intersect; cache 24h.
- **postcodes.io** — free, fair use; cache lookups.
- **PropertyData** — paid key, credit-based; only call from `/api/listings/search` when keyed.

Keep batch jobs off these endpoints; deal-detail traffic is the intended use.

## Swap path for remaining integrations

1. **Listings** — Factory + `PropertyDataDataSource` are ready. Set `PROPERTYDATA_API_KEY` and call `/api/listings/search`. Then assemble listing → `Deal` and point Explore at it. Do not scrape Rightmove/Zoopla.
2. **Comps** — Already live via Land Registry. Optional: join EPC (free key) later for bedrooms / sqft.
3. **Airbnb** — AirDNA / PriceLabs in `getAirbnbComps` (and optionally `AirDNADataSource`). Do not scrape portals.
4. **LHA** — VOA LHA tables by BRMA from postcode → `getLHARate`.
5. **Planning / licensing** — planning.data.gov.uk `entity.json` (Article 4, conservation) → `getPlanningData`.
6. **Deal assembly** — listing detail + `enrichDeal()` + shared financial model (extract `buildScenario` from the mock generator into `lib/finance.ts`).
7. Keep Mock for demos and tests (`DATA_SOURCE=mock`).

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
