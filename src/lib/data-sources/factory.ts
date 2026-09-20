import { MockPropertyDataSource } from "./mock";
import { hasPropertyDataKey, PropertyDataDataSource } from "./propertydata";
import { RightmoveDataSource } from "./rightmove";
import { ZooplaDataSource } from "./zoopla";
import type { DataSourceKind, PropertyDataSource } from "./types";

export type { DataSourceKind };

const KINDS: ReadonlySet<string> = new Set(["mock", "rightmove", "zoopla", "propertydata"]);

/**
 * Listings source switch.
 *
 * - `DATA_SOURCE=mock` — mock catalogue (also the default with no key)
 * - `DATA_SOURCE=propertydata` or a key with unset DATA_SOURCE — licensed PropertyData
 * - `rightmove` / `zoopla` — stubs that throw; we do not scrape those sites
 *
 * Explore UI still reads mock Deal objects until a listing→Deal assembler exists.
 * Sold comps stay on the free Land Registry client regardless of this switch.
 */
export function resolveDataSourceKind(kind?: DataSourceKind): DataSourceKind {
  if (kind) return kind;
  const env = process.env.DATA_SOURCE?.trim().toLowerCase();
  if (env && KINDS.has(env)) return env as DataSourceKind;
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

/** Explore / shortlist stay on mock deals until listing→Deal exists. */
export const propertyDataSource = createPropertyDataSource("mock");
