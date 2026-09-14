import type { AirbnbComp, Coords } from "@/types/deal";

/** Stub — wire AirDNA / similar STR comps API here. */
export class AirDNADataSource {
  async getAirbnbComps(coords: Coords, beds: number): Promise<AirbnbComp[]> {
    void coords;
    void beds;
    throw new Error("AirDNADataSource not implemented — use MockPropertyDataSource for prototype.");
  }
}
