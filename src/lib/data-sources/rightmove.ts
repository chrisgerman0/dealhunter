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
import { DataSourceNotAvailableError, NO_SCRAPE_MESSAGE } from "./errors";

function notAvailable(): never {
  throw new DataSourceNotAvailableError("rightmove", NO_SCRAPE_MESSAGE);
}

/**
 * Stub only. There is no personal Rightmove API — do not scrape.
 * Inventory comes from PropertyDataDataSource when PROPERTYDATA_API_KEY is set.
 * Sold comps stay on the free Land Registry client, not this class.
 */
export class RightmoveDataSource implements PropertyDataSource {
  async searchListings(params: SearchParams): Promise<Listing[]> {
    void params;
    return notAvailable();
  }
  async getListingDetail(id: string): Promise<ListingDetail> {
    void id;
    return notAvailable();
  }
  async getSoldComps(postcode: string, beds: number): Promise<Comp[]> {
    void postcode;
    void beds;
    return notAvailable();
  }
  async getAirbnbComps(coords: Coords, beds: number): Promise<AirbnbComp[]> {
    void coords;
    void beds;
    return notAvailable();
  }
  async getLHARate(postcode: string, beds: number): Promise<number> {
    void postcode;
    void beds;
    return notAvailable();
  }
  async getCrimeData(coords: Coords): Promise<CrimeData> {
    void coords;
    return notAvailable();
  }
  async getPlanningData(coords: Coords): Promise<PlanningFlags> {
    void coords;
    return notAvailable();
  }
  async getFloodData(coords: Coords): Promise<FloodData> {
    void coords;
    return notAvailable();
  }
}
