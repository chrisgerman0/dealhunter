export interface BookingFields {
  fromAirport?: string;
  toAirport?: string;
  departTime?: string;
  arriveTime?: string;
  date?: string;
  endDate?: string;
  checkInTime?: string;
  hotelName?: string;
  confirmation?: string;
  flightNumber?: string;
  detail?: string;
  /** Set only when the page states a GBP amount. Never guessed. */
  price?: number;
  receiptUrl?: string;
}

export type BookingKind = "flight" | "stay";

const ISO_DATE = /^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}:\d{2}))?/;

function clean(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > 0 ? text : undefined;
}

function splitWhen(value: unknown): { date?: string; time?: string } {
  if (typeof value !== "string") return {};
  const match = value.match(ISO_DATE);
  if (!match) return {};
  return { date: match[1], time: match[2] };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function typeNames(node: Record<string, unknown>): string[] {
  return asList(node["@type"]).map((item) => String(item).toLowerCase());
}

function hasType(node: Record<string, unknown>, name: string): boolean {
  const needle = name.toLowerCase();
  return typeNames(node).some((item) => item.includes(needle));
}

function iataOf(value: unknown): string | undefined {
  const node = asRecord(value);
  if (!node) return undefined;
  const code = node.iataCode ?? node.iata ?? node.iata_code;
  if (typeof code === "string" && /^[a-z]{3}$/i.test(code)) return code.toUpperCase();
  return undefined;
}

function textOf(value: unknown): string | undefined {
  if (typeof value === "string") return clean(value);
  const node = asRecord(value);
  if (!node) return undefined;
  return textOf(node.name) ?? textOf(node.value);
}

function titleFromSlug(slug: string): string | undefined {
  const words = slug
    .replace(/\.html?$/i, "")
    .split(/[-_]+/)
    .filter((word) => word && !/^\d+$/.test(word) && word.toLowerCase() !== "hotel");
  if (words.length === 0) return undefined;
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function queryDate(params: URLSearchParams, names: string[]): string | undefined {
  for (const name of names) {
    const value = params.get(name);
    const parsed = splitWhen(value ?? undefined);
    if (parsed.date) return parsed.date;
  }
  return undefined;
}

function mergeFields(base: BookingFields, extra: BookingFields): BookingFields {
  const next: BookingFields = { ...base };
  (Object.keys(extra) as (keyof BookingFields)[]).forEach((key) => {
    const incoming = extra[key];
    const current = next[key];
    if (incoming == null || incoming === "") return;
    if (current == null || current === "") Object.assign(next, { [key]: incoming });
  });
  return next;
}

export function inferKind(fields: BookingFields): BookingKind | null {
  const hasRoute = Boolean(fields.fromAirport && fields.toAirport);
  const hasHotel = Boolean(fields.hotelName);
  if (hasRoute && !hasHotel) return "flight";
  if (hasHotel && !hasRoute) return "stay";
  if (hasRoute && hasHotel) return fields.endDate && !fields.flightNumber ? "stay" : "flight";
  if (fields.flightNumber) return "flight";
  if (fields.date && fields.endDate) return "stay";
  return null;
}

export function hasUsefulBooking(fields: BookingFields): boolean {
  return inferKind(fields) != null;
}

export function parseBookingUrl(raw: string): BookingFields {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return {};
  }
  const params = url.searchParams;
  const path = decodeURIComponent(url.pathname);
  const fields: BookingFields = {};

  const checkIn = queryDate(params, ["checkin", "checkIn", "check_in", "arrival", "start", "fromDate"]);
  const checkOut = queryDate(params, ["checkout", "checkOut", "check_out", "departure", "end", "toDate"]);
  if (checkIn) fields.date = checkIn;
  if (checkOut) fields.endDate = checkOut;

  const kayak = path.match(/\/flights\/([A-Za-z]{3})-([A-Za-z]{3})\/(\d{4}-\d{2}-\d{2})/i);
  if (kayak) {
    fields.fromAirport = kayak[1].toUpperCase();
    fields.toAirport = kayak[2].toUpperCase();
    fields.date = kayak[3];
  }

  const skyscanner = path.match(/\/flights\/([A-Za-z]{3})\/([A-Za-z]{3})\/(\d{2})(\d{2})(\d{2})\/?$/i);
  if (skyscanner) {
    fields.fromAirport = skyscanner[1].toUpperCase();
    fields.toAirport = skyscanner[2].toUpperCase();
    const year = Number(skyscanner[3]) > 70 ? `19${skyscanner[3]}` : `20${skyscanner[3]}`;
    fields.date = `${year}-${skyscanner[4]}-${skyscanner[5]}`;
  }

  const bookingHotel = path.match(/\/hotel\/[a-z]{2}\/([a-z0-9-]+)\.html/i);
  if (bookingHotel) fields.hotelName = titleFromSlug(bookingHotel[1]);

  const agoda = path.match(/^\/([a-z0-9-]+)\/hotel\//i);
  if (agoda) fields.hotelName = fields.hotelName ?? titleFromSlug(agoda[1]);

  const from = params.get("from") ?? params.get("origin");
  const to = params.get("to") ?? params.get("destination");
  if (from && /^[a-z]{3}$/i.test(from)) fields.fromAirport = from.toUpperCase();
  if (to && /^[a-z]{3}$/i.test(to)) fields.toAirport = to.toUpperCase();
  const depart = params.get("depart") ?? params.get("departureTime");
  const arrive = params.get("arrive") ?? params.get("arrivalTime");
  if (depart && /^\d{2}:\d{2}$/.test(depart)) fields.departTime = depart;
  if (arrive && /^\d{2}:\d{2}$/.test(arrive)) fields.arriveTime = arrive;
  const when = splitWhen(params.get("date") ?? undefined);
  if (when.date && !fields.date) fields.date = when.date;

  return fields;
}

function walkNodes(value: unknown, visit: (node: Record<string, unknown>) => void) {
  const node = asRecord(value);
  if (node) {
    visit(node);
    if (Array.isArray(node["@graph"])) {
      for (const child of node["@graph"]) walkNodes(child, visit);
    }
  } else if (Array.isArray(value)) {
    for (const child of value) walkNodes(child, visit);
  }
}

function readJsonLd(html: string): BookingFields {
  const fields: BookingFields = {};
  const pattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html))) {
    try {
      const parsed: unknown = JSON.parse(match[1]);
      walkNodes(parsed, (node) => {
        if (hasType(node, "flight")) {
          const flight = asRecord(node.reservationFor) ?? node;
          fields.fromAirport = fields.fromAirport ?? iataOf(flight.departureAirport);
          fields.toAirport = fields.toAirport ?? iataOf(flight.arrivalAirport);
          const depart = splitWhen(flight.departureTime);
          const arrive = splitWhen(flight.arrivalTime);
          fields.date = fields.date ?? depart.date;
          fields.departTime = fields.departTime ?? depart.time;
          fields.arriveTime = fields.arriveTime ?? arrive.time;
          fields.endDate = fields.endDate ?? arrive.date;
          fields.flightNumber = fields.flightNumber ?? textOf(flight.flightNumber);
          fields.confirmation = fields.confirmation ?? textOf(node.reservationNumber);
          fields.price = fields.price ?? readStructuredPrice(node) ?? readStructuredPrice(flight);
        }
        if (hasType(node, "lodging") || hasType(node, "hotel") || hasType(node, "accommodation")) {
          const place = asRecord(node.reservationFor) ?? node;
          fields.hotelName = fields.hotelName ?? textOf(place.name);
          const checkIn = splitWhen(node.checkinTime ?? node.checkInTime);
          const checkOut = splitWhen(node.checkoutTime ?? node.checkOutTime);
          fields.date = fields.date ?? checkIn.date;
          fields.endDate = fields.endDate ?? checkOut.date;
          fields.checkInTime = fields.checkInTime ?? checkIn.time;
          fields.confirmation = fields.confirmation ?? textOf(node.reservationNumber);
          fields.price = fields.price ?? readStructuredPrice(node) ?? (place ? readStructuredPrice(place) : undefined);
        }
      });
    } catch {
      // Ignore broken JSON-LD blocks.
    }
  }
  return fields;
}

