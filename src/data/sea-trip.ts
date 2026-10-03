export const TRIP_TITLE = "SEA (South East Asia) Trip";

export type TripWindow = "upcoming" | "underway" | "complete";
export type PhaseStatus = "upcoming" | "active" | "complete";

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface ItineraryEntry {
  title: string;
  detail: string;
}

export interface TripPhase {
  id: string;
  city: string;
  country: string;
  /** Date range as written. Do not replace this with a shortened day count. */
  dateLabel: string;
  start: string;
  end: string;
  summary: string;
  weather: string;
  packing: string;
  itinerary: ItineraryEntry[];
  checklist: {
    flights: ChecklistItem[];
    hotels: ChecklistItem[];
    visas: ChecklistItem[];
  };
}

export interface VisaAlert {
  id: string;
  label: string;
  due: string;
  context: string;
}

export const PHASES: TripPhase[] = [
  {
    id: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    dateLabel: "15–16 January 2027",
    start: "2027-01-15",
    end: "2027-01-16",
    summary: "A one-night reset on the way east, before the long northern Thailand stay.",
    weather: "Mid-January is mild and sunny, with warm days and evenings that only need a light layer.",
    packing: "One smart-casual outfit, a light layer for the aircraft, and a small overnight bag you can live out of.",
    itinerary: [
      {
        title: "Arrive and sleep",
        detail: "Treat the stop as recovery, not sightseeing. One night is the whole point.",
      },
      {
        title: "Position for Chiang Mai",
        detail: "The onward flight is the reason for Dubai. Keep the connection unhurried.",
      },
    ],
    checklist: {
      flights: [
        { id: "dubai-flights-in", label: "Book the inbound flight into Dubai" },
        { id: "dubai-flights-on", label: "Confirm the onward flight to Chiang Mai" },
      ],
      hotels: [
        { id: "dubai-hotels-night", label: "Hold one night near the airport or a short transfer" },
      ],
      visas: [
        { id: "dubai-visas-entry", label: "Confirm UAE entry rules for your passport" },
      ],
    },
  },
  {
    id: "chiang-mai",
    city: "Chiang Mai",
    country: "Thailand",
    dateLabel: "17 January–1 February 2027",
    start: "2027-01-17",
    end: "2027-02-01",
    summary: "Cool-season base in the north. The longest Thai chapter before the coast.",
    weather: "Chiang Mai in January has crisp evenings. Days are warm and clear in the cool season, then drop once the sun is down.",
    packing: "A jacket or overshirt for crisp evenings, breathable clothes for warm days, and shoes for the Old City.",
    itinerary: [
      {
        title: "Settle in the Old City",
        detail: "Use the moat, temples, and cafés as the rhythm of the first week.",
      },
      {
        title: "Night markets after dark",
        detail: "Evenings are the event. Plan dinners outside and carry a layer.",
      },
    ],
    checklist: {
      flights: [
        { id: "cnx-flights-in", label: "Land in Chiang Mai on 17 January 2027" },
        { id: "cnx-flights-on", label: "Book the flight south toward Phuket" },
      ],
      hotels: [
        { id: "cnx-hotels-stay", label: "Book a stay covering 17 January–1 February 2027" },
      ],
      visas: [
        { id: "cnx-visas-entry", label: "Enter Thailand and note the 30-day stamp" },
        { id: "cnx-visas-extension", label: "Diary the Thai 30-day extension due by 15 February 2027" },
      ],
    },
  },
  {
    id: "phuket",
    city: "Phuket",
    country: "Thailand",
    dateLabel: "1–26 February 2027",
    start: "2027-02-01",
    end: "2027-02-26",
    summary: "Andaman coast for the dry season, and the window for the Thai extension.",
    weather: "February is hot, bright, and dry on the Andaman. Expect strong sun and warm seas.",
    packing: "Swimwear, reef-safe sunscreen, sandals, and a shirt that works from the beach to dinner.",
    itinerary: [
      {
        title: "Move to the coast",
        detail: "1 February is the handover from Chiang Mai. Phuket becomes the base that day.",
      },
      {
        title: "Extension week",
        detail: "The Thai 30-day extension is due by 15 February 2027, midway through this stay.",
      },
    ],
    checklist: {
      flights: [
        { id: "hkt-flights-in", label: "Confirm arrival in Phuket on 1 February 2027" },
        { id: "hkt-flights-on", label: "Book the hop to Bangkok for 26 February 2027" },
      ],
      hotels: [
        { id: "hkt-hotels-stay", label: "Book the Phuket stay for 1–26 February 2027" },
      ],
      visas: [
        { id: "hkt-visas-extension", label: "File the Thai 30-day extension due by 15 February 2027" },
      ],
    },
  },
  {
    id: "bangkok",
    city: "Bangkok",
    country: "Thailand",
    dateLabel: "26 February–3 March 2027",
    start: "2027-02-26",
    end: "2027-03-03",
    summary: "A short city bridge between the islands and Vietnam.",
    weather: "Late February into March is hot and humid, with long bright days.",
    packing: "Light city clothes, comfortable walking shoes, and a compact day bag.",
    itinerary: [
      {
        title: "City interval",
        detail: "Five nights to change pace before the Vietnam entry.",
      },
      {
        title: "Leave for Ho Chi Minh City",
        detail: "3 March is both the last Bangkok day and the arrival into Vietnam.",
      },
    ],
    checklist: {
      flights: [
        { id: "bkk-flights-in", label: "Arrive in Bangkok on 26 February 2027" },
        { id: "bkk-flights-on", label: "Book the flight to Ho Chi Minh City on 3 March 2027" },
      ],
      hotels: [
        { id: "bkk-hotels-stay", label: "Book Bangkok for 26 February–3 March 2027" },
      ],
      visas: [
        { id: "bkk-visas-exit", label: "Confirm the Thailand stamp still covers the 3 March departure" },
      ],
    },
  },
  {
    id: "ho-chi-minh-city",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    dateLabel: "3–8 March 2027",
    start: "2027-03-03",
    end: "2027-03-08",
    summary: "Arrival into the Vietnam 45-day exemption, before the long beach stay.",
    weather: "Early March is warm and humid as the dry season eases.",
    packing: "Light clothing, walking shoes, and a compact umbrella.",
    itinerary: [
      {
        title: "Enter Vietnam",
        detail: "The 45-day exemption starts on arrival. Checkout is fixed for 12 April 2027.",
      },
      {
        title: "Short city chapter",
        detail: "Five days, then north to the coast on 8 March.",
      },
    ],
    checklist: {
      flights: [
        { id: "sgn-flights-in", label: "Land in Ho Chi Minh City on 3 March 2027" },
        { id: "sgn-flights-on", label: "Book the flight to Da Nang on 8 March 2027" },
      ],
      hotels: [
        { id: "sgn-hotels-stay", label: "Book Ho Chi Minh City for 3–8 March 2027" },
      ],
      visas: [
        { id: "sgn-visas-exemption", label: "Enter on the Vietnam 45-day exemption" },
        { id: "sgn-visas-checkout", label: "Record that you must check out by 12 April 2027" },
      ],
    },
  },
  {
    id: "da-nang",
    city: "Da Nang",
    country: "Vietnam",
    dateLabel: "8 March–12 April 2027",
    start: "2027-03-08",
    end: "2027-04-12",
    summary: "The long coastal stay. Spring here is the reason the block is this long.",
    weather: "Da Nang is ideal beach weather in spring. March and April are warm, bright, and comfortable on the coast.",
    packing: "Swimwear, linen, sunscreen, and a light cover-up. Pack for the beach, not for a city winter.",
    itinerary: [
      {
        title: "Base on the coast",
        detail: "8 March through 12 April is one continuous coastal stay.",
      },
      {
        title: "Leave Vietnam on the deadline",
        detail: "12 April 2027 is both the end of Da Nang and the exemption checkout.",
      },
    ],
    checklist: {
      flights: [
        { id: "dad-flights-in", label: "Arrive in Da Nang on 8 March 2027" },
        { id: "dad-flights-on", label: "Book the flight to Kuala Lumpur on 12 April 2027" },
      ],
      hotels: [
        { id: "dad-hotels-stay", label: "Book Da Nang for the full 8 March–12 April 2027" },
      ],
      visas: [
        { id: "dad-visas-checkout", label: "Must check out of Vietnam by 12 April 2027" },
      ],
    },
  },
  {
    id: "kuala-lumpur",
    city: "Kuala Lumpur",
    country: "Malaysia",
    dateLabel: "12–15 April 2027",
    start: "2027-04-12",
    end: "2027-04-15",
    summary: "Three nights between Vietnam and the last month in Bali.",
    weather: "Mid-April is hot and humid, with a chance of a short afternoon shower.",
    packing: "Breathable layers and a compact rain shell.",
    itinerary: [
      {
        title: "Pause after Vietnam",
        detail: "12 April is the checkout from Da Nang and the arrival into Kuala Lumpur.",
      },
      {
        title: "Onward to Bali",
        detail: "15 April closes Malaysia and opens the final phase.",
      },
    ],
    checklist: {
      flights: [
        { id: "kul-flights-in", label: "Arrive in Kuala Lumpur on 12 April 2027" },
        { id: "kul-flights-on", label: "Book the flight to Bali on 15 April 2027" },
      ],
      hotels: [
        { id: "kul-hotels-stay", label: "Book three nights, 12–15 April 2027" },
      ],
      visas: [
        { id: "kul-visas-entry", label: "Confirm Malaysia entry rules for your passport" },
      ],
    },
  },
  {
    id: "bali",
    city: "Bali",
    country: "Indonesia",
    dateLabel: "15 April–15 May 2027",
    start: "2027-04-15",
    end: "2027-05-15",
    summary: "The closing month. Coast, rice terraces, and a slow end to the route.",
    weather: "Mid-April into May turns lush and warmer, with a few tropical showers as the wetter season builds.",
    packing: "Warm-weather clothes, a light rain layer, and a temple scarf.",
    itinerary: [
      {
        title: "Open the last month",
        detail: "15 April is the start of Bali and the end of Kuala Lumpur.",
      },
      {
        title: "Close the route",
        detail: "The stay runs through 15 May 2027, the last day on the board.",
      },
    ],
    checklist: {
      flights: [
        { id: "dps-flights-in", label: "Arrive in Bali on 15 April 2027" },
        { id: "dps-flights-home", label: "Book the departure on or after 15 May 2027" },
      ],
      hotels: [
        { id: "dps-hotels-stay", label: "Book Bali for 15 April–15 May 2027" },
      ],
      visas: [
        { id: "dps-visas-entry", label: "Confirm Indonesia entry rules for your passport" },
      ],
    },
  },
];

