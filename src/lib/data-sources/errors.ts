import type { DataSourceKind } from "./types";

/** Rightmove and Zoopla have no personal API. Licensed inventory comes from PropertyData. */
export const NO_SCRAPE_MESSAGE =
  "Deal Hunter does not scrape Rightmove or Zoopla. Set PROPERTYDATA_API_KEY and DATA_SOURCE=propertydata to use licensed PropertyData /sourced-properties.";

export const MISSING_PROPERTYDATA_KEY_MESSAGE =
  "PROPERTYDATA_API_KEY is not set. Keep DATA_SOURCE=mock, or add the key in Vercel. Do not scrape Rightmove or Zoopla.";

export class DataSourceNotAvailableError extends Error {
  readonly status: number;
  readonly kind: DataSourceKind;

  constructor(kind: DataSourceKind, message: string, status = 501) {
    super(message);
    this.name = "DataSourceNotAvailableError";
    this.kind = kind;
    this.status = status;
  }
}