function metaContent(html: string, key: string): string | undefined {
  const prop = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const first = new RegExp(
    `<meta[^>]*(?:property|name)=["']${prop}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  ).exec(html);
  const second = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${prop}["'][^>]*>`,
    "i"
  ).exec(html);
  const value = clean(first?.[1] ?? second?.[1]);
  if (!value || /sign in|log in|cookie|captcha|just a moment|access denied/i.test(value)) return undefined;
  return value
    .replace(/\s*[|–-]\s*(Booking\.com|Agoda|Airbnb|Expedia|Hotels\.com|Kayak|Skyscanner).*$/i, "")
    .trim();
}

function readVisibleText(html: string): BookingFields {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*$/gi, " ")
    .replace(/<style[\s\S]*$/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
  const fields: BookingFields = {};
  const route = text.match(/\b([A-Z]{3})\s*(?:to|→|–|-)\s*([A-Z]{3})\b/);
  if (route) {
    fields.fromAirport = route[1];
    fields.toAirport = route[2];
  }
  const flight = text.match(/\b(?:flight)\s+([A-Z]{1,3}\d{2,4})\b/i);
  if (flight) fields.flightNumber = flight[1].toUpperCase();
  const times = text.match(/\b(?:depart(?:s|ure)?|leaves)\s*(?:at)?\s*(\d{1,2}:\d{2})\b/i);
  const arrives = text.match(/\b(?:arriv(?:e|es|al))\s*(?:at)?\s*(\d{1,2}:\d{2})\b/i);
  if (times) fields.departTime = times[1].padStart(5, "0");
  if (arrives) fields.arriveTime = arrives[1].padStart(5, "0");
  const checkIn = text.match(/\bcheck[- ]?in(?:\s+time)?\s*(?:from|at|:)?\s*(\d{1,2}:\d{2})\b/i);
  if (checkIn) fields.checkInTime = checkIn[1].padStart(5, "0");
  const price = readClearGbpPrice(text);
  if (price != null) fields.price = price;
  return fields;
}

