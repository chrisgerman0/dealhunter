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

/** Stub — wire Zoopla API credentials here. */
export class ZooplaDataSource implements PropertyDataSource {
  async searchListings(params: SearchParams): Promise<Listing[]> {
    void params;
    throw new Error("ZooplaDataSource not implemented — set DATA_SOURCE=mock or implement API client.");
  }
  async getListingDetail(id: string): Promise<ListingDetail> {
    void id;
    throw new Error("ZooplaDataSource not implemented");
  }
  async getSoldComps(postcode: string, beds: number): Promise<Comp[]> {
    void postcode; void beds;
    throw new Error("ZooplaDataSource not implemented");
  }
  async getAirbnbComps(coords: Coords, beds: number): Promise<AirbnbComp[]> {
    void coords; void beds;
    throw new Error("ZooplaDataSource not implemented");
  }
  async getLHARate(postcode: string, beds: number): Promise<number> {
    void postcode; void beds;
    throw new Error("ZooplaDataSource not implemented");
  }
  async getCrimeData(coords: Coords): Promise<CrimeData> {
    void coords;
    throw new Error("ZooplaDataSource not implemented");
  }
  async getPlanningData(coords: Coords): Promise<PlanningFlags> {
    void coords;
    throw new Error("ZooplaDataSource not implemented");
  }
  async getFloodData(coords: Coords): Promise<FloodData> {
    void coords;
    throw new Error("ZooplaDataSource not implemented");
  }
}
