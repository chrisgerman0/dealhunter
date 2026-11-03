"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings, City, DealQuality, Tenure } from "@/types/deal";
import type {
  FloridaMarket,
  GeoMatch,
  R2RFilters,
  R2RSettings,
  SeasonalityModel,
  UnitType,
} from "@/types/r2r";
import type { AppMode } from "@/lib/modes";

export type { AppMode };

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

/**
 * Everything that is per-mode and persisted. Each mode owns a completely
 * separate copy — nothing is shared between BMV and R2R.
 *
 * BMV and R2R model different things in different currencies, so they do not
 * share a settings or filter shape. `settings`/`filters` stay sterling-BMV and
 * are read only by BMV surfaces; `r2rSettings`/`r2rFilters` are dollar-Florida
 * and are read only by R2R surfaces. Both live on every slice so switching mode
 * is still a single object swap, and neither can be coerced into the other.
 */
export interface ModeState {
  shortlisted: string[];
  dismissed: string[];
  snoozed: SnoozeEntry[];
  settings: AppSettings;
  filters: Filters;
  r2rSettings: R2RSettings;
  r2rFilters: R2RFilters;
  compareIds: string[];
}

interface DealStore extends ModeState {
  /** Active experience. Kept in step with the URL by the header. */
  mode: AppMode;
  /** Per-mode persisted slices. `modes[mode]` is the inactive mirror of the live slice. */
  modes: Record<AppMode, ModeState>;
  /** Ephemeral — never persisted. */
  selectedDealId: string | null;

  setMode: (mode: AppMode) => void;
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
  setR2RSettings: (partial: Partial<R2RSettings>) => void;
  setR2RFilters: (partial: Partial<R2RFilters>) => void;
  resetR2RFilters: () => void;
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
  maxCashIn: null, // null = no cash-in cap; capital still drives JV tags
  freeholdOnly: true,
};

/**
 * The BMV slice's own copy of the sterling settings, with the plainly
 * UK-specific values cleared so a fresh R2R slice never inherits
 * Liverpool/Manchester. R2R surfaces do not read these — see
 * `defaultR2RAppSettings` below — but every slice carries both shapes.
 */
const defaultBmvSettingsForR2R: AppSettings = {
  ...defaultSettings,
  defaultCities: [],
  freeholdOnly: false,
};

const defaultBmvFiltersForR2R: Filters = {
  ...defaultFilters,
  cities: [],
  tenure: "any",
  freeholdOnly: false,
};

/**
 * Florida R2R defaults, USD.
 *
 * Kept in step with `DEFAULT_R2R_ASSUMPTIONS` in `src/lib/r2r/assemble.ts` and
 * with the `good` gate in `src/lib/r2r/thresholds.ts` (25% ROI, $600/mo), so a
 * user who never opens Settings sees the same verdicts the engine documents.
 */
const defaultR2RAppSettings: R2RSettings = {
  capital: 60000,
  targetMarkets: [
    "kissimmee",
    "tampa",
    "broward",
    "clearwater-stpete",
    "destin",
    "panama-city-beach",
  ],
  maxMonthlyRent: 4000,
  furnishingBudgetPerBedroom: 3800,
  targetRoiPct: 25,
  minNetMonthlyProfit: 600,
  managementFeePct: 0,
  cleaningFeePerTurnover: 145,
  assumedOccupancyPct: 65,
  seasonalityModel: "florida_snowbird",
  compRadiusDefault: "radius_500m",
  contingencyPct: 12,
};

/**
 * `markets: []` and `unitTypes: []` mean "all", not "none".
 *
 * Same reasoning as BMV's `filters.cities`: a stale saved market list would
 * silently hide deals, and the only control that could clear it is the one the
 * user cannot see from Explore. Reset applies the Settings defaults explicitly.
 *
 * `hideRegulatoryKills` is on because an STR-illegal address is not a deal.
 */
const defaultR2RDealFilters: R2RFilters = {
  query: "",
  markets: [],
  minRent: 1000,
  maxRent: 6000,
  minBeds: 2,
  maxBeds: 6,
  unitTypes: [],
  qualities: ["excellent", "good", "marginal"],
  maxCashToStart: null,
  minNetProfit: 0,
  minRoiPct: 0,
  poolOnly: false,
  hideRegulatoryKills: true,
};

function emptyModeState(
  settings: AppSettings,
  filters: Filters,
  r2rSettings: R2RSettings,
  r2rFilters: R2RFilters
): ModeState {
  return {
    shortlisted: [],
    dismissed: [],
    snoozed: [],
    settings,
    filters,
    r2rSettings,
    r2rFilters,
    compareIds: [],
  };
}

