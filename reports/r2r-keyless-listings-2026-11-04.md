# R2R keyless listings — what shipped, what is proved, what is still assumed

**Date:** 2026-11-04
**Commits:** `132f1b6`, `0b8722d`, `b8ff9cd`, `b4d2ffe` on `main`
**Acceptance:** `source: "apartmentguide"` served from `https://dealhunter.vercel.app`

---

## 1. The source

**ApartmentGuide.com**, read keylessly from the bare city page
`https://www.apartmentguide.com/apartments/Florida/<City>/`, parsing the
`__NEXT_DATA__` payload. Adapter: `src/lib/r2r/apartmentguide.ts`.

Precedence, decided in `src/lib/r2r/live-deals.ts`:

```
RentCast (only if RENTCAST_API_KEY set)  →  ApartmentGuide (keyless)  →  mock (labelled)
```

### Why this one and not the others

Every candidate was probed live by curl from the Contabo box before any
adapter was written. Measured results:

| Source | Result | Verdict |
|---|---|---|
| **ApartmentGuide** | **HTTP 200, 748 KB, 50 structured listings** | **used** |
| Craigslist | HTTP 200, 316 results, per-posting lat/lng + ZIP | rejected, see below |
| HotPads | HTTP 403 | dead |
| Apartments.com | HTTP 403 | dead |
| ForRent | HTTP 403 | dead |
| ApartmentList | HTTP 403 | dead |
| Realtor.com | HTTP 429 | dead |
| Rent.com | HTTP 202, empty body | dead |
| Zumper | HTTP 200 but a 3 KB JS shell, no listing data | dead |
| PadMapper | HTTP 200 but a 3 KB JS shell | dead |
| Zillow | HTTP 403 | excluded by instruction anyway |

**Craigslist was rejected on purpose, not on capability.** It works: the
static result list (street address + price) is positionally 1:1 with a
`ld_searchpage_results` JSON-LD block (lat/lng, beds, baths) — verified 316
items against 316 results — and each posting page carries a full
`PostalAddress` including ZIP. It was dropped because its ToS carries the
same scraping prohibition **plus** a liquidated-damages schedule, craigslist
has a real litigation record for exactly this (*craigslist v. 3Taps*), and it
block-listed this box mid-session: a second request to the same search with
`&format=rss` returned `HTTP 403 "Your request has been blocked."` Strictly
worse legal footing and an actively hostile surface, for worse data.

---

## 2. Evidence it is real and live from production

```
$ curl 'https://dealhunter.vercel.app/api/r2r/seeds?market=tampa'
code=200 time=0.89s size=46431

source   : apartmentguide
dataAsOf : 2026-11-04T10:53:21.821Z
seeds    : 12
isMock   : false on all 12
marketStatus: tampa: 12 live ApartmentGuide listing(s) (capped at 12 of 241 found, most bedrooms first).
```

All six workable markets, from production:

```
$ curl 'https://dealhunter.vercel.app/api/r2r/seeds'
code=200 time=3.37s — source: apartmentguide, 72 seeds
tampa 12 (of 241) · kissimmee 12 (of 240) · broward 12 (of 346)
clearwater-stpete 12 (of 224) · panama-city-beach 12 (of 134) · destin 12 (of 92)
```

`https://dealhunter.vercel.app/r2r` → HTTP 200.

### Three addresses spot-checked against the source site

Each seed field re-verified against an independent fresh fetch of the live
Tampa city page:

| Seed claim | Live page | Match |
|---|---|---|
| 2450 E Hillsborough Ave, 33610, 4bd/2ba, $1,811, 1329 sqft | Meridian Pointe Apartments, `27.997525,-82.430863`, floor plan `(4, 2, 1811, 1329)` | exact |
| 5008 Sierra Pl, 33617, 3bd/2ba, $1,399, 1304 sqft | Riverside Palms, `28.0269478,-82.4002427`, floor plan `(3, 2, 1399, 1304)` | exact |
| 4102 Oak Knoll Ct, 33610, 3bd/2ba, $1,450, 1134 sqft | Crown Pointe Apartments, `28.0111569,-82.4117055`, floor plan `(3, 2, 1450, 1134)` | exact |

Photos resolve to real images (`https://i.apartmentguide.com/t_3x2_fixed_webp_lg/<id>`
returned `HTTP 200 image/webp`, 42 KB).

### Gates

- `npx tsc --noEmit` → exit 0
- `npm run build` → exit 0, 57/57 static pages
- Degradation proved by accident, which is the best kind: mid-session the
  scrape returned HTTP 429 and the endpoint returned `source: "mock"` with
  `tampa: "...fetch failed: ApartmentGuide returned HTTP 429 for
  Florida/Tampa"`. Fallback and labelling both correct under real failure.

---

## 3. ToS / robots position — the honest version

