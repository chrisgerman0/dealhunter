# Deal Hunter R2R — live data wiring

**Date:** 2026-11-04
**Scope:** Wire real data into `/r2r`. No new npm deps. BMV untouched.

---

## What changed

Starting state: the R2R engine (9-layer vetting, finance, thresholds, markets)
was already fully built by an earlier session, but 100% fake — 22 hand-written
mock seeds, `isMock: true` everywhere, no live feed anywhere. A `StrCompSource`
seam existed in `src/lib/r2r/comps.ts` but its live option depended on reading
`nfstay-hq/live-data/competitor-pricing.json`, which this build is explicitly
forbidden from touching or depending on (and which has no Florida scans in it
— only Liverpool/Manchester, sterling).

### 1. Airbnb comps — live, no key, self-contained

`src/lib/r2r/airbnb-live.ts` is Deal Hunter's **own** scraper, not a dependency
on Chris's NFsTay one. It reads `airbnb.com` search pages directly
(`currency=USD&locale=en-US`, `room_types[]=Entire home/apt`) and parses the
same embedded-JSON price-breakdown lines the NFsTay scraper reads
(`"N night(s) x $X"`).

**Verified live, 2026-11-04**, against Kissimmee, FL:
- The page still serves this shape (confirmed the NFsTay scraper's technique
  still works against today's Airbnb markup).
- It goes further than the NFsTay scraper or the old design here assumed:
  **each listing's lat/lng is in the page too.** That means real per-listing
  geo radius matching, not an area-level aggregate standing in for one.
- `"same_street"` genuinely cannot be matched — no street address is public.
  Requests for it fall back to the tightest band actually measurable (250m)
  and the comp-set's `sourceNote` says so explicitly, every time.
- Occupancy is still not measurable from any public Airbnb page.
- Bedroom count per listing is not in the page's JSON; comps are tagged with
  the *subject property's* bed count as a stated assumption, never claimed
  as measured.
- Seasonal (peak/shoulder/off) rates are the p75/median/p25 of the live price
  distribution within the matched radius — an assumption, stated as such.

Cached per market via Next's Data Cache (`revalidate: 43200`, 12h) — survives
across Vercel serverless cold starts, unlike an in-process cache would.

**Diagnosed the NFsTay scraper's actual staleness** (was asked to check):
it is **not broken**. Ran it live against `airbnb.co.uk` during this session
and it still returns correct data. The 54-day gap is a missing scheduler:
`daily-price-sweep.sh`'s own header says "runs via pm2 cron," but there is no
such pm2 process (checked `pm2 list` and `crontab -l` — absent from both).
Something removed the cron entry without removing the comment describing it.
Not fixed (out of scope — don't touch nfstay-hq), but flagged so it isn't
mistaken for a parsing failure.

### 2. Long-term rental listings — RentCast, wired, needs a key

Checked all the candidates from yesterday's report plus re-verified the ones
that mattered: Zillow (partner-only, no public API), Realtor.com /
Apartments.com / Rent.com (no official API, ToS explicitly prohibits
scraping — did not build against these), Bridge Interactive / ATTOM
($500+/mo enterprise), local MLS/IDX (membership-gated). RentCast remains the
only practical option. Confirmed via their own docs search results (direct
fetch of `developers.rentcast.io` was blocked by Cloudflare bot-check from
this VPS's IP both times — field names below are RentCast's documented
public schema, not guessed, but have not been exercised against a live key
in this session).

`src/lib/r2r/rentcast.ts`: one call per market per day (`revalidate: 86400`),
because the free tier is **50 calls/month total** — roughly 1.6/day across
every market combined. No key → the module is never called at all; falls
back to mock cleanly, every time, with the reason stated in the API response.

**Tested the failure path with a bogus key**: RentCast returned a clean
`401 auth/api-key-invalid` — confirms the endpoint, host, and `X-Api-Key`
header are correctly shaped; a real key should work without further changes.
The app's own fallback caught it and served the mock catalogue with the exact
RentCast error visible in `/api/r2r/seeds`' `note` field — never silently
presented as real.

RentCast does not reliably carry MLS photos for every listing. **Did not
substitute Unsplash stock for a real listing** (would recreate the exact
mistake Chris described from BMV). Added a plain "no photo provided by
listing feed" placeholder image instead (`public/no-photo.png`) for when the
feed has none.

### 3. Wiring

- `src/lib/r2r/live-deals.ts` — turns RentCast listings + their market's live
  Airbnb comps into `R2RSeed[]`, through the **same** `assembleR2RDeal()` the
  mock catalogue always used. No duplicate maths path.
- New route `/api/r2r/seeds` returns `{ seeds, source: "rentcast"|"mock",
  dataAsOf, note, marketStatus }`. `source` is never ambiguous.
- `useFilteredR2RDeals`, the shortlist page and the deal detail page all now
  fetch from that route instead of the static mock file. The detail page
  lost `generateStaticParams` (can't pre-render ids that don't exist yet) and
  is dynamic now.
- Explore shows a banner: green "Live RentCast listings · fetched …" or amber
  "Live feed not connected — showing sample data." Settings shows the same
  status for both the rental feed and the comp scrape, plus capability
  badges per source (geo radius / occupancy / per-listing rows / seasonal
  rates) — unchanged UI pattern from what was already there.
- `isMock` already rendered on every card and the detail page from the prior
  build — no UI change needed there, just making the flag correct.
- `next.config.mjs`: added `images.unoptimized: true`. RentCast's listing
  photos can come from any CDN host — unknown until a real key is live — and
  Next's image optimizer requires a host allowlist. `unoptimized` skips that
  loader entirely; images still render at the same sizes via CSS. BMV's
  Unsplash images are unaffected in output, just not server-resized.

### What's still an honest placeholder on a live listing

Everything the research report said can't be automated, still can't be:
HOA bylaws, landlord sublet consent, zoning verification, physical
walkthrough items (pool, A/C age, parking), FEMA flood zone. These are set to
`"unverified"` / `"not_asked"` / `null` — never invented — and every one
surfaces as a flag or watch-item on the deal, same pattern the mock catalogue
already used for the genuinely-unknowable fields.

---

## Verified vs assumed

**Proved, live, this session:**
- Airbnb search pages still carry the price-breakdown JSON the NFsTay
  scraper reads, now against `airbnb.com`/USD/Florida.
- Those pages also carry per-listing lat/lng — real geo radius is possible,
  not just an aggregate.
- The NFsTay scraper itself is not broken; its cron is missing.
- RentCast's endpoint/auth shape is correct (401 on a bad key, not a 400 or
  connection failure).
- Full route sweep on a production build: `/`, `/settings`, `/deals/deal-001`
  (BMV) and `/r2r`, `/r2r/shortlist`, `/r2r/settings`, `/r2r/deals/r2r-001`,
  `/r2r/deals/does-not-exist` (R2R) all return 200.
- `npx tsc --noEmit` and `npm run build` both pass clean.
- Keyed-but-failing RentCast degrades to mock with the real error shown, not
  silently.

**Assumed, not yet verified against a real response:**
- RentCast's exact field names (`formattedAddress`, `latitude`/`longitude`,
  `bedrooms`, `photos`, etc.) — taken from their documented public schema;
  their docs pages 403'd from this VPS's IP (Cloudflare bot wall) both times
  I tried. Defensive parsing throughout, but Chris should sanity-check the
  first live response once the key is in.
- Whether RentCast returns usable photo URLs for Florida listings at all.

**Not attempted (deliberately out of scope):**
- FEMA flood zone lookup for Florida — UK BMV has a free live source for
  this (Environment Agency); the US equivalent (FEMA NFHL) was not wired in
  this pass. Flagged as unverified on every live seed rather than guessed.

---

## Keys needed (Chris's call — not requested in chat, no value handled here)

| Need | Env var | Signup | Free tier (verified) | Paid |
|---|---|---|---|---|
| Long-term rental listings | `RENTCAST_API_KEY` | developers.rentcast.io | 50 calls/mo, dev/test only | $74/mo for 1,000 calls |
| Airbnb comps | — none — | — | Deal Hunter's own scraper, no key | — |

Pasting the RentCast key into Vercel (`RENTCAST_API_KEY`, Production +
Preview) is the only remaining step for real Florida rental listings. Airbnb
comps are already live with no action needed.
