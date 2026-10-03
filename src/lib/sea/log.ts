export const SEA_LOG_KEY = "dealhunter.sea.log.v1";

export const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food" },
  { id: "transport", label: "Transport" },
  { id: "leisure", label: "Leisure" },
  { id: "other", label: "Other" },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["id"];

export const CURRENCIES = ["GBP", "USD", "EUR", "THB"] as const;
export type TripCurrency = (typeof CURRENCIES)[number];

export interface FlightBooking {
  id: string;
  kind: "flight";
  fromAirport: string;
  toAirport: string;
  date: string;
  departTime: string;
  arriveTime: string;
  checkInDetails: string;
  bookingRef: string;
  bookingUrl: string;
}

export interface StayBooking {
  id: string;
  kind: "stay";
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkInDetails: string;
  bookingRef: string;
  bookingUrl: string;
}

export type TripBooking = FlightBooking | StayBooking;

export interface TripExpense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  note: string;
}

export interface SeaLog {
  currency: TripCurrency;
  bookings: TripBooking[];
  expenses: TripExpense[];
}

export const EMPTY_SEA_LOG: SeaLog = {
  currency: "GBP",
  bookings: [],
  expenses: [],
};

function isCategory(value: unknown): value is ExpenseCategory {
  return EXPENSE_CATEGORIES.some((category) => category.id === value);
}

function isCurrency(value: unknown): value is TripCurrency {
  return CURRENCIES.some((currency) => currency === value);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isFlight(value: unknown): value is FlightBooking {
  if (!value || typeof value !== "object") return false;
  const row = value as FlightBooking;
  return row.kind === "flight" && typeof row.id === "string";
}

function isStay(value: unknown): value is StayBooking {
  if (!value || typeof value !== "object") return false;
  const row = value as StayBooking;
  return row.kind === "stay" && typeof row.id === "string";
}

function normalizeBooking(value: unknown): TripBooking | null {
  if (isFlight(value)) {
    return {
      id: value.id,
      kind: "flight",
      fromAirport: asText(value.fromAirport),
      toAirport: asText(value.toAirport),
      date: asText(value.date),
      departTime: asText(value.departTime),
      arriveTime: asText(value.arriveTime),
      checkInDetails: asText(value.checkInDetails),
      bookingRef: asText(value.bookingRef),
      bookingUrl: asText(value.bookingUrl),
    };
  }
  if (isStay(value)) {
    return {
      id: value.id,
      kind: "stay",
      hotelName: asText(value.hotelName),
      checkInDate: asText(value.checkInDate),
      checkOutDate: asText(value.checkOutDate),
      checkInTime: asText(value.checkInTime),
      checkInDetails: asText(value.checkInDetails),
      bookingRef: asText(value.bookingRef),
      bookingUrl: asText(value.bookingUrl),
    };
  }
  return null;
}

function normalizeExpense(value: unknown): TripExpense | null {
  if (!value || typeof value !== "object") return null;
  const row = value as TripExpense;
  const amount = typeof row.amount === "number" ? row.amount : Number(row.amount);
  if (!row.id || !isCategory(row.category) || !Number.isFinite(amount)) return null;
  return {
    id: row.id,
    date: asText(row.date),
    category: row.category,
    amount,
    note: asText(row.note),
  };
}

export function readSeaLog(): SeaLog {
  if (typeof window === "undefined") return EMPTY_SEA_LOG;
  try {
    const raw = window.localStorage.getItem(SEA_LOG_KEY);
    if (!raw) return EMPTY_SEA_LOG;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY_SEA_LOG;
    const record = parsed as Partial<SeaLog>;
    return {
      currency: isCurrency(record.currency) ? record.currency : "GBP",
      bookings: Array.isArray(record.bookings)
        ? record.bookings.map(normalizeBooking).filter((row): row is TripBooking => row != null)
        : [],
      expenses: Array.isArray(record.expenses)
        ? record.expenses.map(normalizeExpense).filter((row): row is TripExpense => row != null)
        : [],
    };
  } catch {
    return EMPTY_SEA_LOG;
  }
}

export function writeSeaLog(log: SeaLog): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SEA_LOG_KEY, JSON.stringify(log));
}

export function expenseTotal(expenses: TripExpense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function formatMoney(amount: number, currency: TripCurrency): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
}