function defaultModeState(mode: AppMode): ModeState {
  return mode === "r2r"
    ? emptyModeState(
        defaultBmvSettingsForR2R,
        defaultBmvFiltersForR2R,
        defaultR2RAppSettings,
        defaultR2RDealFilters
      )
    : emptyModeState(
        defaultSettings,
        defaultFilters,
        defaultR2RAppSettings,
        defaultR2RDealFilters
      );
}

function defaultModes(): Record<AppMode, ModeState> {
  return { bmv: defaultModeState("bmv"), r2r: defaultModeState("r2r") };
}

/* ------------------------------------------------------------------ *
 * Defensive coercion of persisted state.
 *
 * localStorage is user-writable and survives across deploys, so nothing
 * read out of it is trusted. Every helper below is total: it accepts
 * `unknown` and always returns a valid value, falling back to the
 * supplied default. Running these twice is a no-op.
 * ------------------------------------------------------------------ */

const CITIES: readonly City[] = ["liverpool", "manchester"];
const QUALITIES: readonly DealQuality[] = ["excellent", "good", "marginal"];
const TENURES: readonly (Tenure | "any")[] = ["freehold", "leasehold", "any"];

/** Kept in sync with `FloridaMarket` in `src/types/r2r.ts`. */
const FLORIDA_MARKET_IDS: readonly FloridaMarket[] = [
  "kissimmee",
  "tampa",
  "broward",
  "clearwater-stpete",
  "destin",
  "panama-city-beach",
  "miami-beach",
  "orlando-city",
  "key-west",
  "naples",
];
const UNIT_TYPE_IDS: readonly UnitType[] = [
  "single_family",
  "condo",
  "townhouse",
  "duplex",
  "apartment",
];
const SEASONALITY_MODELS: readonly SeasonalityModel[] = [
  "florida_snowbird",
  "beach_summer",
  "flat",
];
const GEO_MATCHES: readonly GeoMatch[] = [
  "same_street",
  "radius_250m",
  "radius_500m",
  "radius_1km",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asNullableNumber(value: unknown, fallback: number | null): number | null {
  if (value === null) return null;
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const entry of value) {
    if (typeof entry === "string" && entry.length > 0 && !out.includes(entry)) out.push(entry);
  }
  return out;
}

function asEnumList<T extends string>(value: unknown, allowed: readonly T[], fallback: T[]): T[] {
  if (!Array.isArray(value)) return [...fallback];
  const out: T[] = [];
  for (const entry of value) {
    if (typeof entry === "string" && (allowed as readonly string[]).includes(entry)) {
      const typed = entry as T;
      if (!out.includes(typed)) out.push(typed);
    }
  }
  return out;
}

function asSnoozeList(value: unknown): SnoozeEntry[] {
  if (!Array.isArray(value)) return [];
  const out: SnoozeEntry[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    const { id, until } = entry;
    if (typeof id !== "string" || id.length === 0) continue;
    if (typeof until !== "number" || !Number.isFinite(until)) continue;
    if (out.some((e) => e.id === id)) continue;
    out.push({ id, until });
  }
  return out;
}

function asSettings(value: unknown, fallback: AppSettings): AppSettings {
  if (!isRecord(value)) return { ...fallback };
  return {
    capital: asNumber(value.capital, fallback.capital),
    defaultCities: asEnumList(value.defaultCities, CITIES, fallback.defaultCities),
    freeholdOnly: asBoolean(value.freeholdOnly, fallback.freeholdOnly),
    minPrice: asNumber(value.minPrice, fallback.minPrice),
    maxPrice: asNumber(value.maxPrice, fallback.maxPrice),
    bridgeMonths: asNumber(value.bridgeMonths, fallback.bridgeMonths),
    bridgeRateMonthly: asNumber(value.bridgeRateMonthly, fallback.bridgeRateMonthly),
    refinanceLtv: asNumber(value.refinanceLtv, fallback.refinanceLtv),
    contingencyPct: asNumber(value.contingencyPct, fallback.contingencyPct),
  };
}

function asFilters(value: unknown, fallback: Filters): Filters {
  if (!isRecord(value)) return { ...fallback };
  const tenure = asString(value.tenure, fallback.tenure);
  return {
    query: asString(value.query, fallback.query),
    cities: asEnumList(value.cities, CITIES, fallback.cities),
    areas: asIdList(value.areas),
    minPrice: asNumber(value.minPrice, fallback.minPrice),
    maxPrice: asNumber(value.maxPrice, fallback.maxPrice),
    minBeds: asNumber(value.minBeds, fallback.minBeds),
    maxBeds: asNumber(value.maxBeds, fallback.maxBeds),
    tenure: (TENURES as readonly string[]).includes(tenure)
      ? (tenure as Tenure | "any")
      : fallback.tenure,
    qualities: asEnumList(value.qualities, QUALITIES, fallback.qualities),
    maxCashIn: asNullableNumber(value.maxCashIn, fallback.maxCashIn),
    freeholdOnly: asBoolean(value.freeholdOnly, fallback.freeholdOnly),
  };
}

function asEnumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function asR2RSettings(value: unknown, fallback: R2RSettings): R2RSettings {
  if (!isRecord(value)) return { ...fallback };
  return {
    capital: asNumber(value.capital, fallback.capital),
    targetMarkets: asEnumList(value.targetMarkets, FLORIDA_MARKET_IDS, fallback.targetMarkets),
    maxMonthlyRent: asNumber(value.maxMonthlyRent, fallback.maxMonthlyRent),
    furnishingBudgetPerBedroom: asNumber(
      value.furnishingBudgetPerBedroom,
      fallback.furnishingBudgetPerBedroom
    ),
    targetRoiPct: asNumber(value.targetRoiPct, fallback.targetRoiPct),
    minNetMonthlyProfit: asNumber(value.minNetMonthlyProfit, fallback.minNetMonthlyProfit),
    managementFeePct: asNumber(value.managementFeePct, fallback.managementFeePct),
    cleaningFeePerTurnover: asNumber(
      value.cleaningFeePerTurnover,
      fallback.cleaningFeePerTurnover
    ),
    assumedOccupancyPct: asNumber(value.assumedOccupancyPct, fallback.assumedOccupancyPct),
    seasonalityModel: asEnumValue(
      value.seasonalityModel,
      SEASONALITY_MODELS,
      fallback.seasonalityModel
    ),
    compRadiusDefault: asEnumValue(value.compRadiusDefault, GEO_MATCHES, fallback.compRadiusDefault),
    contingencyPct: asNumber(value.contingencyPct, fallback.contingencyPct),
  };
}

function asR2RFilters(value: unknown, fallback: R2RFilters): R2RFilters {
  if (!isRecord(value)) return { ...fallback };
  return {
    query: asString(value.query, fallback.query),
    // An absent list is "all", so the fallback for these is `[]`, not the
    // default selection — otherwise a user who cleared every market would
    // find them all ticked again on the next page load.
    markets: asEnumList(value.markets, FLORIDA_MARKET_IDS, []),
    minRent: asNumber(value.minRent, fallback.minRent),
    maxRent: asNumber(value.maxRent, fallback.maxRent),
    minBeds: asNumber(value.minBeds, fallback.minBeds),
    maxBeds: asNumber(value.maxBeds, fallback.maxBeds),
    unitTypes: asEnumList(value.unitTypes, UNIT_TYPE_IDS, []),
    qualities: asEnumList(value.qualities, QUALITIES, fallback.qualities),
    maxCashToStart: asNullableNumber(value.maxCashToStart, fallback.maxCashToStart),
    minNetProfit: asNumber(value.minNetProfit, fallback.minNetProfit),
    minRoiPct: asNumber(value.minRoiPct, fallback.minRoiPct),
    poolOnly: asBoolean(value.poolOnly, fallback.poolOnly),
    hideRegulatoryKills: asBoolean(value.hideRegulatoryKills, fallback.hideRegulatoryKills),
  };
}

function asModeState(value: unknown, mode: AppMode): ModeState {
  const fallback = defaultModeState(mode);
  if (!isRecord(value)) return fallback;
  return {
    shortlisted: asIdList(value.shortlisted),
    dismissed: asIdList(value.dismissed),
    snoozed: asSnoozeList(value.snoozed),
    settings: asSettings(value.settings, fallback.settings),
    filters: asFilters(value.filters, fallback.filters),
    r2rSettings: asR2RSettings(value.r2rSettings, fallback.r2rSettings),
    r2rFilters: asR2RFilters(value.r2rFilters, fallback.r2rFilters),
    compareIds: asIdList(value.compareIds),
  };
}

function asMode(value: unknown): AppMode {
  return value === "r2r" ? "r2r" : "bmv";
}

export interface PersistedShape {
  mode: AppMode;
  modes: Record<AppMode, ModeState>;
}

/**
 * Accepts anything that might be sitting in localStorage — the current
 * shape, the pre-mode flat shape, a half-written object, or junk — and
 * returns a valid `PersistedShape`.
 */
