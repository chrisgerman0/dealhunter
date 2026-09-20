# Deal Hunter

Personal-use UK BMV (below market value) deal hunter focused on **Liverpool** and **Manchester**. Find terraces that can add a bedroom via internal reconfiguration, then model a **BRRR** refinance (Bridge vs Cash+refi).

This repository is a polished **Next.js 14 frontend MVP**. Listings are still mock (Rightmove/Zoopla have no personal API). **Crime, flood and sold-comps layers use live free UK APIs.**

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
| `DATA_SOURCE` | No | `mock` (default), `rightmove`, `zoopla`, or `propertydata`. Non-mock listing classes are stubs until keyed. |
| `PROPERTYDATA_API_KEY` | No | For a future listings integration only. Not used yet. |

No paid keys are required for live enrichment.

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | Explore — filters + map/list |
| `/deals/[id]` | Deal detail — gallery, 8 vetting layers, finance model; fetches live enrichment on load |
| `/shortlist` | Shortlist + side-by-side comparison |
| `/settings` | Capital and search defaults |
| `GET /api/enrich/crime?lat=&lng=` | police.uk street-level crime → `CrimeData` |
| `GET /api/enrich/flood?lat=&lng=` | Environment Agency flood zones → `FloodData` |
| `GET /api/enrich/comps?postcode=&beds=` | Land Registry Price Paid sold comps + GDV bands |
| `GET /api/deals/[id]/enrich` | Merges live crime / flood / comps into the deal JSON |

## Live enrichment (free official APIs)

| Layer | Source | Notes |
|-------|--------|-------|
| Sold comps / GDV bands | [HM Land Registry Price Paid](https://landregistry.data.gov.uk/) SPARQL + Linked Data REST | No bedroom or sqft fields. Nearby postcodes via [postcodes.io](https://api.postcodes.io). GDV median / p75 stretch / p25 conservative when sample ≥ 3; otherwise modelled GDV is kept and labelled thin. |
| Crime | [police.uk](https://data.police.uk/docs/method/crime-street/) street-level `all-crime` | Latest published month, ~1 mile radius. Score 1–10 (lower is safer). |
| Flood | [EA Flood Map for Planning](https://environment.data.gov.uk/spatialdata/flood-map-for-planning-flood-zones/ogc/features/v1) OGC Features (ArcGIS fallback) | Zone 1/2/3 mapped to low/medium/high. |

Responses are cached in memory for **12h (crime)** or **24h (flood, comps, postcodes)**. Upstream fetches abort after **~8 seconds** so Vercel serverless does not hang.

Be polite with rate limits: police.uk asks for a descriptive User-Agent (we send one); Land Registry SPARQL is a shared public endpoint — do not hammer it from batch jobs. postcodes.io is free with fair-use limits.

## Where to plug real listing APIs

Listings stay mock until a keyed provider is added. **Do not scrape Rightmove or Zoopla.**

### Adding PropertyData later

1. Create an account and API key at [PropertyData](https://propertydata.co.uk/) (or similar: Ideal Postcodes, a licensed listings feed).
2. Set `PROPERTYDATA_API_KEY` in Vercel → Project → Environment Variables.
3. Implement `searchListings` and `getListingDetail` in `src/lib/data-sources/propertydata.ts`.
4. Keep using `src/lib/enrich/` for crime, flood and sold comps — those clients are already live and key-free.
5. Set `DATA_SOURCE=propertydata` (factory already accepts this kind).
6. Assemble listing → `Deal` on the server, then run `enrichDeal()` (same helper as `GET /api/deals/[id]/enrich`).

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
