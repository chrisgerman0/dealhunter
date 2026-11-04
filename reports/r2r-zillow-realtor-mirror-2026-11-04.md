# Zillow + Realtor.com mirror — what works, what is blocked, what it costs

_2026-11-04. Every HTTP result below was measured, not inferred._

## The one-line answer

The mirror is built, deployed and working. **Zillow's parser is proved against
41 real listing records.** Neither site can be reached from our servers without
a **US residential proxy**, because both block by IP — and that is now
confirmed from production, not just from the dev box. Adding one credential is
the only remaining step.

## What was probed, and what came back

| Attempt | Result |
|---|---|
| Zillow, curl, from Contabo (FR, `hosting=true`) | **403** PerimeterX `px-captcha` |
| Zillow, full desktop-Chrome headers | **403** — identical |
| Zillow, real headless Chromium, `navigator.webdriver` stripped | **403** — identical |
| Zillow, from a different egress IP | **200**, 979 KB, **41 listings parsed** |
| Zillow, from **Vercel production** | **403** PerimeterX |
| Zillow internal `async-create-search-page-state` / `GetSearchPageState` | **403** both |
| Realtor, curl from Contabo | **429** Kasada (`KP_UIDz`, `x-kpsdk-ct`) |
| Realtor, real headless Chromium from Contabo | **200** — but *"Not available in your region"*. A **geo-block** |
| Realtor, from **Vercel production** (US IP) | **429** Kasada — the geo-wall is gone, Kasada remains |
| Realtor `frontdoor/graphql`, no client headers | **400** `"missing client identification headers"` |
| Realtor `frontdoor/graphql`, `rdc-client-name` set | **400** `"Required parameter is missing"` — header gate opens, a further param is still needed |

### The conclusion that matters

**The Zillow block is IP reputation, not browser fingerprinting.** The same
bytes that get a 403 from a datacenter IP get a 200 and a full `__NEXT_DATA__`
payload from a residential one, with **no JavaScript executed at all**. So a
headless browser is not the fix — it was tested and fails identically. The UI
therefore renders the "headless browser" toggle **disabled with the reason**
rather than offering a control that does nothing.

Realtor.com has **two** walls, and production has already cleared the first:
from Vercel's US IP the geo-block is gone and only Kasada's JS challenge
remains.

## What was proved about the data

From `https://www.zillow.com/tampa-fl/rent-houses/`:

- 41 rows at `props.pageProps.searchPageState.cat1.searchResults.listResults`
- `homeType`: **SINGLE_FAMILY 41/41** · `isBuilding` false 41/41
- `totalResultCount` 977 · `totalPages` 20 · pagination `/2_p/` verified
- rent, beds, baths, sqft, ZIP present on **41/41**; coordinates on 39/41
- sample: zpid `466234341` · `$1,999/mo` · 3 bed / 1 bath / 1,560 sqft · 33613

### Two traps found and closed

**1. The default rentals URL is useless for R2R.** `zillow.com/tampa-fl/rentals/`
returns **41/41 apartment *buildings*** — no price, beds or baths of their own,
only a `units[]` array of `"$1,567+"` teasers. A managed complex's lease bans
subletting, so these are dead before underwriting. They are mirrored (so the
dedupe counters stay honest) but flagged `isApartmentComplex` and excluded from
grading and from the table by default. **`/rent-houses/` is the URL shape to
paste.**

**2. `/rent-condos/` is a *for-sale* search.** It looks like a rental URL and is
not: it redirects to the for-sale SRP and returns 41 rows with
`statusType: "FOR_SALE"` at sale prices. Without a gate, a $450,000 sale price
becomes a monthly rent and the engine grades a fantasy deal "Excellent". A
rental-only gate now runs on Zillow's own `statusType` — **verified: 41
rejected, 0 leaked**. The gate is on the data, not the URL, because a URL
cannot be trusted to describe what it returns.

## Verified end to end (no network needed)

Against the real captured payloads:

- dedupe — re-running the same page: **created 0, dupes 41**
- pagination — two pages accumulate to **82 unique keys, 0 collisions**
- delisting — refresh returning only page 2 marks **41 delisted**, history kept
- revive — page 1 returning marks **41 revived**, `firstSeenAt` preserved
- R2R handoff — **82 underwritable**, all rent > 0, none apartment-type
- adding 41 complex rows leaves underwritable at 82 and reports 41 excluded
- block detection — correct on **4 real blocked bodies**, no false positive on a real 200

## Verified in production (`dealhunter.vercel.app`)

- `GET /api/mirror/run` → 200, reports proxy state, store durability, adapter confidence
- `GET /api/mirror/listings` → 200, per-search error recorded with the real block reason
- `POST /api/mirror/run` with `169.254.169.254` (AWS metadata) → **400 refused**
- `POST` with `127.0.0.1` → **400 refused**
- `GET /r2r/mirror` → 200, console renders

## Proxy path verified without a paid proxy

A local authenticated CONNECT proxy was stood up and the app pointed at it:

- undici `ProxyAgent` loads; proxy observed `CONNECT www.zillow.com:443`
- Basic auth built from env and **accepted**
- rotation works: `dhuser-session-0`, `session-0`, `session-1` at rotate-every-2
- `via: "proxy"` reported back
- **password: 0 occurrences** in the API response and 0 in the app log
- a dead proxy yields `TypeError: fetch failed (via proxy 127.0.0.1:8899)` — no
  username, no password

So the plumbing is proved. Only the egress IP is missing.

## Credentials Chris must create

| Var | Why | Without it |
|---|---|---|
| `SCRAPE_PROXY_URL` | US residential proxy, `http://user:pass@host:port` | **Zero rows from either site.** Everything else works and reports the block honestly |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Upstash Redis — durable mirror | Mirror is an in-memory Map per serverless instance; counts appear to reset. UI says so |

Nothing else needs to change when they are added.

## Real cost

Measured page size: **638–979 KB, ~0.72 MB average**.

- 10 markets × 2 pages, **daily** = ~14 MB/day = **~0.43 GB/month**
- 10 markets × 20 pages (full depth), daily = ~4.2 GB/month

Against October 2026 market pricing — budget tier (IPRoyal / Webshare /
DataImpulse) ~$1–1.75/GB, mid-market (Decodo) ~$3.50–3.75/GB with a smallest
plan of $11.25 for 3 GB, enterprise (Bright Data) $8/GB pay-as-you-go:

**A daily refresh of all ten markets at 2 pages costs well under 1 GB/month.**
Decodo's $11.25 / 3 GB plan covers it roughly seven times over. Realistic
budget: **$11–15/month**, or a few dollars pay-as-you-go. Full 20-page depth
daily is ~4.2 GB — still about **$15–25/month** on the mid tier.

This is not an expensive problem. It is a $12/month problem.

## ToS position — unchanged and still unresolved

Zillow's and Realtor.com's Terms prohibit automated access regardless of what
their robots.txt permits. This is the same unresolved conflict already
documented at length in `src/lib/r2r/apartmentguide.ts`. Chris has been told
twice and has reaffirmed, so it is implemented defensively rather than
re-litigated: bounded pages per search, real inter-page delays, no login, no
paid-content bypass, **no attempt to solve or evade either challenge**, the
canonical city paths only (never the GraphQL endpoints their own frontends
use), and no query strings. The mitigation is technical, not legal.

Worth stating plainly: the mirror will go stale when either site changes its
page shape. Block detection names the wall rather than reporting "0 listings",
so a break looks like a break instead of an empty market.
