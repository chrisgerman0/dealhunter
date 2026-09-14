# Deal Hunter

Personal-use UK BMV (below market value) deal hunter focused on **Liverpool** and **Manchester**. Find terraces that can add a bedroom via internal reconfiguration, then model a **BRRR** refinance (Bridge vs Cash+refi).

This repository is a polished **Next.js 14 frontend MVP** with rich mock data and typed data-source stubs ready for real APIs.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Mapbox GL JS (optional token)
- Recharts
- Zustand (+ persist) for shortlist / dismiss / snooze / settings
- British English UI copy

## Quick start

```bash
cd dealhunter
npm install
cp .env.example .env.local   # optional Mapbox token
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
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Mapbox access token. Without it, Explore and deal detail show a graceful schematic / static fallback. |
| `DATA_SOURCE` | No | `mock` (default), `rightmove`, or `zoopla`. Non-mock classes are stubs and throw until implemented. |

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | Explore — filters + map/list |
| `/deals/[id]` | Deal detail — gallery, 8 vetting layers, finance model |
| `/shortlist` | Shortlist + side-by-side comparison |
| `/settings` | Capital and search defaults |

## Where to plug real APIs

Implement or extend classes under `src/lib/data-sources/`:

1. Keep the `PropertyDataSource` interface in `types.ts`.
2. Fill in `RightmoveDataSource`, `ZooplaDataSource`, and `AirDNADataSource`.
3. Switch the factory in `factory.ts` (or set `DATA_SOURCE`).
4. Enrich listing → deal pipeline (comps, LHA, crime, planning, flood) in a server module / route handlers.

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
3. Add `NEXT_PUBLIC_MAPBOX_TOKEN` in Project → Settings → Environment Variables.
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