export const VISA_ALERTS: VisaAlert[] = [
  {
    id: "thai-extension",
    label: "Thai 30-day extension due by 15 February 2027",
    due: "2027-02-15",
    context: "Covers the Thailand chapters in Chiang Mai, Phuket, and Bangkok.",
  },
  {
    id: "vietnam-exemption",
    label: "Vietnam 45-day exemption, must check out by 12 April 2027",
    due: "2027-04-12",
    context: "Runs from Ho Chi Minh City through the full Da Nang stay.",
  },
];

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

export function utcTodayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function formatLongDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const monthName = MONTHS[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((to - from) / 86_400_000);
}

/** On a shared handover day, the phase that starts that day is the active one. */
export function activePhaseId(today: string): string | null {
  const first = PHASES[0];
  const last = PHASES[PHASES.length - 1];
  if (today < first.start || today > last.end) return null;

  let chosen: TripPhase | null = null;
  for (const phase of PHASES) {
    if (today >= phase.start && today <= phase.end) {
      if (!chosen || phase.start >= chosen.start) chosen = phase;
    }
  }
  return chosen?.id ?? null;
}

export function tripWindow(today: string): TripWindow {
  if (today < PHASES[0].start) return "upcoming";
  if (today > PHASES[PHASES.length - 1].end) return "complete";
  return "underway";
}

export function phaseStatus(phase: TripPhase, today: string, activeId: string | null): PhaseStatus {
  if (phase.id === activeId) return "active";
  if (today > phase.end) return "complete";
  if (today === phase.end && activeId && activeId !== phase.id) return "complete";
  return "upcoming";
}

/** Share of the route elapsed. Zero before 15 January 2027. */
export function routeProgress(today: string): number {
  const start = Date.parse(`${PHASES[0].start}T00:00:00Z`);
  const end = Date.parse(`${PHASES[PHASES.length - 1].end}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  if (Number.isNaN(now) || end <= start) return 0;
  if (now <= start) return 0;
  if (now >= end) return 1;
  return (now - start) / (end - start);
}

export function checklistGroups(phase: TripPhase) {
  return [
    { key: "flights" as const, title: "Flights", items: phase.checklist.flights },
    { key: "hotels" as const, title: "Hotels", items: phase.checklist.hotels },
    { key: "visas" as const, title: "Visas", items: phase.checklist.visas },
  ];
}
