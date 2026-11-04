"use client";

import { useDealStore } from "@/store/useDealStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatUSD } from "@/lib/r2r/format";
import { MARKET_PROFILES, WORKABLE_MARKETS } from "@/lib/r2r/markets";
import { SEASONALITY_MODEL_LABELS } from "@/lib/r2r/seasonality";
import { ACTIVE_COMP_SOURCE, ALL_COMP_SOURCES } from "@/lib/r2r/comps";
import { useR2RSeeds } from "@/hooks/useR2RSeeds";
import type { FloridaMarket } from "@/types/r2r";
import { toast } from "sonner";

/** Reads the same `/api/r2r/seeds` response Explore uses — never a second, divergent source of truth. */
function RentalSourceStatus() {
  const { data, loading, error } = useR2RSeeds();

  if (loading) {
    return <p className="text-xs text-muted-foreground">Checking…</p>;
  }
  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
        Failed to check: {error}
      </p>
    );
  }
  if (data?.source === "rentcast" || data?.source === "apartmentguide") {
    const isKeyed = data.source === "rentcast";
    return (
      <div className="space-y-1 rounded-lg border border-emerald-300 bg-emerald-50/50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{isKeyed ? "RentCast" : "ApartmentGuide"}</p>
          <Badge className="border-transparent bg-emerald-600 text-white">Live</Badge>
          <Badge variant="outline">{isKeyed ? "Licensed API" : "Keyless scrape"}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{data.note}</p>
      </div>
    );
  }
  if (data?.source === "mock") {
    return (
      <div className="space-y-1 rounded-lg border border-amber-300 bg-amber-50/50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">Mock catalogue</p>
          <Badge variant="outline">Fallback</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {data.note ?? "Both live listings sources came back empty."}
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-1 rounded-lg border border-amber-300 bg-amber-50/50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium">Source not reported</p>
        <Badge variant="outline">Unverified</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        {data?.note ?? "The seeds endpoint did not name a source — treat these figures as unverified."}
      </p>
    </div>
  );
}

/**
 * Structural copy of `src/components/settings/settings-form.tsx` — same
 * centred max-w-xl column, same bordered sections with a `font-medium` h2,
 * same Label/Input pairs in a two-up grid, same Checkbox list, same
 * "Apply defaults to filters" / "Saved automatically" button pair.
 */