export function normalizePersisted(persisted: unknown): PersistedShape {
  if (!isRecord(persisted)) {
    return { mode: "bmv", modes: defaultModes() };
  }

  // Current (mode-keyed) shape.
  if (isRecord(persisted.modes)) {
    const raw = persisted.modes;
    return {
      mode: asMode(persisted.mode),
      modes: {
        bmv: asModeState(raw.bmv, "bmv"),
        r2r: asModeState(raw.r2r, "r2r"),
      },
    };
  }

  // Legacy flat shape (store versions 1 and 2): one unnamespaced slice,
  // which was always the BMV experience. Carry it over verbatim so Chris
  // keeps his shortlist / dismissed / snoozed IDs and settings.
  return {
    mode: "bmv",
    modes: {
      bmv: asModeState(persisted, "bmv"),
      r2r: defaultModeState("r2r"),
    },
  };
}

function liveSlice(state: DealStore): ModeState {
  return {
    shortlisted: state.shortlisted,
    dismissed: state.dismissed,
    snoozed: state.snoozed,
    settings: state.settings,
    filters: state.filters,
    r2rSettings: state.r2rSettings,
    r2rFilters: state.r2rFilters,
    compareIds: state.compareIds,
  };
}

/** `modes` with the live slice folded back into the active mode. */
function foldedModes(state: DealStore): Record<AppMode, ModeState> {
  return { ...state.modes, [state.mode]: liveSlice(state) };
}

export const useDealStore = create<DealStore>()(
  persist(
    (set, get) => ({
      mode: "bmv",
      modes: defaultModes(),
      ...defaultModeState("bmv"),
      selectedDealId: null,

      setMode: (mode) =>
        set((s) => {
          if (s.mode === mode) return s;
          const modes = foldedModes(s);
          return {
            mode,
            modes,
            ...modes[mode],
            selectedDealId: null,
          };
        }),

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
        const { settings, mode } = get();
        set({
          filters: {
            ...defaultModeState(mode).filters,
            cities: settings.defaultCities,
            minPrice: settings.minPrice,
            maxPrice: settings.maxPrice,
            maxCashIn: null,
            freeholdOnly: settings.freeholdOnly,
            tenure: settings.freeholdOnly ? "freehold" : "any",
          },
        });
      },

      /**
       * `maxMonthlyRent` is mirrored into the live filter the way BMV mirrors
       * `maxPrice` — it is a number, so a stale value is visible on the slider.
       * `targetMarkets` is deliberately NOT mirrored: it is a set, and a set
       * pushed into the filter rail silently hides deals. Reset applies it.
       */
      setR2RSettings: (partial) =>
        set((s) => {
          const r2rSettings = { ...s.r2rSettings, ...partial };
          const r2rFilters = {
            ...s.r2rFilters,
            ...(partial.maxMonthlyRent != null ? { maxRent: partial.maxMonthlyRent } : {}),
          };
          return { r2rSettings, r2rFilters };
        }),

      setR2RFilters: (partial) =>
        set((s) => ({ r2rFilters: { ...s.r2rFilters, ...partial } })),

      resetR2RFilters: () => {
        const { r2rSettings, mode } = get();
        set({
          r2rFilters: {
            ...defaultModeState(mode).r2rFilters,
            markets: r2rSettings.targetMarkets,
            maxRent: r2rSettings.maxMonthlyRent,
            minNetProfit: r2rSettings.minNetMonthlyProfit,
            minRoiPct: r2rSettings.targetRoiPct,
            maxCashToStart: null,
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
      version: 4,
      /**
       * v1 → v2: the old £50k `maxCashIn` default hid almost every BRRR deal.
       * v2 → v3: flat single-experience state becomes mode-keyed.
       * v3 → v4: each slice gains its own `r2rSettings` / `r2rFilters`. No
       *   rewriting needed — `asModeState` fills them from the defaults — but
       *   the bump makes the shape change explicit rather than silent.
       */
      migrate: (persisted: unknown, version: number) => {
        if (version < 2 && isRecord(persisted) && isRecord(persisted.filters)) {
          const maxCashIn = persisted.filters.maxCashIn;
          if (typeof maxCashIn === "number" && maxCashIn <= 60000) {
            persisted.filters.maxCashIn = null;
          }
        }
        return normalizePersisted(persisted) as never;
      },
      /**
       * Runs on every hydration, including when the stored version already
       * matches and `migrate` is skipped — so this is the one place that is
       * guaranteed to see untrusted input. Normalise here, then lift the
       * active mode's slice into the live fields.
       */
      merge: (persisted, current) => {
        const { mode, modes } = normalizePersisted(persisted);
        return { ...current, mode, modes, ...modes[mode], selectedDealId: null };
      },
      // Only `mode` + `modes` hit localStorage. The live slice is never
      // persisted separately, so there is exactly one source of truth on disk.
      partialize: (s) =>
        ({ mode: s.mode, modes: foldedModes(s) }) as unknown as DealStore,
    }
  )
);
