"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useDealStore } from "@/store/useDealStore";
import { formatGBP } from "@/lib/format";
import type { City, DealQuality } from "@/types/deal";

const AREAS = {
  liverpool: ["L4", "L5", "L6", "L7", "L8", "L15"],
  manchester: ["M13", "M19", "M11", "M8", "M14"],
};

const QUALITIES: DealQuality[] = ["excellent", "good", "marginal"];

export function FilterPanel() {
  const filters = useDealStore((s) => s.filters);
  const setFilters = useDealStore((s) => s.setFilters);
  const resetFilters = useDealStore((s) => s.resetFilters);
  const capital = useDealStore((s) => s.settings.capital);

  const toggleCity = (city: City) => {
    const cities = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city];
    setFilters({ cities });
  };

  const toggleArea = (area: string) => {
    const areas = filters.areas.includes(area)
      ? filters.areas.filter((a) => a !== area)
      : [...filters.areas, area];
    setFilters({ areas });
  };

  const toggleQuality = (q: DealQuality) => {
    const qualities = filters.qualities.includes(q)
      ? filters.qualities.filter((x) => x !== q)
      : [...filters.qualities, q];
    setFilters({ qualities });
  };

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
          placeholder="Search address or postcode…"
          value={filters.query}
          onChange={(e) => setFilters({ query: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Cities</Label>
        <div className="flex flex-col gap-2">
          {(["liverpool", "manchester"] as City[]).map((city) => (
            <label key={city} className="flex items-center gap-2 text-sm capitalize">
              <Checkbox
                checked={filters.cities.includes(city)}
                onCheckedChange={() => toggleCity(city)}
              />
              {city}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Postcode areas</Label>
        <div className="space-y-2">
          {Object.entries(AREAS).map(([city, codes]) => (
            <div key={city}>
              <p className="mb-1 text-[11px] capitalize text-muted-foreground">{city}</p>
              <div className="flex flex-wrap gap-1.5">
                {codes.map((code) => {
                  const active = filters.areas.includes(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleArea(code)}
                      className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
                        active
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                          : "hover:bg-muted"
                      }`}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Price</Label>
          <span className="text-xs font-medium">
            {formatGBP(filters.minPrice, true)} – {formatGBP(filters.maxPrice, true)}
          </span>
        </div>
        <Slider
          min={70000}
          max={200000}
          step={5000}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={(v) => {
            const val = v as number[];
            if (val.length >= 2) setFilters({ minPrice: val[0], maxPrice: val[1] });
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
          min={2}
          max={4}
          step={1}
          value={[filters.minBeds, filters.maxBeds]}
          onValueChange={(v) => {
            const val = v as number[];
            if (val.length >= 2) setFilters({ minBeds: val[0], maxBeds: val[1] });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Tenure</Label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={filters.freeholdOnly}
            onCheckedChange={(checked) =>
              setFilters({
                freeholdOnly: !!checked,
                tenure: checked ? "freehold" : "any",
              })
            }
          />
          Freehold only
        </label>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Deal quality</Label>
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
            Max cash-in
          </Label>
          <span className="text-xs font-medium">
            {filters.maxCashIn != null ? formatGBP(filters.maxCashIn, true) : "Any"}
          </span>
        </div>
        <Slider
          min={10000}
          max={Math.max(capital * 2, 100000)}
          step={2500}
          value={[filters.maxCashIn ?? capital]}
          onValueChange={(v) => {
            const val = v as number[];
            setFilters({ maxCashIn: val[0] });
          }}
        />
        <p className="text-[11px] text-muted-foreground">
          Based on your capital setting ({formatGBP(capital)}). Deals above this are tagged JV.
        </p>
      </div>
    </aside>
  );
}
