/**
 * The mirrored-listing record: what Deal Hunter keeps about a property it has
 * seen on Zillow or Realtor.com, independent of whether either site will
 * answer us right now.
 *
 * WHY A MIRROR AND NOT A PASS-THROUGH
 * -----------------------------------
 * `apartmentguide.ts` fetches on demand and caches 12h. That is fine for a
 * feed that always answers. Zillow does not always answer: it is behind
 * PerimeterX and the answer depends on which IP the request leaves from (see
 * `src/lib/scrape/zillow.ts` for the measurements). A mirror means a listing
 * seen once stays usable and, critically, stays *dated* — so the UI can say
 * "scraped 3 days ago" instead of implying it is live.
 *
 * THE LIFECYCLE, AND WHY `delisted` IS NOT A DELETE
 * -------------------------------------------------
 * A refresh that no longer returns a row is evidence the listing went away,
 * which is itself worth knowing — a unit that vanished in 4 days is a
 * different signal from one that has sat for 90. So a disappearance sets
 * `delistedAt` and is kept, never deleted. `lastSeenAt` is the last time the
 * source returned it; `lastRefreshedAt` is the last time we *asked* about the
 * search it belongs to. Those two differ exactly when a listing drops out,
 * which is the whole point of storing both.
 */
import type { Coords, UnitType } from "@/types/r2r";

/** Mirrored sources. Deliberately not the `LiveListingSource` union — these are scrapes with a run history, not feeds. */
export type MirrorSource = "zillow" | "realtor";

export const MIRROR_SOURCE_LABELS: Record<MirrorSource, string> = {
  zillow: "Zillow",
  realtor: "Realtor.com",
};

/**
 * Zillow's own `homeType` vocabulary, preserved verbatim alongside our mapped
 * `unitType`.
 *
 * Kept raw on purpose: R2R lives or dies on property type (an apartment
 * complex unit cannot be sublet), so the exact word the source used must stay
 * auditable rather than being flattened into our five-value `UnitType` and
 * lost. When Chris filters to "single-family + condo only", he is filtering
 * on something we can show him the source for.
 */
export interface MirroredListing {
  /** `${source}:${sourceListingId}` — the dedupe key, and the store's primary key. */
  key: string;
  source: MirrorSource;
  /** The source's own id: Zillow's `zpid`, Realtor's `property_id`. */
  sourceListingId: string;

  address: string;
  city: string;
  state: string;
  zip: string;
  coords: Coords | null;

  rent: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;

  /** Our five-value mapping, used by the R2R engine. */
  unitType: UnitType;
  /** The source's untranslated type string, e.g. "SINGLE_FAMILY", "CONDO". */
  rawHomeType: string | null;
  /**
   * True when the row is a whole apartment *building* rather than one
   * leasable unit. These are the rows R2R must be able to exclude: a managed
   * complex's lease bans subletting, so the deal is dead before underwriting.
   */
  isApartmentComplex: boolean;

  listingUrl: string;
  photos: string[];
  /** Listing agent / broker / management company, when the source names one. */
  agentName: string | null;
  /** Source-supplied badges, e.g. "Special offer", "3D Tour". Free text, never parsed for meaning. */
  tags: string[];

  /** Which pasted search URL produced this row, so a refresh knows what to re-ask. */
  searchUrl: string;
  /** Market this search was attributed to, when it maps to one of the ten. */
  market: string | null;

  firstSeenAt: string;
  lastSeenAt: string;
  /** Last time the owning search was re-run, seen or not. */
  lastRefreshedAt: string;
  /** Set when a refresh of its own search stopped returning it. Never deleted. */
  delistedAt: string | null;
  /** How many runs have returned this row. A cheap staleness/confidence signal. */
  seenCount: number;
}

/** What one search URL's refresh did, kept so the UI can show data age per search. */
export interface MirrorSearchRecord {
  searchUrl: string;
  source: MirrorSource;
  market: string | null;
  lastRefreshedAt: string;
  /** Rows the source returned on that refresh. */
  lastRowCount: number;
  /** Set when the last refresh failed, so "0 rows" never reads the same as "blocked". */
  lastError: string | null;
}

export interface MirrorStats {
  total: number;
  active: number;
  delisted: number;
  bySource: Record<string, number>;
  /** Oldest `lastSeenAt` among active rows — the honest "data age" figure. */
  oldestActiveSeenAt: string | null;
  newestSeenAt: string | null;
}
