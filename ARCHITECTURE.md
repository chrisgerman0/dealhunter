# Architecture

## Purpose

Deal Hunter separates **UI state**, **domain models**, and **property data sources** so the polished MVP can run on mocks today and swap to live UK listing / comps / STR / planning feeds later without rewriting pages.

## High-level layout

```
src/
  app/                    # App Router pages (Explore, deal detail, shortlist, settings)
  components/             # UI: deals, map, detail, shortlist, settings, layout
  data/mock-properties.ts # 46 fully-vetted mock deals (8 layers each)
  lib/
    data-sources/         # PropertyDataSource interface + Mock / stubs / factory
    format.ts             # GBP, quality, capital tags
  store/useDealStore.ts   # Zustand + persist
  types/deal.ts           # Shared domain types
```

## Domain model

Every deal carries eight typed vetting layers:

1. **Physical** — tenure, floorplan, sqft, age
2. **Conversion** — score 1–10 + positives/negatives
3. **Sold comps** — median, sample, GDV bands + comps table
4. **Refurb** — line items + 15% contingency
5. **Financial** — Bridge BRRR (70% LTV, 1%/mo, 9mo) and Cash+refi; best/base/worst; quality from capital stuck
6. **Income** — Airbnb 75th, council lease % LHA, hybrid
7. **Regulatory** — Article 4, selective licensing, additional HMO, conservation, flood zone
8. **Risk / motivation** — DOM, reductions, auction keywords, crime, Ofsted, transport, green space, deal score

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
| `MockPropertyDataSource` | Implemented — returns mock listings / comps / rates |
| `RightmoveDataSource` | Stub — throws until wired |
| `ZooplaDataSource` | Stub — throws until wired |
| `AirDNADataSource` | Stub for STR comps |
| `createPropertyDataSource()` | Factory — currently hard-wired to Mock via `propertyDataSource` export |

UI pages currently read enriched `Deal` objects from `src/data/mock-properties.ts` for speed and offline demos. The mock data source mirrors the same catalogue for API-shaped calls.

## Swap path for real integrations

1. **Listings** — Implement `searchListings` / `getListingDetail` against Rightmove/Zoopla (or a scraper proxy / PropertyData / Ideal Postcodes enrichment). Map remote fields → `Listing` / `ListingDetail`.
2. **Comps** — Land Registry Price Paid + local filter, or a comps API, in `getSoldComps`. Compute median / GDV bands server-side.
3. **Airbnb** — AirDNA / PriceLabs / internal scrape in `getAirbnbComps` (and optionally `AirDNADataSource`).
4. **LHA** — VOA LHA tables by BRMA from postcode → `getLHARate`.
5. **Crime** — police.uk neighbourhood API → `getCrimeData`.
6. **Planning / licensing** — council GIS / planning.data.gov.uk → `getPlanningData`.
7. **Flood** — Environment Agency flood zone API → `getFloodData`.
8. **Deal assembly** — Add a server action or Route Handler that:
   - fetches listing detail
   - fans out comps / income / risk calls
   - runs the shared financial model (extract from mock generator into `lib/finance.ts`)
   - returns a `Deal`
9. Flip `DATA_SOURCE` / factory to the live class. Keep Mock for demos and tests.

Suggested next extraction: move `buildScenario` from the mock generator into `src/lib/finance.ts` so live and mock paths share one calculator. Settings (bridge months, rate, LTV, contingency) should feed that calculator once live.

## Client state

Zustand store (`dealhunter-store` in `localStorage`):

- shortlisted / dismissed / snoozed IDs
- settings (capital, cities, freehold, price band, finance defaults)
- Explore filters (derived defaults from settings)
- selected map pin / compare IDs

No auth — personal-use prototype.

## Maps

`DealMap` / `MiniMap` use MapLibre GL with a free OpenFreeMap style (OSM data) — no API key. `MapFallback` is only used if the basemap fails to load.
