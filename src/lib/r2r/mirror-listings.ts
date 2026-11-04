/**
 * Mirrored Zillow / Realtor listings → the R2R engine's listing shape.
 *
 * This is the seam that puts scraped stock through exactly the same
 * underwriting as every other source: `live-deals.ts` builds seeds from these
 * rows and the client runs them through `assembleR2RDeal()`, so they get
 * graded Excellent / Good / Marginal and killed by the same regulatory gates.
 * No second calculation path, which is the promise `live-deals.ts` already
 * makes for RentCast and ApartmentGuide.
 *
 * WHAT IS FILTERED OUT HERE, AND WHY IT IS HERE AND NOT IN THE STORE
 * ------------------------------------------------------------------
 * Three classes of mirrored row cannot be underwritten and are dropped on the
 * way in, each for a different reason:
 *
 *   - **Apartment-complex rows.** A managed building's lease bans subletting,
 *     so the R2R deal is dead regardless of the numbers. Measured: the bare
 *     `/tampa-fl/rentals/` Zillow URL is 41/41 of these.
 *   - **Rows with no rent.** Rent is the input the whole arbitrage is
 *     computed against. A seed with rent 0 would produce a spread that looks
 *     infinite.
 *   - **Rows with no market.** Market drives seasonality, comp radius,
 *     legality and hurricane exposure. Attributing a Sarasota listing to
 *     Tampa to make it fit would silently corrupt its grade.
 *
 * All three stay in the mirror — the store records what the source said, and
 * the counters in the scrape UI have to stay honest. The filtering belongs at
 * the point of underwriting, not at the point of capture.
 */
import type { FloridaMarket, PetPolicy } from "@/types/r2r";
import type { MirroredListing } from "@/lib/mirror/types";
import { getAllMirroredListings } from "@/lib/mirror/store";
import type { LiveRentalListing } from "./live-deals";
import { marketProfile } from "./markets";

export const MIRROR_SOURCE_ID = "mirror";
export const MIRROR_SOURCE_LABEL = "Zillow / Realtor mirror (live scrape)";

/** Why a mirrored row was not underwritten. Shown in `marketStatus`, never swallowed. */
export interface MirrorRejection {
  apartmentComplex: number;
  noRent: number;
  noMarket: number;
  delisted: number;
}

/**
 * Is this a property type Chris can actually run R2R on?
 *
 * Single-family and condo are the two he named. Townhouse and duplex are kept
 * because they are privately let in practice and the engine already models
 * them; `apartment` is not, for the sublet reason above.
 */
export function isR2RUsableType(l: MirroredListing): boolean {
  if (l.isApartmentComplex) return false;
  return l.unitType !== "apartment";
}

function mirroredToListing(l: MirroredListing, market: FloridaMarket): LiveRentalListing {
  const p = marketProfile(market);
  // Pet policy is not carried by either source's search payload. "unknown" is
  // the truthful value; the engine treats it as unverified rather than
  // assuming it is allowed.
  const petPolicy: PetPolicy = "unknown";

  return {
    id: l.sourceListingId,
    address: l.address,
    city: l.city || p.city,
    // Neither source carries county on the search row. From the market
    // profile, and the seed builder already labels it as such.
    county: p.county,
    zip: l.zip,
    rent: l.rent ?? 0,
    beds: l.beds ?? 0,
    baths: l.baths ?? 1,
    sqft: l.sqft ?? 0,
    unitType: l.unitType,
    yearBuilt: null,
    coords: l.coords,
    photos: l.photos,
    listingUrl: l.listingUrl,
    daysOnMarket: null,
    hoaMonthlyFee: null,
    petPolicy,
    pool: l.tags.some((t) => /pool/i.test(t)),
    propertyName: l.agentName ?? undefined,
    amenities: l.tags,
    updatedAt: l.lastSeenAt,
    // A mirrored row is an exact advertised rent for a specific unit, not a
    // floor-plan band — unlike ApartmentGuide. So this is never a "from" price.
    rentIsFromPrice: false,
  };
}

/**
 * Every underwritable mirrored listing for one market.
 *
 * Returns the rejection breakdown alongside the rows so `live-deals.ts` can
 * say "12 mirrored, 29 excluded as apartment complexes" rather than just
 * showing 12 and letting Chris wonder where the rest went.
 */
export async function fetchMirroredListingsForMarket(
  market: FloridaMarket
): Promise<{ listings: LiveRentalListing[]; rejections: MirrorRejection; totalForMarket: number }> {
  const all = await getAllMirroredListings();
  const rejections: MirrorRejection = {
    apartmentComplex: 0,
    noRent: 0,
    noMarket: 0,
    delisted: 0,
  };

  const forMarket = all.filter((l) => {
    if (l.market === market) return true;
    if (l.market == null) rejections.noMarket += 1;
    return false;
  });

  const usable = forMarket.filter((l) => {
    if (l.delistedAt) {
      rejections.delisted += 1;
      return false;
    }
    if (!isR2RUsableType(l)) {
      rejections.apartmentComplex += 1;
      return false;
    }
    if (!l.rent || l.rent <= 0) {
      rejections.noRent += 1;
      return false;
    }
    return true;
  });

  // Best arbitrage candidates first: more bedrooms drives ADR hardest, then
  // cheaper rent for the same bed count. Same ordering as the
  // ApartmentGuide adapter, deliberately.
  usable.sort((a, b) => (b.beds ?? 0) - (a.beds ?? 0) || (a.rent ?? 0) - (b.rent ?? 0));

  return {
    listings: usable.map((l) => mirroredToListing(l, market)),
    rejections,
    totalForMarket: forMarket.length,
  };
}

/** True when the mirror holds at least one underwritable row for any market. */
export async function hasMirroredStock(): Promise<boolean> {
  const all = await getAllMirroredListings();
  return all.some((l) => !l.delistedAt && l.market != null && isR2RUsableType(l) && (l.rent ?? 0) > 0);
}

/** A one-line summary of what the market's exclusions were, or null if there were none. */
export function describeRejections(r: MirrorRejection): string | null {
  const parts: string[] = [];
  if (r.apartmentComplex > 0) parts.push(`${r.apartmentComplex} apartment-complex unit(s) — leases ban subletting`);
  if (r.noRent > 0) parts.push(`${r.noRent} with no advertised rent`);
  if (r.delisted > 0) parts.push(`${r.delisted} delisted`);
  if (parts.length === 0) return null;
  return `Excluded ${parts.join(", ")}.`;
}
