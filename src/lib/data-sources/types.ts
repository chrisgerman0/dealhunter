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

export type DataSourceKind = "mock" | "rightmove" | "zoopla" | "propertydata";

export interface PropertyDataSource {
  searchListings(params: SearchParams): Promise<Listing[]>;
  getListingDetail(id: string): Promise<ListingDetail>;
  getSoldComps(postcode: string, beds: number): Promise<Comp[]>;
  getAirbnbComps(coords: Coords, beds: number): Promise<AirbnbComp[]>;
  getLHARate(postcode: string, beds: number): Promise<number>;
  getCrimeData(coords: Coords): Promise<CrimeData>;
  getPlanningData(coords: Coords): Promise<PlanningFlags>;
  getFloodData(coords: Coords): Promise<FloodData>;
}
