"use client";

import { useMemo } from "react";
import { assembleR2RDeal, assumptionsFromSettings } from "@/lib/r2r/assemble";
import { useDealStore } from "@/store/useDealStore";
import { useR2RSeeds } from "@/hooks/useR2RSeeds";
import { R2RComparisonTable } from "@/components/r2r/r2r-comparison-table";
import { R2RDealCard } from "@/components/r2r/r2r-deal-card";

/** Structural copy of `src/app/(hunter)/shortlist/page.tsx`. */
export default function R2RShortlistPage() {
  const shortlisted = useDealStore((s) => s.shortlisted);
  const settings = useDealStore((s) => s.r2rSettings);
  const { data, loading, error } = useR2RSeeds();

  const deals = useMemo(() => {
    if (!data) return [];
    const assumptions = assumptionsFromSettings(settings);
    return data.seeds
      .map((seed) => assembleR2RDeal(seed, assumptions))
      .filter((d) => shortlisted.includes(d.id));
  }, [data, settings, shortlisted]);

  return (
    <div className="space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Shortlist</h1>
        <p className="text-sm text-muted-foreground">
          Compare all shortlisted R2R deals side-by-side. Persisted in your browser, separately
          from BMV.
        </p>
        {loading && <p className="mt-1 text-xs text-muted-foreground">Loading live listings…</p>}
        {error && <p className="mt-1 text-xs text-red-700">Live feed failed to load — {error}</p>}
        {data && (
          <p className="mt-1 text-xs text-muted-foreground">
            {data.source === "rentcast"
              ? "Live RentCast listings — real units."
              : data.source === "mirror"
                ? "Mirrored Zillow / Realtor listings"
                : data.source === "apartmentguide"
                ? "Live ApartmentGuide listings — real units, scraped without an API key."
                : data.source === "mock"
                  ? "Sample data — both live sources came back empty."
                  : "Data source not reported by the feed — treat these figures as unverified."}
          </p>
        )}
      </div>

      <R2RComparisonTable deals={deals} />

      {deals.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-medium">Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((d) => (
              <R2RDealCard key={d.id} deal={d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
