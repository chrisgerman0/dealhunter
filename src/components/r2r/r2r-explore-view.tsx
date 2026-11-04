"use client";

import { R2RFilterPanel } from "@/components/r2r/r2r-filter-panel";
import { R2RDealList } from "@/components/r2r/r2r-deal-list";
import { R2RDealMap } from "@/components/r2r/r2r-deal-map";
import { useFilteredR2RDeals } from "@/hooks/useFilteredR2RDeals";
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

function formatAge(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

/**
 * The one place that tells Chris whether he is looking at a real market or a
 * sample one. Never let a card grid alone make that claim — see the BMV
 * incident this build exists to avoid.
 */
function DataSourceBanner({
  loading,
  error,
  source,
  dataAsOf,
}: {
  loading: boolean;
  error: string | null;
  source: "rentcast" | "mock" | null;
  dataAsOf: string | null;
}) {
  if (loading) {
    return (
      <div className="border-b bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
        Loading live listings…
      </div>
    );
  }
  if (error) {
    return (
      <div className="border-b border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-800">
        Live feed failed to load — {error}
      </div>
    );
  }
  if (source === "rentcast") {
    const age = formatAge(dataAsOf);
    return (
      <div className="border-b border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-900">
        Live RentCast listings{age ? ` · fetched ${age}` : ""}
      </div>
    );
  }
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
      Live feed not connected — showing sample data. Set RENTCAST_API_KEY to go live.
    </div>
  );
}

/** Structural copy of `src/components/explore/explore-view.tsx`. */
export function R2RExploreView() {
  const { deals, loading, error, source, dataAsOf } = useFilteredR2RDeals();
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list");

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      <div className="hidden w-72 shrink-0 overflow-hidden lg:block">
        <R2RFilterPanel />
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
            <R2RFilterPanel />
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
        <DataSourceBanner loading={loading} error={error} source={source} dataAsOf={dataAsOf} />
        <div className="hidden items-center justify-between border-b px-3 py-2 lg:flex">
          <h1 className="text-sm font-semibold">Explore R2R deals</h1>
          <span className="text-xs text-muted-foreground">{deals.length} matches</span>
        </div>
        <div className="h-full lg:h-[calc(100%-41px)]">
          <R2RDealList deals={deals} />
        </div>
      </div>

      <div className={`min-h-0 flex-1 ${mobileTab === "map" ? "block" : "hidden"} lg:block`}>
        <R2RDealMap deals={deals} />
      </div>
    </div>
  );
}
