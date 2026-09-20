import { getAllDeals, getDealById } from "@/data/mock-properties";
import { getLiveFloodData } from "@/lib/enrich/flood";
import { getLiveSoldComps } from "@/lib/enrich/comps";
import type {
  AirbnbComp,
  Comp,
  Coords,
  CrimeData,
  FloodData,
  Listing,
  ListingDetail,
  PlanningFlags,
  SearchParams,
} from "@/types/deal";
import type { PropertyDataSource } from "./types";

function toListing(d: ReturnType<typeof getAllDeals>[number]): Listing {
  return {
    id: d.id,
    address: d.address,
    postcode: d.postcode,
    price: d.price,
    beds: d.beds,
    sqft: d.sqft,
    photos: d.photos,
    coords: d.coords,
    city: d.city,
    tenure: d.tenure,
    propertyType: d.propertyType,
    listingUrl: d.listingUrl,
  };
}

export class MockPropertyDataSource implements PropertyDataSource {
  async searchListings(params: SearchParams): Promise<Listing[]> {
    let deals = getAllDeals();

    if (params.cities?.length) {
      deals = deals.filter((d) => params.cities!.includes(d.city));
    }
    if (params.postcodes?.length) {
      deals = deals.filter((d) =>
        params.postcodes!.some((p) => d.area === p || d.postcode.startsWith(p))
      );
    }
    if (params.minPrice != null) deals = deals.filter((d) => d.price >= params.minPrice!);
    if (params.maxPrice != null) deals = deals.filter((d) => d.price <= params.maxPrice!);
    if (params.minBeds != null) deals = deals.filter((d) => d.beds >= params.minBeds!);
    if (params.maxBeds != null) deals = deals.filter((d) => d.beds <= params.maxBeds!);
    if (params.tenure && params.tenure !== "any") {
      deals = deals.filter((d) => d.tenure === params.tenure);
    }
    if (params.minSqft != null) deals = deals.filter((d) => d.sqft >= params.minSqft!);
    if (params.maxSqft != null) deals = deals.filter((d) => d.sqft <= params.maxSqft!);
    if (params.qualities?.length) {
      deals = deals.filter((d) => params.qualities!.includes(d.quality));
    }
    if (params.maxCashIn != null) {
      deals = deals.filter((d) => d.cashInBase <= params.maxCashIn!);
    }
    if (params.query?.trim()) {
      const q = params.query.toLowerCase();
      deals = deals.filter(
        (d) =>
          d.address.toLowerCase().includes(q) ||
          d.postcode.toLowerCase().includes(q) ||
          d.area.toLowerCase().includes(q)
      );
    }

    return deals.map(toListing);
  }

  async getListingDetail(id: string): Promise<ListingDetail> {
    const d = getDealById(id);
    if (!d) throw new Error(`Listing not found: ${id}`);
    return {
      ...toListing(d),
      baths: d.baths,
      propertyType: d.propertyType,
      description: d.description,
      listingUrl: d.listingUrl,
      floorplanUrl: d.layers.physical.floorplanPresent ? undefined : undefined,
    };
  }

  async getSoldComps(postcode: string, beds: number): Promise<Comp[]> {
    try {
      const live = await getLiveSoldComps({ postcode, beds });
      if (live.comps.length > 0) return live.comps;
    } catch {
      // fall through to mock catalogue
    }
    const area = postcode.split(" ")[0];
    const deal = getAllDeals().find((d) => d.area === area && d.targetBeds === beds)
      ?? getAllDeals().find((d) => d.area === area)
      ?? getAllDeals()[0];
    return deal.layers.soldComps.comps;
  }

  async getAirbnbComps(coords: Coords, beds: number): Promise<AirbnbComp[]> {
    return [
      { title: `${beds}-bed near city centre`, nightlyRate: 95, occupancy: 0.72, monthlyRevenue: 2050, beds, distanceMiles: 0.4 },
      { title: `Stylish ${beds}-bed terrace`, nightlyRate: 110, occupancy: 0.68, monthlyRevenue: 2240, beds, distanceMiles: 0.7 },
      { title: `Family ${beds}-bed home`, nightlyRate: 85, occupancy: 0.75, monthlyRevenue: 1910, beds, distanceMiles: 1.1 },
    ];
  }

  async getLHARate(postcode: string, beds: number): Promise<number> {
    const isMcr = postcode.startsWith("M");
    const table: Record<number, [number, number]> = {
      1: [90, 110],
      2: [110, 140],
      3: [140, 175],
      4: [180, 240],
    };
    const [liv, mcr] = table[Math.min(4, Math.max(1, beds))] ?? [140, 175];
    return isMcr ? mcr : liv;
  }

  async getCrimeData(coords: Coords): Promise<CrimeData> {
    void coords;
    return {
      score: 5,
      burglaryPer1000: 12.4,
      asbPer1000: 28.1,
      summary: "Crime scoring is not used for buying decisions in this build.",
    };
  }

  async getPlanningData(coords: Coords): Promise<PlanningFlags> {
    void coords;
    return {
      article4: false,
      selectiveLicensing: true,
      additionalHmo: false,
      conservation: false,
    };
  }

  async getFloodData(coords: Coords): Promise<FloodData> {
    try {
      return await getLiveFloodData(coords);
    } catch {
      return { zone: 1, risk: "low", sourceNote: "Mock fallback — Environment Agency lookup unavailable." };
    }
  }
}
