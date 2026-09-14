import { MockPropertyDataSource } from "./mock";
import { RightmoveDataSource } from "./rightmove";
import { ZooplaDataSource } from "./zoopla";
import type { PropertyDataSource } from "./types";

export type DataSourceKind = "mock" | "rightmove" | "zoopla";

export function createPropertyDataSource(
  kind: DataSourceKind = (process.env.DATA_SOURCE as DataSourceKind) || "mock"
): PropertyDataSource {
  switch (kind) {
    case "rightmove":
      return new RightmoveDataSource();
    case "zoopla":
      return new ZooplaDataSource();
    case "mock":
    default:
      return new MockPropertyDataSource();
  }
}

/** Singleton used by the app — currently Mock. */
export const propertyDataSource = createPropertyDataSource("mock");
