"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useDealStore } from "@/store/useDealStore";
import { formatUSD } from "@/lib/r2r/format";
import { MARKET_PROFILES, WORKABLE_MARKETS, FLORIDA_MARKETS } from "@/lib/r2r/markets";
import { UNIT_TYPE_LABELS } from "@/lib/r2r/format";
import type { DealQuality, FloridaMarket, UnitType } from "@/types/r2r";

const QUALITIES: DealQuality[] = ["excellent", "good", "marginal"];
const UNIT_TYPES: UnitType[] = ["single_family", "condo", "townhouse", "duplex", "apartment"];

/**
 * Structural copy of `src/components/deals/filter-panel.tsx` — same aside
 * shell, same header + ghost Reset, same icon-inset search, same chip grid for
 * the geography group, same two-handle sliders, same checkbox stacks.
 *
 * Markets are grouped workable / hard-kill rather than by city the way BMV
 * groups postcode areas by city. The dead markets stay listed on purpose: a
 * market that is quietly missing teaches nothing, a market that is visibly
 * dead teaches why.
 */
export function R2RFilterPanel() {
  const filters = useDealStore((s) => s.r2rFilters);
  const setFilters = useDealStore((s) => s.setR2RFilters);
  const resetFilters = useDealStore((s) => s.resetR2RFilters);
  const capital = useDealStore((s) => s.r2rSettings.capital);

  const killMarkets = FLORIDA_MARKETS.filter((m) => !WORKABLE_MARKETS.includes(m));

  const toggleMarket = (market: FloridaMarket) => {
    const markets = filters.markets.includes(market)
      ? filters.markets.filter((m) => m !== market)
      : [...filters.markets, market];
    setFilters({ markets });
  };

  const toggleUnitType = (type: UnitType) => {
    const unitTypes = filters.unitTypes.includes(type)
      ? filters.unitTypes.filter((t) => t !== type)
      : [...filters.unitTypes, type];
    setFilters({ unitTypes });
  };

  const toggleQuality = (q: DealQuality) => {
    const qualities = filters.qualities.includes(q)
      ? filters.qualities.filter((x) => x !== q)
      : [...filters.qualities, q];
    setFilters({ qualities });
  };

  const marketGroups: [string, FloridaMarket[]][] = [
    ["workable", WORKABLE_MARKETS],
    ["STR-illegal", killMarkets],
  ];

  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto border-r bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        <Button size="sm" variant="ghost" onClick={resetFilters}>
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search city, address or ZIP…"
          value={filters.query}
          onChange={(e) => setFilters({ query: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Markets</Label>
        <div className="space-y-2">
          {marketGroups.map(([group, markets]) => (
            <div key={group}>
              <p className="mb-1 text-[11px] capitalize text-muted-foreground">{group}</p>
              <div className="flex flex-wrap gap-1.5">
                {markets.map((market) => {
                  const active = filters.markets.includes(market);
                  const dead = !WORKABLE_MARKETS.includes(market);
                  return (
                    <button
                      key={market}
                      type="button"
                      onClick={() => toggleMarket(market)}
                      title={MARKET_PROFILES[market].verdict}
                      className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
                        active
                          ? dead
                            ? "border-red-600 bg-red-50 text-red-800"
                            : "border-emerald-600 bg-emerald-50 text-emerald-800"
                          : "hover:bg-muted"
                      }`}
                    >
                      {MARKET_PROFILES[market].city}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">
          None selected shows every market. Florida only preempts STR bans adopted after 1 June
          2011, so the pre-2011 cities are genuinely dead, not merely strict.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Monthly rent
          </Label>
          <span className="text-xs font-medium">
            {formatUSD(filters.minRent, true)} – {formatUSD(filters.maxRent, true)}
          </span>
        </div>
        <Slider
          min={1000}
          max={6000}
          step={100}
          value={[filters.minRent, filters.maxRent]}
          onValueChange={(v) => {
            const val = v as number[];
            if (val.length >= 2) setFilters({ minRent: val[0], maxRent: val[1] });
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Beds</Label>
          <span className="text-xs font-medium">
            {filters.minBeds} – {filters.maxBeds}
          </span>
        </div>
        <Slider
          min={1}
          max={6}
          step={1}
          value={[filters.minBeds, filters.maxBeds]}
          onValueChange={(v) => {
            const val = v as number[];
            if (val.length >= 2) setFilters({ minBeds: val[0], maxBeds: val[1] });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Unit type</Label>
        <div className="flex flex-wrap gap-1.5">
          {UNIT_TYPES.map((type) => {
            const active = filters.unitTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleUnitType(type)}
                className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
                  active ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "hover:bg-muted"
                }`}
              >
                {UNIT_TYPE_LABELS[type]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Amenities</Label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={filters.poolOnly}
            onCheckedChange={(checked) => setFilters({ poolOnly: !!checked })}
          />
          Pool only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={filters.hideRegulatoryKills}
            onCheckedChange={(checked) => setFilters({ hideRegulatoryKills: !!checked })}
          />
          Hide STR-illegal addresses
        </label>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Deal quality
        </Label>
        {QUALITIES.map((q) => (
          <label key={q} className="flex items-center gap-2 text-sm capitalize">
            <Checkbox
              checked={filters.qualities.includes(q)}
              onCheckedChange={() => toggleQuality(q)}
            />
            {q}
          </label>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Min net profit / mo
          </Label>
          <span className="text-xs font-medium">
            {filters.minNetProfit > 0 ? formatUSD(filters.minNetProfit) : "Any"}
          </span>
        </div>
        <Slider
          min={0}
          max={3000}
          step={100}
          value={[filters.minNetProfit]}
          onValueChange={(v) => {
            const val = v as number[];
            setFilters({ minNetProfit: val[0] });
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Min cash-on-cash ROI
          </Label>
          <span className="text-xs font-medium">
            {filters.minRoiPct > 0 ? `${filters.minRoiPct}%` : "Any"}
          </span>
        </div>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[filters.minRoiPct]}
          onValueChange={(v) => {
            const val = v as number[];
            setFilters({ minRoiPct: val[0] });
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Max cash-to-start
          </Label>
          <span className="text-xs font-medium">
            {filters.maxCashToStart != null ? formatUSD(filters.maxCashToStart, true) : "Any"}
          </span>
        </div>
        <Slider
          min={10000}
          max={80000}
          step={2500}
          value={[filters.maxCashToStart ?? 80000]}
          onValueChange={(v) => {
            const val = v as number[];
            // Top of slider = no hard cap ("Any")
            setFilters({ maxCashToStart: val[0] >= 80000 ? null : val[0] });
          }}
        />
        <p className="text-[11px] text-muted-foreground">
          Optional hard filter. Your capital ({formatUSD(capital)}) still drives Solo / JV tags.
          Slide to max for Any.
        </p>
      </div>
    </aside>
  );
}
