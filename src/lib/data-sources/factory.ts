import { MockPropertyDataSource } from "./mock";
import { PropertyDataListingsSource } from "./propertydata";
import { RightmoveDataSource } from "./rightmove";
import { ZooplaDataSource } from "./zoopla";
import type { PropertyDataSource } from "./types";

export type DataSourceKind = "mock" | "rightmove" | "zoopla" | "propertydata";

export function createPropertyDataSource(
  kind: DataSourceKind = (process.env.DATA_SOURCE as DataSourceKind) || "mock"
): PropertyDataSource {
  switch (kind) {
    case "rightmove":
      return new RightmoveDataSource();
    case "zoopla":
      return new ZooplaDataSource();
    case "propertydata":
      return new PropertyDataListingsSource();
    case "mock":
    default:
      return new MockPropertyDataSource();
  }
}

/** Singleton used by the app — listings still mock; enrichment methods call live UK APIs. */
export const propertyDataSource = createPropertyDataSource("mock");