**robots.txt** (fetched 2026-11-04): the city pages this adapter reads are
**not** disallowed. The adapter obeys every relevant `Disallow` — it sends
**no query string at all** (`/*?*min_price=*`, `/*?*max_price=*`, `/*?limit`
are all disallowed), and never touches `/graphql/`, `/api/maps/*`,
`/api/rift*`, `/filter*`, `/multi-search/*` or `/listings/photos/*`.

**Terms of Service** (`/legal/terms-of-service/`) §11 "Access and
Interference" says verbatim: *"You agree that you will not use any robot,
spider, scraper or other automated means to access the Sites for any purpose
without our prior written consent"*, and elsewhere prohibits *"'scraping'
(including screen and database scraping), 'data mining'"*.

**That conflict is real and this report does not resolve it.** A permissive
robots.txt and a prohibitive ToS disagree, and the ToS is the document with
legal weight. Mitigation here is technical, not legal: one request per market
per 12 hours, three markets concurrent at most, no login, no paid-content
bypass, no attempt to solve or circumvent the challenge page, and use limited
to evaluating properties to lease — which is the one purpose the ToS's own
data clause carves out (*"except in connection with your consideration of
leasing a property"*). **Chris's call whether that is good enough.**
`RENTCAST_API_KEY` is the clean route and takes precedence automatically the
moment it is set.

**One more thing worth stating plainly rather than dressing up:** a truthful
self-identifying User-Agent does not work. Measured on the same URL, requests
seconds apart, reproduced on two markets in both directions:

```
UA "DealHunterR2R/0.1 (+https://dealhunter.vercel.app)"  → HTTP 302 (challenge page)
UA Chrome/124 desktop string                             → HTTP 200, 748 KB
```

So the adapter sends a browser UA, matching the existing `airbnb-live.ts`
precedent in this codebase. The choice was a browser UA or no feature; it was
not a free choice between polite and impolite.

---

## 4. What is still assumed, not measured

**The big one — comp coverage is thin, and it is a pre-existing property of
the comps engine, not of this change.** Only **11 of 72** production seeds
have even one Airbnb comp inside the 1 km band. Measured cause: one
city-slug Airbnb search returns **38 listings for the whole Tampa metro**, of
which only **2 fall within 1 km of the city centre**. At a 1 km maximum
radius a 38-listing pool over ~300 km² will almost always be empty, so most
deals are currently underwritten on the *configured occupancy and ADR
assumption*, not on real comps. Every seed says so in its
`compsSourceNote`, so nothing is presented as measured when it is not — but
the deal economics are much weaker than the listing data behind them.

The RentCast path has this identical characteristic; it was not introduced
here and fixing it means changing the comps engine (denser scan per market,
or a bounding-box scan around the listing cluster), which is governed by
Chris's "you are my price labs" ruling and was out of scope for this task.
**This is the highest-value follow-up.**

Also not measured, per-listing:

- **County** — ApartmentGuide does not carry it. Taken from the market
  profile and labelled as such in `physicalNotes`, never presented as feed data.
- **Year built, parking count, A/C age** — absent from this feed. `null`.
- **Pool** — set from the advertised amenity list only; not verified on site.
- **Rent** — the floor plan's `priceRange.min`. When the plan itself spans a
  band, `rentIsFromPrice` is set and a risk watch item says the quoted unit
  may price higher.
- **Baths** — the floor plan's integer `bathCount`. The building's own
  `bathText` sometimes shows halves ("1.5 Baths"), so the plan figure may be
  rounded.
- **HOA, zoning, FEMA flood zone, landlord sublet consent** — all unverified,
  as before, and all flagged on the seed.

**Inventory character:** this feed is overwhelmingly managed multifamily, not
private landlords. A blanket no-sublet clause is the norm in corporate
leases, which is the single most common way an apartment-complex R2R dies.
A risk watch item now says this on every `apartment` row. Private-landlord
inventory is where Craigslist would have been genuinely better, and that
trade-off was made knowingly.

**Cap:** 12 listings per market, most bedrooms first, out of 92–346 found.
Never silent — the count found is in `marketStatus` every time.

---

## 5. What only Chris can do

1. **Rule on the ToS risk.** Keep the keyless ApartmentGuide source, or set
   `RENTCAST_API_KEY` in Vercel and have it take over automatically. Nothing
   in the code needs to change either way — this is a decision, not a task.
2. **Set `RENTCAST_API_KEY` in Vercel** if he wants the licensed feed to lead
   (Project → Settings → Environment Variables, then redeploy). Only
   `NEXT_PUBLIC_MAPBOX_TOKEN` and `DATA_SOURCE` are set there today.
3. **Decide whether to fix comp density** (§4) — it needs a change to the
   comps engine, which is his ruling territory.
4. **Decide whether apartment-complex inventory is worth underwriting at
   all**, given the sublet-clause reality, or whether R2R should chase
   private-landlord inventory instead and accept a harder data source.
