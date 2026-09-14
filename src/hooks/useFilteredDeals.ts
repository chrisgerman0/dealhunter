"use client";

import { useMemo } from "react";
import { getAllDeals } from "@/data/mock-properties";
import { useDealStore } from "@/store/useDealStore";
import { capitalTagFromCashIn } from "@/lib/format";
import type { Deal } from "@/types/deal";

export function useFilteredDeals(): Deal[] {
  const filters = useDealStore((s) => s.filters);
  const settings = useDealStore((s) => s.settings);
  const dismissed = useDealStore((s) => s.dismissed);
  const snoozed = useDealStore((s) => s.snoozed);

  return useMemo(() => {
    const now = Date.now();
    let deals = getAllDeals().map((d) => ({
      ...d,
      capitalTag: capitalTagFromCashIn(d.cashInBase, settings.capital),
    }));

    deals = deals.filter((d) => !dismissed.includes(d.id));
    deals = deals.filter((d) => {
      const entry = snoozed.find((e) => e.id === d.id);
      if (!entry) return true;
      return entry.until < now;
    });

    if (filters.cities.length) {
      deals = deals.filter((d) => filters.cities.includes(d.city));
    }
    if (filters.areas.length) {
      deals = deals.filter((d) => filters.areas.includes(d.area));
    }
    deals = deals.filter((d) => d.price >= filters.minPrice && d.price <= filters.maxPrice);
    deals = deals.filter((d) => d.beds >= filters.minBeds && d.beds <= filters.maxBeds);
    if (filters.freeholdOnly || filters.tenure === "freehold") {
      deals = deals.filter((d) => d.tenure === "freehold");
    } else if (filters.tenure === "leasehold") {
      deals = deals.filter((d) => d.tenure === "leasehold");
    }
    if (filters.qualities.length) {
      deals = deals.filter((d) => filters.qualities.includes(d.quality));
    }
    if (filters.maxCashIn != null) {
      deals = deals.filter((d) => d.cashInBase <= filters.maxCashIn!);
    }
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      deals = deals.filter(
        (d) =>
          d.address.toLowerCase().includes(q) ||
          d.postcode.toLowerCase().includes(q) ||
          d.area.toLowerCase().includes(q)
      );
    }

    deals.sort((a, b) => {
      const order = { excellent: 0, good: 1, marginal: 2 };
      const qo = order[a.quality] - order[b.quality];
      if (qo !== 0) return qo;
      return a.capitalStuck - b.capitalStuck;
    });

    return deals;
  }, [filters, settings.capital, dismissed, snoozed]);
}
