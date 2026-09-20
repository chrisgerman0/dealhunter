import { MockPropertyDataSource } from "./mock";
import { hasPropertyDataKey, PropertyDataDataSource } from "./propertydata";
import { RightmoveDataSource } from "./rightmove";
import { ZooplaDataSource } from "./zoopla";
import type { PropertyDataSource } from "./types";

export type DataSourceKind = "mock" | "rightmove" | "zoopla" | "propertydata";

export function resolveDataSourceKind(
  kind?: DataSourceKind
): DataSourceKind {
  if (kind) return kind;
  const env = process.env.DATA_SOURCE as DataSourceKind | undefined;
  if (env === "propertydata" || env === "rightmove" || env === "zoopla" || env === "mock") {
    return env;
  }
  return hasPropertyDataKey() ? "propertydata" : "mock";
}

export function createPropertyDataSource(kind?: DataSourceKind): PropertyDataSource {
  switch (resolveDataSourceKind(kind)) {
    case "rightmove":
      return new RightmoveDataSource();
    case "zoopla":
      return new ZooplaDataSource();
    case "propertydata":
      return new PropertyDataDataSource();
    case "mock":
    default:
      return new MockPropertyDataSource();
  }
}

/** Listings stay mock in the UI until a PropertyData key is set and Explore is switched over. */
export const propertyDataSource = createPropertyDataSource("mock");
