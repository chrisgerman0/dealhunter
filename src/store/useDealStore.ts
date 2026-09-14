"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings, City, DealQuality, Tenure } from "@/types/deal";

export interface Filters {
  query: string;
  cities: City[];
  areas: string[];
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  maxBeds: number;
  tenure: Tenure | "any";
  qualities: DealQuality[];
  maxCashIn: number | null;
  freeholdOnly: boolean;
}

interface SnoozeEntry {
  id: string;
  until: number;
}

interface DealStore {
  shortlisted: string[];
  dismissed: string[];
  snoozed: SnoozeEntry[];
  settings: AppSettings;
  filters: Filters;
  selectedDealId: string | null;
  compareIds: string[];

  toggleShortlist: (id: string) => void;
  dismiss: (id: string) => void;
  undismiss: (id: string) => void;
  snooze: (id: string, days?: number) => void;
  clearSnooze: (id: string) => void;
  isSnoozed: (id: string) => boolean;
  isDismissed: (id: string) => boolean;
  isShortlisted: (id: string) => boolean;
  setSettings: (partial: Partial<AppSettings>) => void;
  setFilters: (partial: Partial<Filters>) => void;
  resetFilters: () => void;
  setSelectedDealId: (id: string | null) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
}

const defaultSettings: AppSettings = {
  capital: 50000,
  defaultCities: ["liverpool", "manchester"],
  freeholdOnly: true,
  minPrice: 70000,
  maxPrice: 200000,
  bridgeMonths: 9,
  bridgeRateMonthly: 0.01,
  refinanceLtv: 0.75,
  contingencyPct: 15,
};

const defaultFilters: Filters = {
  query: "",
  cities: ["liverpool", "manchester"],
  areas: [],
  minPrice: 70000,
  maxPrice: 200000,
  minBeds: 2,
  maxBeds: 4,
  tenure: "freehold",
  qualities: ["excellent", "good", "marginal"],
  maxCashIn: 50000,
  freeholdOnly: true,
};

export const useDealStore = create<DealStore>()(
  persist(
    (set, get) => ({
      shortlisted: [],
      dismissed: [],
      snoozed: [],
      settings: defaultSettings,
      filters: defaultFilters,
      selectedDealId: null,
      compareIds: [],

      toggleShortlist: (id) =>
        set((s) => ({
          shortlisted: s.shortlisted.includes(id)
            ? s.shortlisted.filter((x) => x !== id)
            : [...s.shortlisted, id],
          dismissed: s.dismissed.filter((x) => x !== id),
        })),

      dismiss: (id) =>
        set((s) => ({
          dismissed: s.dismissed.includes(id) ? s.dismissed : [...s.dismissed, id],
          shortlisted: s.shortlisted.filter((x) => x !== id),
          compareIds: s.compareIds.filter((x) => x !== id),
        })),

      undismiss: (id) =>
        set((s) => ({ dismissed: s.dismissed.filter((x) => x !== id) })),

      snooze: (id, days = 7) =>
        set((s) => ({
          snoozed: [
            ...s.snoozed.filter((e) => e.id !== id),
            { id, until: Date.now() + days * 24 * 60 * 60 * 1000 },
          ],
        })),

      clearSnooze: (id) =>
        set((s) => ({ snoozed: s.snoozed.filter((e) => e.id !== id) })),

      isSnoozed: (id) => {
        const entry = get().snoozed.find((e) => e.id === id);
        if (!entry) return false;
        if (entry.until < Date.now()) {
          get().clearSnooze(id);
          return false;
        }
        return true;
      },

      isDismissed: (id) => get().dismissed.includes(id),
      isShortlisted: (id) => get().shortlisted.includes(id),

      setSettings: (partial) =>
        set((s) => {
          const settings = { ...s.settings, ...partial };
          const filters = {
            ...s.filters,
            ...(partial.capital != null ? { maxCashIn: partial.capital } : {}),
            ...(partial.defaultCities ? { cities: partial.defaultCities } : {}),
            ...(partial.freeholdOnly != null
              ? {
                  freeholdOnly: partial.freeholdOnly,
                  tenure: partial.freeholdOnly ? ("freehold" as const) : ("any" as const),
                }
              : {}),
            ...(partial.minPrice != null ? { minPrice: partial.minPrice } : {}),
            ...(partial.maxPrice != null ? { maxPrice: partial.maxPrice } : {}),
          };
          return { settings, filters };
        }),

      setFilters: (partial) =>
        set((s) => ({ filters: { ...s.filters, ...partial } })),

      resetFilters: () => {
        const { settings } = get();
        set({
          filters: {
            ...defaultFilters,
            cities: settings.defaultCities,
            minPrice: settings.minPrice,
            maxPrice: settings.maxPrice,
            maxCashIn: settings.capital,
            freeholdOnly: settings.freeholdOnly,
            tenure: settings.freeholdOnly ? "freehold" : "any",
          },
        });
      },

      setSelectedDealId: (id) => set({ selectedDealId: id }),

      toggleCompare: (id) =>
        set((s) => {
          if (s.compareIds.includes(id)) {
            return { compareIds: s.compareIds.filter((x) => x !== id) };
          }
          if (s.compareIds.length >= 3) return s;
          return { compareIds: [...s.compareIds, id] };
        }),

      clearCompare: () => set({ compareIds: [] }),
    }),
    {
      name: "dealhunter-store",
      partialize: (s) => ({
        shortlisted: s.shortlisted,
        dismissed: s.dismissed,
        snoozed: s.snoozed,
        settings: s.settings,
        filters: s.filters,
        compareIds: s.compareIds,
      }),
    }
  )
);
