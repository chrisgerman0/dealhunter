"use client";

import { useMemo } from "react";
import { assembleR2RDeal, assumptionsFromSettings } from "@/lib/r2r/assemble";
import { useDealStore } from "@/store/useDealStore";
import { useR2RSeeds } from "./useR2RSeeds";
import type { R2RDeal, R2RSeedSource } from "@/types/r2r";

export interface FilteredR2RDeals {
  deals: R2RDeal[];
  loading: boolean;
  error: string | null;
  /**
   * `null` while loading. Once resolved, names the feed exactly — see
   * `R2RSeedSource`. `rentcast` and `apartmentguide` are real listings;
   * only `mock` is sample data.
   */
  source: R2RSeedSource | null;
  /** ISO timestamp the live data was fetched, or `null` for mock / not-yet-loaded. */
  dataAsOf: string | null;
  note: string;
}

/**
 * Structural copy of `src/hooks/useFilteredDeals.ts` for the Florida feed,
 * now fed by `/api/r2r/seeds` (live RentCast + live Airbnb comps, or the
 * mock catalogue) instead of the mock file directly. Dismissed and snoozed
 * are applied first, then the filter rail, then the sort — same order and
 * semantics as BMV.
 */
export function useFilteredR2RDeals(): FilteredR2RDeals {
  const filters = useDealStore((s) => s.r2rFilters);
  const settings = useDealStore((s) => s.r2rSettings);
  const dismissed = useDealStore((s) => s.dismissed);
  const snoozed = useDealStore((s) => s.snoozed);
  const { data, loading, error } = useR2RSeeds();

  const deals = useMemo(() => {
    if (!data) return [];
    const now = Date.now();
    const assumptions = assumptionsFromSettings(settings);
    let deals = data.seeds.map((seed) => assembleR2RDeal(seed, assumptions));

    deals = deals.filter((d) => !dismissed.includes(d.id));
    deals = deals.filter((d) => {
      const entry = snoozed.find((e) => e.id === d.id);
      if (!entry) return true;
      return entry.until < now;
    });

    // An STR-illegal address is not a deal. On by default, and the control that
    // turns it off is visible in the rail — so a hidden deal is never a mystery.
    if (filters.hideRegulatoryKills) {
      deals = deals.filter((d) => !d.regulatoryKill);
    }
    // Empty market / unit-type lists mean "all", matching the filter rail's
    // own copy. A stale saved list must not silently hide inventory.
    if (filters.markets.length) {
      deals = deals.filter((d) => filters.markets.includes(d.market));
    }
    if (filters.unitTypes.length) {
      deals = deals.filter((d) => filters.unitTypes.includes(d.unitType));
    }
    deals = deals.filter(
      (d) => d.monthlyRent >= filters.minRent && d.monthlyRent <= filters.maxRent
    );
    deals = deals.filter((d) => d.beds >= filters.minBeds && d.beds <= filters.maxBeds);
    if (filters.qualities.length) {
      deals = deals.filter((d) => filters.qualities.includes(d.quality));
    }
    if (filters.maxCashToStart != null) {
      deals = deals.filter((d) => d.cashToStart <= filters.maxCashToStart!);
    }
    if (filters.minNetProfit > 0) {
      deals = deals.filter((d) => d.netMonthlyProfit >= filters.minNetProfit);
    }
    if (filters.minRoiPct > 0) {
      deals = deals.filter((d) => d.cashOnCashRoi * 100 >= filters.minRoiPct);
    }
    if (filters.poolOnly) {
      deals = deals.filter((d) => d.layers.physical.pool);
    }
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      deals = deals.filter(
        (d) =>
          d.city.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q) ||
          d.zip.toLowerCase().includes(q) ||
          d.county.toLowerCase().includes(q)
      );
    }

    // Quality first, then the money. BMV ties on the least capital stuck; the
    // R2R equivalent of "stuck" is cash that has not come back yet, so the tie
    // goes to the faster payback.
    deals.sort((a, b) => {
      const order = { excellent: 0, good: 1, marginal: 2 };
      const qo = order[a.quality] - order[b.quality];
      if (qo !== 0) return qo;
      const pa = a.paybackMonths ?? Number.POSITIVE_INFINITY;
      const pb = b.paybackMonths ?? Number.POSITIVE_INFINITY;
      if (pa !== pb) return pa - pb;
      return b.cashOnCashRoi - a.cashOnCashRoi;
    });

    return deals;
  }, [data, filters, settings, dismissed, snoozed]);

  return {
    deals,
    loading,
    error,
    source: data?.source ?? null,
    dataAsOf: data?.dataAsOf ?? null,
    note: data?.note ?? "",
  };
}
