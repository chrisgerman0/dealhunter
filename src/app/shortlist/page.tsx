"use client";

import { getAllDeals } from "@/data/mock-properties";
import { useDealStore } from "@/store/useDealStore";
import { ComparisonTable } from "@/components/shortlist/comparison-table";
import { capitalTagFromCashIn } from "@/lib/format";
import { DealCard } from "@/components/deals/deal-card";

export default function ShortlistPage() {
  const shortlisted = useDealStore((s) => s.shortlisted);
  const capital = useDealStore((s) => s.settings.capital);
  const deals = getAllDeals()
    .filter((d) => shortlisted.includes(d.id))
    .map((d) => ({ ...d, capitalTag: capitalTagFromCashIn(d.cashInBase, capital) }));

  return (
    <div className="space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Shortlist</h1>
        <p className="text-sm text-muted-foreground">
          Compare up to all shortlisted deals side-by-side. Persisted in your browser.
        </p>
      </div>

      <ComparisonTable deals={deals} />

      {deals.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-medium">Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
