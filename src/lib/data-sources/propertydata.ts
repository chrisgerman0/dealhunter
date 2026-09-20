import type { PropertyDataSource } from "./types";
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

/**
 * Stub for a keyed listings provider (PropertyData, Ideal Postcodes, etc.).
 *
 * Enrichment (crime / flood / sold comps) should keep using the free live
 * clients in `src/lib/enrich/` — do not scrape Rightmove or Zoopla.
 *
 * To wire later:
 * 1. Set PROPERTYDATA_API_KEY in Vercel
 * 2. Implement searchListings / getListingDetail
 * 3. Set DATA_SOURCE=propertydata
 */
export class PropertyDataListingsSource implements PropertyDataSource {
  async searchListings(params: SearchParams): Promise<Listing[]> {
    void params;
    throw new Error(
      "PropertyDataListingsSource not implemented — set DATA_SOURCE=mock until PROPERTYDATA_API_KEY is configured."
    );
  }
  async getListingDetail(id: string): Promise<ListingDetail> {
    void id;
    throw new Error("PropertyDataListingsSource not implemented");
  }
  async getSoldComps(postcode: string, beds: number): Promise<Comp[]> {
    void postcode;
    void beds;
    throw new Error("PropertyDataListingsSource not implemented — use live Land Registry client");
  }
  async getAirbnbComps(coords: Coords, beds: number): Promise<AirbnbComp[]> {
    void coords;
    void beds;
    throw new Error("PropertyDataListingsSource not implemented");
  }
  async getLHARate(postcode: string, beds: number): Promise<number> {
    void postcode;
    void beds;
    throw new Error("PropertyDataListingsSource not implemented");
  }
  async getCrimeData(coords: Coords): Promise<CrimeData> {
    void coords;
    throw new Error("PropertyDataListingsSource not implemented — use live police.uk client");
  }
  async getPlanningData(coords: Coords): Promise<PlanningFlags> {
    void coords;
    throw new Error("PropertyDataListingsSource not implemented");
  }
  async getFloodData(coords: Coords): Promise<FloodData> {
    void coords;
    throw new Error("PropertyDataListingsSource not implemented — use live EA flood client");
  }
}
