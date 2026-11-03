"use client";

import { useMemo } from "react";
import { getAllR2RDeals } from "@/data/mock-r2r-properties";
import { assumptionsFromSettings } from "@/lib/r2r/assemble";
import { useDealStore } from "@/store/useDealStore";
import type { R2RDeal } from "@/types/r2r";

/**
 * Structural copy of `src/hooks/useFilteredDeals.ts` for the Florida feed.
 *
 * Dismissed and snoozed are applied first, then the filter rail, then the sort,
 * in the same order and with the same semantics as BMV.
 */
export function useFilteredR2RDeals(): R2RDeal[] {
  const filters = useDealStore((s) => s.r2rFilters);
  const settings = useDealStore((s) => s.r2rSettings);
  const dismissed = useDealStore((s) => s.dismissed);
  const snoozed = useDealStore((s) => s.snoozed);

  return useMemo(() => {
    const now = Date.now();
    let deals = getAllR2RDeals(assumptionsFromSettings(settings));

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
  }, [filters, settings, dismissed, snoozed]);
}