export function R2RSettingsForm() {
  const settings = useDealStore((s) => s.r2rSettings);
  const setSettings = useDealStore((s) => s.setR2RSettings);
  const resetFilters = useDealStore((s) => s.resetR2RFilters);

  const toggleMarket = (market: FloridaMarket) => {
    const targetMarkets = settings.targetMarkets.includes(market)
      ? settings.targetMarkets.filter((m) => m !== market)
      : [...settings.targetMarkets, market];
    if (targetMarkets.length === 0) return;
    setSettings({ targetMarkets });
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Capital and defaults drive Explore filters and solo / JV tagging. Stored separately from
          BMV — changing one never touches the other.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">Capital</h2>
        <div className="space-y-2">
          <Label htmlFor="r2r-capital">Available capital ($)</Label>
          <Input
            id="r2r-capital"
            type="number"
            min={5000}
            step={1000}
            value={settings.capital}
            onChange={(e) => setSettings({ capital: Number(e.target.value) || 0 })}
          />
          <p className="text-xs text-muted-foreground">
            Currently {formatUSD(settings.capital)} for deposits, furnishing and float. Deals with
            cash-to-start ≤ capital are <strong>solo doable</strong>; up to 1.5× are{" "}
            <strong>JV recommended</strong>; above that <strong>JV required</strong>.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">Default search</h2>
        <div className="space-y-2">
          <Label>Target markets</Label>
          {WORKABLE_MARKETS.map((market) => (
            <label key={market} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={settings.targetMarkets.includes(market)}
                onCheckedChange={() => toggleMarket(market)}
              />
              {MARKET_PROFILES[market].label}
            </label>
          ))}
          <p className="text-xs text-muted-foreground">
            Only markets where whole-home nightly letting can legally work are listed. Miami Beach,
            Key West, Orlando city and Naples are hard kills and are not selectable targets — they
            stay visible in Explore so the reason is readable.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="r2r-max-rent">Max monthly rent ($)</Label>
            <Input
              id="r2r-max-rent"
              type="number"
              step={100}
              value={settings.maxMonthlyRent}
              onChange={(e) => setSettings({ maxMonthlyRent: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r2r-seasonality">Seasonality model</Label>
            <select
              id="r2r-seasonality"
              className="h-8 w-full rounded-lg border border-border bg-background px-2 text-sm"
              value={settings.seasonalityModel}
              onChange={(e) =>
                setSettings({
                  seasonalityModel: e.target.value as typeof settings.seasonalityModel,
                })
              }
            >
              {Object.entries(SEASONALITY_MODEL_LABELS).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Each market carries its own demand curve, so the model uses the market&apos;s curve rather
          than this one. The setting is here for markets added later that have no profile yet.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">Targets</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="r2r-target-roi">Target cash-on-cash ROI (%)</Label>
            <Input
              id="r2r-target-roi"
              type="number"
              value={settings.targetRoiPct}
              onChange={(e) => setSettings({ targetRoiPct: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r2r-min-net">Min net profit / mo ($)</Label>
            <Input
              id="r2r-min-net"
              type="number"
              step={50}
              value={settings.minNetMonthlyProfit}
              onChange={(e) => setSettings({ minNetMonthlyProfit: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          These are <em>your</em> targets, applied by &quot;Apply defaults to filters&quot;. They do
          not move the Excellent / Good / Marginal bands — those live in{" "}
          <code className="font-mono">src/lib/r2r/thresholds.ts</code> and are the one place a
          verdict is defined.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">Deal assumptions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="r2r-furnishing">Furnishing / bedroom ($)</Label>
            <Input
              id="r2r-furnishing"
              type="number"
              step={100}
              value={settings.furnishingBudgetPerBedroom}
              onChange={(e) =>
                setSettings({ furnishingBudgetPerBedroom: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r2r-contingency">Contingency %</Label>
            <Input
              id="r2r-contingency"
              type="number"
              value={settings.contingencyPct}
              onChange={(e) => setSettings({ contingencyPct: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r2r-cleaning">Cleaning / turnover ($)</Label>
            <Input
              id="r2r-cleaning"
              type="number"
              step={5}
              value={settings.cleaningFeePerTurnover}
              onChange={(e) => setSettings({ cleaningFeePerTurnover: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r2r-management">Management fee (% of gross)</Label>
            <Input
              id="r2r-management"
              type="number"
              value={settings.managementFeePct}
              onChange={(e) => setSettings({ managementFeePct: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r2r-occupancy">Assumed occupancy (%)</Label>
            <Input
              id="r2r-occupancy"
              type="number"
              value={settings.assumedOccupancyPct}
              onChange={(e) => setSettings({ assumedOccupancyPct: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Assumed occupancy is used only when the comp sample is thin or the comp source cannot
          measure occupancy — never in place of a real reading. Management fee at 0 means
          self-managed. Changing any of these re-runs every figure on every deal page immediately.
        </p>
      </section>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            resetFilters();
            toast.success("Filters reset to your defaults");
          }}
        >
          Apply defaults to filters
        </Button>
        <Button variant="outline" onClick={() => toast.success("Settings saved locally")}>
          Saved automatically
        </Button>
      </div>

      <section className="space-y-3 rounded-xl border border-dashed p-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">Comp data source</h2>
          <p className="text-xs text-muted-foreground">
            Where every nightly rate comes from. One interface, one switch — no paid vendor on any
            code path.
          </p>
        </div>
        <div className="space-y-2">
          {ALL_COMP_SOURCES.map((source) => {
            const active = source.id === ACTIVE_COMP_SOURCE.id;
            return (
              <div
                key={source.id}
                className={`space-y-1 rounded-lg border p-3 ${
                  active ? "border-emerald-300 bg-emerald-50/50" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{source.label}</p>
                  {active ? (
                    <Badge className="border-transparent bg-emerald-600 text-white">Active</Badge>
                  ) : (
                    <Badge variant="outline">Available</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{source.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <Capability on={source.capabilities.perListingRows} label="Per-listing rows" />
                  <Capability on={source.capabilities.geoRadius} label="Geo radius" />
                  <Capability on={source.capabilities.occupancy} label="Occupancy" />
                  <Capability on={source.capabilities.seasonalRates} label="Seasonal rates" />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          The live scrape is Deal Hunter&apos;s own — <code className="font-mono">src/lib/r2r/airbnb-live.ts</code>{" "}
          reads airbnb.com directly in USD, per market. It needs no key and never touches
          Chris&apos;s own scraper (<code className="font-mono">nfstay-hq/scripts/competitor-pricing.js</code>,
          Liverpool/Manchester, sterling, its own cron). If a scrape fails for a market, that
          market&apos;s comps fall back to the configured occupancy assumption rather than taking
          the page down.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-dashed p-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">Rental listings source</h2>
          <p className="text-xs text-muted-foreground">
            The units Deal Hunter can lease. Two live sources, tried in order: RentCast when a key
            is set, then a keyless ApartmentGuide scrape, then the mock catalogue as a labelled
            last resort.
          </p>
        </div>
        <RentalSourceStatus />
        <p className="text-xs text-muted-foreground">
          Set <code className="font-mono">RENTCAST_API_KEY</code> (sign up at{" "}
          <code className="font-mono">developers.rentcast.io</code> — free tier 50 calls/mo,
          dev/test only; $74/mo for 1,000) to prefer the licensed API. One call per market per day,
          cached hard against that ceiling — see{" "}
          <code className="font-mono">src/lib/r2r/rentcast.ts</code>.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Keyless fallback, and its risk.</strong> ApartmentGuide needs no key and returns
          real Florida units with exact ZIP and coordinates. Its{" "}
          <code className="font-mono">robots.txt</code> permits the city pages this app reads, but
          its Terms of Service prohibit automated access without written consent — an unresolved
          conflict, flagged rather than buried. One request per market per 12 hours, no login, no
          block circumvention. Zillow, Realtor.com, Apartments.com, HotPads, Rent.com and
          Craigslist were all rejected — see{" "}
          <code className="font-mono">src/lib/r2r/apartmentguide.ts</code> for each one&apos;s
          measured response and the reasoning.
        </p>
      </section>

      <div className="rounded-xl border p-3 text-xs text-muted-foreground">
        <strong>Verdict bands.</strong> Excellent / Good / Marginal are decided by four gates —
        cash-on-cash ROI, net monthly profit, payback months and occupancy headroom against
        break-even. All four must clear a tier to earn it. An STR-illegal address is a hard kill
        that overrides the score entirely, not a penalty applied to it. Edit{" "}
        <code className="font-mono">src/lib/r2r/thresholds.ts</code> and every card, badge, filter
        and detail page moves with it.
      </div>
    </div>
  );
}

function Capability({ on, label }: { on: boolean; label: string }) {
  return (
    <Badge
      variant="outline"
      className={
        on
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-border text-muted-foreground line-through"
      }
    >
      {label}
    </Badge>
  );
}
