"use client";

import { useDealStore } from "@/store/useDealStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatGBP } from "@/lib/format";
import type { City } from "@/types/deal";
import { toast } from "sonner";

export function SettingsForm() {
  const settings = useDealStore((s) => s.settings);
  const setSettings = useDealStore((s) => s.setSettings);
  const resetFilters = useDealStore((s) => s.resetFilters);

  const toggleCity = (city: City) => {
    const defaultCities = settings.defaultCities.includes(city)
      ? settings.defaultCities.filter((c) => c !== city)
      : [...settings.defaultCities, city];
    if (defaultCities.length === 0) return;
    setSettings({ defaultCities });
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Capital and defaults drive Explore filters and solo / JV tagging.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">Capital</h2>
        <div className="space-y-2">
          <Label htmlFor="capital">Available capital (£)</Label>
          <Input
            id="capital"
            type="number"
            min={5000}
            step={1000}
            value={settings.capital}
            onChange={(e) => setSettings({ capital: Number(e.target.value) || 0 })}
          />
          <p className="text-xs text-muted-foreground">
            Currently {formatGBP(settings.capital)}. Deals with cash-in ≤ capital are{" "}
            <strong>solo doable</strong>; up to 1.5× are <strong>JV recommended</strong>; above that{" "}
            <strong>JV required</strong>.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">Default search</h2>
        <div className="space-y-2">
          <Label>Cities</Label>
          {(["liverpool", "manchester"] as City[]).map((city) => (
            <label key={city} className="flex items-center gap-2 text-sm capitalize">
              <Checkbox
                checked={settings.defaultCities.includes(city)}
                onCheckedChange={() => toggleCity(city)}
              />
              {city}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={settings.freeholdOnly}
            onCheckedChange={(c) => setSettings({ freeholdOnly: !!c })}
          />
          Freehold only by default
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min price (£)</Label>
            <Input
              id="minPrice"
              type="number"
              value={settings.minPrice}
              onChange={(e) => setSettings({ minPrice: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max price (£)</Label>
            <Input
              id="maxPrice"
              type="number"
              value={settings.maxPrice}
              onChange={(e) => setSettings({ maxPrice: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border p-4">
        <h2 className="font-medium">Finance defaults (display)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bridgeMonths">Bridge term (months)</Label>
            <Input
              id="bridgeMonths"
              type="number"
              value={settings.bridgeMonths}
              onChange={(e) => setSettings({ bridgeMonths: Number(e.target.value) || 9 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bridgeRate">Bridge rate / month</Label>
            <Input
              id="bridgeRate"
              type="number"
              step="0.001"
              value={settings.bridgeRateMonthly}
              onChange={(e) => setSettings({ bridgeRateMonthly: Number(e.target.value) || 0.01 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ltv">Refinance LTV</Label>
            <Input
              id="ltv"
              type="number"
              step="0.01"
              value={settings.refinanceLtv}
              onChange={(e) => setSettings({ refinanceLtv: Number(e.target.value) || 0.75 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contingency">Contingency %</Label>
            <Input
              id="contingency"
              type="number"
              value={settings.contingencyPct}
              onChange={(e) => setSettings({ contingencyPct: Number(e.target.value) || 15 })}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Mock deal maths are pre-computed with SPV 70% LTV bridge @ 1%/mo for 9 months and 75% GDV
          refinance. Changing these settings updates labels and filters; full recalculation lands with
          live API integration.
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
        <Button
          variant="outline"
          onClick={() => toast.success("Settings saved locally")}
        >
          Saved automatically
        </Button>
      </div>
    </div>
  );
}
