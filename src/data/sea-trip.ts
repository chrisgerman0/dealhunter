export const TRIP_TITLE = "SEA (South East Asia) Trip";

export type TripWindow = "upcoming" | "underway" | "complete";

export interface TripPhase {
  id: string;
  city: string;
  chip: string;
  country: string;
  /** Date range as written. */
  dateLabel: string;
  start: string;
  end: string;
  note: string;
}

export interface VisaAlert {
  id: string;
  label: string;
  due: string;
  detail: string;
}

export interface Milestone {
  id: string;
  label: string;
  /** Null means the real day before the route, or today when the trip has not started. */
  date: string | null;
}

export const PHASES: TripPhase[] = [
  {
    id: "manchester",
    city: "Manchester",
    chip: "Manchester",
    country: "United Kingdom",
    dateLabel: "15 January 2027",
    start: "2027-01-15",
    end: "2027-01-15",
    note: "First leg is Manchester to Dubai on 15 January 2027.",
  },
  {
    id: "dubai",
    city: "Dubai",
    chip: "Dubai stopover",
    country: "United Arab Emirates",
    dateLabel: "15–16 January 2027",
    start: "2027-01-15",
    end: "2027-01-16",
    note: "One night on the way east, in mild January weather.",
  },
  {
    id: "chiang-mai",
    city: "Chiang Mai",
    chip: "Chiang Mai",
    country: "Thailand",
    dateLabel: "17 January–1 February 2027",
    start: "2027-01-17",
    end: "2027-02-01",
    note: "Chiang Mai in January has crisp evenings.",
  },
  {
    id: "phuket",
    city: "Phuket",
    chip: "Phuket",
    country: "Thailand",
    dateLabel: "1–26 February 2027",
    start: "2027-02-01",
    end: "2027-02-26",
    note: "Andaman dry season, and the window for the Thai extension.",
  },
  {
    id: "bangkok",
    city: "Bangkok",
    chip: "Bangkok",
    country: "Thailand",
    dateLabel: "26 February–3 March 2027",
    start: "2027-02-26",
    end: "2027-03-03",
    note: "A short city bridge before Vietnam.",
  },
  {
    id: "ho-chi-minh-city",
    city: "Ho Chi Minh City",
    chip: "Ho Chi Minh City",
    country: "Vietnam",
    dateLabel: "3–8 March 2027",
    start: "2027-03-03",
    end: "2027-03-08",
    note: "Arrival into the Vietnam 45-day exemption.",
  },
  {
    id: "da-nang",
    city: "Da Nang",
    chip: "Da Nang base",
    country: "Vietnam",
    dateLabel: "8 March–12 April 2027",
    start: "2027-03-08",
    end: "2027-04-12",
    note: "Da Nang is ideal beach weather in spring.",
  },
  {
    id: "kuala-lumpur",
    city: "Kuala Lumpur",
    chip: "Kuala Lumpur stopover",
    country: "Malaysia",
    dateLabel: "12–15 April 2027",
    start: "2027-04-12",
    end: "2027-04-15",
    note: "Three nights between the coast and Bali.",
  },
  {
    id: "bali",
    city: "Bali",
    chip: "Bali",
    country: "Indonesia",
    dateLabel: "15 April–15 May 2027",
    start: "2027-04-15",
    end: "2027-05-15",
    note: "The closing month, through 15 May 2027.",
  },
];

export const VISA_ALERTS: VisaAlert[] = [
  {
    id: "thai-extension",
    label: "Thai 30-day extension due by 15 February 2027",
    due: "2027-02-15",
    detail:
      "The Thailand chapter runs from 17 January through 3 March. A 30-day exemption from the Chiang Mai arrival does not cover Phuket and Bangkok, so the extension has to be filed by 15 February.",
  },
  {
    id: "vietnam-exemption",
    label: "Vietnam 45-day exemption, must check out by 12 April 2027",
    due: "2027-04-12",
    detail:
      "Entry is 3 March in Ho Chi Minh City. The exemption can cover the stay, but the itinerary leaves for Kuala Lumpur on 12 April and that checkout cannot slip.",
  },
];

export const MILESTONES: Milestone[] = [
  { id: "pre", label: "Pre-departure", date: null },
  { id: "chiang-mai", label: "Chiang Mai", date: "2027-01-17" },
  { id: "thai-extension", label: "Thai extension due", date: "2027-02-15" },
  { id: "da-nang", label: "Da Nang", date: "2027-03-08" },
  { id: "vietnam-exit", label: "Vietnam exit", date: "2027-04-12" },
  { id: "bali", label: "Bali", date: "2027-04-15" },
];

export const TRIP_START = PHASES[0].start;
export const TRIP_END = PHASES[PHASES.length - 1].end;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function utcTodayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function formatLongDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const monthName = MONTHS[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}

export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const monthName = MONTHS_SHORT[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}

export function formatAxisDate(iso: string): string {
  const [, month, day] = iso.split("-");
  const monthName = MONTHS_SHORT[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthName}`.toUpperCase();
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}

export function addDays(iso: string, days: number): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

/** Inclusive days from 15 January through 15 May 2027. */
export const TRIP_SPAN_DAYS = daysBetween(TRIP_START, TRIP_END) + 1;

export const COUNTRY_COUNT = new Set(PHASES.map((phase) => phase.country)).size;

/**
 * On a handover day, the phase that starts that day is the active one.
 * Manchester and Dubai both open on 15 January, so the earlier chapter stays active that day.
 */
export function activePhaseId(day: string): string | null {
  if (day < TRIP_START || day > TRIP_END) return null;
  let chosen: TripPhase | null = null;
  for (const phase of PHASES) {
    if (day >= phase.start && day <= phase.end) {
      if (!chosen || phase.start > chosen.start) chosen = phase;
    }
  }
  return chosen?.id ?? null;
}

export function tripWindow(day: string): TripWindow {
  if (day < TRIP_START) return "upcoming";
  if (day > TRIP_END) return "complete";
  return "underway";
}

export function dayNumber(day: string): number | null {
  if (day < TRIP_START || day > TRIP_END) return null;
  return daysBetween(TRIP_START, day) + 1;
}

export function progressFor(day: string): number {
  const n = dayNumber(day);
  if (n == null) return day > TRIP_END ? 1 : 0;
  return n / TRIP_SPAN_DAYS;
}

export function clampToRoute(day: string): string {
  if (day < TRIP_START) return TRIP_START;
  if (day > TRIP_END) return TRIP_END;
  return day;
}