export function parseBookingHtml(html: string): BookingFields {
  const merged = mergeFields(readJsonLd(html), readVisibleText(html));
  const title = metaContent(html, "og:title") ?? metaContent(html, "twitter:title");
  if (title && !merged.hotelName && !merged.fromAirport && !merged.flightNumber) merged.hotelName = title;
  return merged;
}

export function isDirectImageUrl(raw: string): boolean {
  try {
    return /\.(png|jpe?g|webp)$/i.test(new URL(raw).pathname);
  } catch {
    return false;
  }
}

function parseGbpAmount(raw: string): number | undefined {
  const value = Number(raw.replace(/,/g, "").replace(/£|\s|gbp/gi, ""));
  if (!Number.isFinite(value) || value <= 0 || value > 1_000_000) return undefined;
  return Math.round(value * 100) / 100;
}

function priceFromRecord(node: Record<string, unknown> | null): number | undefined {
  if (!node || node.price == null) return undefined;
  const currency = String(node.priceCurrency ?? node.currency ?? "").toUpperCase();
  if (currency !== "GBP") return undefined;
  return parseGbpAmount(String(node.price));
}

function readStructuredPrice(node: Record<string, unknown>): number | undefined {
  const direct = priceFromRecord(node);
  if (direct != null) return direct;
  const offer = asRecord(node.offers);
  const fromOffer = priceFromRecord(offer);
  if (fromOffer != null) return fromOffer;
  for (const item of asList(node.offers)) {
    const amount = priceFromRecord(asRecord(item));
    if (amount != null) return amount;
  }
  return undefined;
}

const GBP_AMOUNT = String.raw`([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?|[0-9]+(?:\.[0-9]{2})?)`;

/**
 * A visible GBP amount only when the page labels it as the total, fare, or price.
 * A lone £ figure is not enough: search pages often mention an unrelated amount.
 */
export function readClearGbpPrice(text: string): number | undefined {
  const labeled = text.match(
    new RegExp(
      `(?:grand total|total(?:\\s+price)?|fare|ticket price|price|amount due)\\s*[:\\-]?\\s*(?:(?:GBP|£)\\s*${GBP_AMOUNT}|${GBP_AMOUNT}\\s*GBP)`,
      "i"
    )
  );
  if (!labeled) return undefined;
  return parseGbpAmount(labeled[1] ?? labeled[2]);
}

export function combineBooking(url: string, html: string | null): BookingFields {
  const fromUrl = parseBookingUrl(url);
  if (isDirectImageUrl(url)) fromUrl.receiptUrl = url;
  if (!html) return fromUrl;
  return mergeFields(parseBookingHtml(html), fromUrl);
}
