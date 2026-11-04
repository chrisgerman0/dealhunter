import { NextResponse } from "next/server";
import {
  getAllMirroredListings,
  getMirrorSearches,
  mirrorStoreInfo,
  statsFor,
} from "@/lib/mirror/store";
import { MIRROR_SOURCE_LABELS, type MirroredListing } from "@/lib/mirror/types";
import { proxyStatus } from "@/lib/scrape/transport";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * The mirrored listings, with the filters R2R actually needs.
 *
 * Query params, all optional:
 *   source=zillow|realtor
 *   includeDelisted=true          default false — delisted rows are hidden
 *   includeApartmentComplexes=true default false — see below
 *   market=tampa                  repeatable
 *   minBeds / maxRent             numbers
 *
 * WHY APARTMENT COMPLEXES ARE EXCLUDED BY DEFAULT
 * -----------------------------------------------
 * Chris's requirement is single-family homes and condos from private
 * landlords. An apartment-complex unit is not an R2R candidate at all: the
 * managed lease prohibits subletting, so the deal is dead before any number
 * is run. Measured on the real Zillow payload, the bare `/tampa-fl/rentals/`
 * URL is 41/41 apartment buildings — so defaulting this to "show them" would
 * mean the default view is 100% unusable stock.
 *
 * They are still mirrored and still returned on request, because excluding
 * them from the *store* would make the dedupe counters lie about what the
 * source returned.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams;

  const source = q.get("source");
  const includeDelisted = q.get("includeDelisted") === "true";
  const includeComplexes = q.get("includeApartmentComplexes") === "true";
  const markets = q.getAll("market").filter(Boolean);
  const minBeds = numParam(q.get("minBeds"));
  const maxRent = numParam(q.get("maxRent"));

  try {
    const all = await getAllMirroredListings();
    const searches = await getMirrorSearches();

    const filtered = all.filter((l) => {
      if (!includeDelisted && l.delistedAt) return false;
      if (!includeComplexes && l.isApartmentComplex) return false;
      if (source && l.source !== source) return false;
      if (markets.length > 0 && (!l.market || !markets.includes(l.market))) return false;
      if (minBeds != null && (l.beds == null || l.beds < minBeds)) return false;
      if (maxRent != null && (l.rent == null || l.rent > maxRent)) return false;
      return true;
    });

    // Newest first — a run's new rows should be at the top of the table.
    filtered.sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));

    return NextResponse.json({
      listings: filtered,
      stats: statsFor(all),
      /** Breakdown of what the filters removed, so a short table is explainable. */
      excluded: {
        apartmentComplexes: includeComplexes ? 0 : all.filter((l) => l.isApartmentComplex).length,
        delisted: includeDelisted ? 0 : all.filter((l) => l.delistedAt).length,
      },
      searches,
      store: mirrorStoreInfo(),
      proxy: proxyStatus(),
      sourceLabels: MIRROR_SOURCE_LABELS,
      dataAge: dataAge(all),
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read the mirror." },
      { status: 502 }
    );
  }
}

function numParam(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Data age, per the brief's "never silently serves old rows as current".
 *
 * `stalestHours` is the honest headline: the oldest active row's last sighting.
 * A single number cannot describe a mirror built from several searches at
 * different times, so the per-search `lastRefreshedAt` is returned alongside
 * it rather than averaged into something meaningless.
 */
function dataAge(listings: MirroredListing[]): {
  stalestHours: number | null;
  freshestHours: number | null;
  stale: boolean;
  note: string;
} {
  const active = listings.filter((l) => !l.delistedAt);
  if (active.length === 0) {
    return {
      stalestHours: null,
      freshestHours: null,
      stale: false,
      note: "Mirror is empty — run a scrape to populate it.",
    };
  }
  const now = Date.now();
  const ages = active.map((l) => (now - new Date(l.lastSeenAt).getTime()) / 3_600_000);
  const stalest = Math.max(...ages);
  const freshest = Math.min(...ages);
  const stale = stalest > 24;
  return {
    stalestHours: Math.round(stalest * 10) / 10,
    freshestHours: Math.round(freshest * 10) / 10,
    stale,
    note: stale
      ? `Oldest mirrored listing was last seen ${Math.round(stalest)}h ago. Re-run the search before trusting these as current.`
      : `All mirrored listings seen within the last ${Math.max(1, Math.round(stalest))}h.`,
  };
}
