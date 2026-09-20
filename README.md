# Deal Hunter

Personal-use UK BMV (below market value) deal hunter focused on **Liverpool** and **Manchester**. Find terraces that can add a bedroom via internal reconfiguration, then model a **BRRR** refinance (Bridge vs Cash+refi).

This repository is a polished **Next.js 14 frontend MVP**. Listings are still mock (Rightmove/Zoopla have no personal API — do not scrape). **Sold comps / GDV come from live Land Registry Price Paid.** Flood zone is a light extra. Crime is not used for buying decisions.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- MapLibre GL + Esri World Street Map tiles (no API key)
- Recharts
- Zustand (+ persist) for shortlist / dismiss / snooze / settings
- British English UI copy

## Quick start

```bash
cd dealhunter
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| *(none for maps)* | — | Maps use MapLibre + free Esri street tiles — no token required. |
| `DATA_SOURCE` | No | `mock` (default) or `propertydata` when keyed. `rightmove` / `zoopla` stubs throw — do not scrape. |
| `PROPERTYDATA_API_KEY` | No | Enables `GET /api/listings/search` against PropertyData `/sourced-properties`. |
| `PROPERTYDATA_LISTS` | No | Comma-separated sourcing lists (default `unmodernised-properties,reduced-properties`). |

No paid keys are required for live enrichment.

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | Explore — filters + map/list |
| `/deals/[id]` | Deal detail — gallery, 8 vetting layers, finance model; fetches live enrichment on load |
| `/shortlist` | Shortlist + side-by-side comparison |
| `/settings` | Capital and search defaults |
| `GET /api/enrich/comps?postcode=&beds=` | Land Registry Price Paid sold comps + GDV bands (median / p75 / p25) |
| `GET /api/enrich/flood?lat=&lng=` | Environment Agency flood zones (optional) |
| `GET /api/deals/[id]/enrich` | Merges live comps (and flood) into the deal JSON |
| `GET /api/listings/search` | Mock listings until `PROPERTYDATA_API_KEY` is set; then PropertyData sourced-properties |

## Live enrichment (free official APIs)

| Layer | Source | Notes |
|-------|--------|-------|
| **Sold comps / GDV** (primary) | [HM Land Registry Price Paid](https://landregistry.data.gov.uk/) SPARQL + Linked Data REST | Nearby postcodes via [postcodes.io](https://api.postcodes.io). Median = realistic GDV; 75th = stretch; 25th = conservative. Sample &lt; 3 keeps modelled GDV and is labelled thin. No bedroom/sqft in Price Paid. |
| Flood (optional) | [EA Flood Map for Planning](https://environment.data.gov.uk/spatialdata/flood-map-for-planning-flood-zones/ogc/features/v1) | Zone 1/2/3 → low/medium/high. |

Responses are cached in memory for **24h**. Upstream fetches abort after **~8 seconds**. Land Registry SPARQL is a shared public endpoint — do not hammer it from batch jobs.

Deal detail shows asking vs live GDV in plain English so a first-time buyer can see whether the price is actually below nearby sold prices, plus whether a 75% refinance of that GDV would cover asking.

## Where to plug real listing APIs

Listings stay mock until a keyed provider is added. **Do not scrape Rightmove or Zoopla.**

### Adding PropertyData

1. Create an API key at [PropertyData](https://propertydata.co.uk/).
2. Set `PROPERTYDATA_API_KEY` in Vercel (optional `PROPERTYDATA_LISTS`, `DATA_SOURCE=propertydata`).
3. `PropertyDataDataSource.searchListings` already calls `GET https://api.propertydata.co.uk/sourced-properties` and maps into `Listing`.
4. `GET /api/listings/search?city=liverpool&minPrice=70000&maxPrice=200000&postcode=L4` uses that source when keyed, otherwise mock.
5. Next step: listing → `Deal` assembler, then `enrichDeal()` for live GDV. Explore still reads the mock catalogue until that assembler exists.

See **ARCHITECTURE.md** for the swap path.

## Push to GitHub

```bash
cd dealhunter
git init
git add .
git commit -m "Initial Deal Hunter MVP"
git branch -M main
git remote add origin https://github.com/chrisgerman0/dealhunter.git
git push -u origin main
```

If the repo already exists and is empty, the same push works after adding the remote.

## Deploy

### Vercel (recommended)

1. Import `chrisgerman0/dealhunter` in the Vercel dashboard (or `vercel` CLI).
2. Framework preset: Next.js.
3. No map token needed. Add listing-provider secrets later under Project → Settings → Environment Variables.
4. Deploy. App Router works with zero config.

```bash
npx vercel
```

### Railway

- New project → Deploy from GitHub.
- Build: `npm run build`
- Start: `npm run start`
- Set the same env vars.
- Or use the official Next.js template / Nixpacks autodetection.

### VPS (Node)

```bash
git clone https://github.com/chrisgerman0/dealhunter.git
cd dealhunter
npm install
npm run build
# process manager
npx pm2 start npm --name dealhunter -- start
```

Put Nginx/Caddy in front for TLS. Set env vars in the process environment.

## Defaults

- Capital: **£50,000**
- Cities: Liverpool + Manchester
- Tenure: freehold only
- Price: £70k–£200k

## Licence

Private / personal use prototype.
