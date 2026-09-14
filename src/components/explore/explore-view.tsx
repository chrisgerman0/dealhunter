"use client";

import { FilterPanel } from "@/components/deals/filter-panel";
import { DealList } from "@/components/deals/deal-list";
import { DealMap } from "@/components/map/deal-map";
import { useFilteredDeals } from "@/hooks/useFilteredDeals";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List, Map as MapIcon, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function ExploreView() {
  const deals = useFilteredDeals();
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list");

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      <div className="hidden w-72 shrink-0 overflow-hidden lg:block">
        <FilterPanel />
      </div>

      <div className="flex items-center justify-between gap-2 border-b p-2 lg:hidden">
        <Sheet>
          <SheetTrigger className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted">
            <SlidersHorizontal className="size-4" />
            Filters
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto p-0 sm:max-w-[300px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FilterPanel />
          </SheetContent>
        </Sheet>
        <p className="text-sm text-muted-foreground">{deals.length} deals</p>
        <div className="flex rounded-lg border p-0.5">
          <Button
            size="sm"
            variant={mobileTab === "list" ? "default" : "ghost"}
            onClick={() => setMobileTab("list")}
          >
            <List className="size-4" />
          </Button>
          <Button
            size="sm"
            variant={mobileTab === "map" ? "default" : "ghost"}
            onClick={() => setMobileTab("map")}
          >
            <MapIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className={`min-h-0 flex-1 border-r ${
          mobileTab === "list" ? "block" : "hidden"
        } lg:block lg:max-w-xl xl:max-w-2xl`}
      >
        <div className="hidden items-center justify-between border-b px-3 py-2 lg:flex">
          <h1 className="text-sm font-semibold">Explore deals</h1>
          <span className="text-xs text-muted-foreground">{deals.length} matches</span>
        </div>
        <div className="h-full lg:h-[calc(100%-41px)]">
          <DealList deals={deals} />
        </div>
      </div>

      <div className={`min-h-0 flex-1 ${mobileTab === "map" ? "block" : "hidden"} lg:block`}>
        <DealMap deals={deals} />
      </div>
    </div>
  );
}
