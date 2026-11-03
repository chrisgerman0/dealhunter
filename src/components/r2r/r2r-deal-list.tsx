"use client";

import { R2RDealCard } from "./r2r-deal-card";
import type { R2RDeal } from "@/types/r2r";
import { useDealStore } from "@/store/useDealStore";
import { ScrollArea } from "@/components/ui/scroll-area";

/** Structural copy of `src/components/deals/deal-list.tsx`. */
export function R2RDealList({ deals }: { deals: R2RDeal[] }) {
  const selectedDealId = useDealStore((s) => s.selectedDealId);
  const setSelectedDealId = useDealStore((s) => s.setSelectedDealId);

  if (deals.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="font-medium">No deals match your filters</p>
        <p className="text-sm text-muted-foreground">
          Try widening rent, cash-to-start, or quality filters.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {deals.map((deal) => (
          <R2RDealCard
            key={deal.id}
            deal={deal}
            selected={selectedDealId === deal.id}
            onSelect={() => setSelectedDealId(deal.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
