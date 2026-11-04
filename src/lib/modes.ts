/**
 * The two product experiences Deal Hunter runs.
 *
 * BMV is the original UK below-market-value purchase analysis. R2R is the
 * Florida rent-to-rent experience, currently scaffolded only.
 *
 * Lives here rather than in the store so server components (the R2R route
 * pages) can read mode metadata without pulling in zustand.
 */
export type AppMode = "bmv" | "r2r";

export const APP_MODES = ["bmv", "r2r"] as const;

export interface ModeMeta {
  id: AppMode;
  /** Switcher label. */
  label: string;
  /** Sub-brand line next to the logo. */
  subBrand: string;
  /** One-line description shown in the switcher dropdown. */
  description: string;
  /** URL prefix for this mode's routes. "" for BMV (it owns the root). */
  basePath: string;
}

export const MODE_META: Record<AppMode, ModeMeta> = {
  bmv: {
    id: "bmv",
    label: "BMV Deals",
    subBrand: "Liverpool & Manchester BMV",
    description: "Below-market-value purchases, bedroom conversion and BRRR refinance.",
    basePath: "",
  },
  r2r: {
    id: "r2r",
    label: "R2R Deals",
    subBrand: "Florida rent-to-rent",
    description: "Florida rent-to-rent — lease the unit, run it, keep the spread.",
    basePath: "/r2r",
  },
};

/** `/r2r/shortlist` → `"r2r"`; everything else → `"bmv"`. */
export function modeFromPathname(pathname: string): AppMode {
  return pathname === "/r2r" || pathname.startsWith("/r2r/") ? "r2r" : "bmv";
}

/**
 * Routable sections. `mirror` is R2R-only — see `MODE_ONLY_SECTIONS` in
 * `header.tsx`; `modePath` will happily build the BMV form of it, so the nav
 * is what gates visibility, not this type.
 */
export type ModeSection = "" | "shortlist" | "settings" | "deals" | "mirror";

/** Path for a section within a mode. `""` is that mode's explore page. */
export function modePath(mode: AppMode, section: ModeSection): string {
  const base = MODE_META[mode].basePath;
  if (!section) return base || "/";
  return `${base}/${section}`;
}
