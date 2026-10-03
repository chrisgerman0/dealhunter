"use client";

import { useState } from "react";
import {
  CURRENCIES,
  EXPENSE_CATEGORIES,
  formatMoney,
  type ExpenseCategory,
  type FlightBooking,
  type SeaLog,
  type StayBooking,
  type TripCurrency,
} from "@/lib/sea/log";
import type { BookingFields, BookingKind } from "@/lib/sea/booking-parse";

const fieldClass =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-sm text-stone-900 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/15";

const labelClass = "mb-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-stone-500";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `sea-${Date.now()}`;
}

interface FlightDraft {
  fromAirport: string;
  toAirport: string;
  date: string;
  departTime: string;
  arriveTime: string;
  checkInDetails: string;
  bookingRef: string;
  bookingUrl: string;
  price: string;
  receiptUrl: string;
}

interface StayDraft {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkInDetails: string;
  bookingRef: string;
  bookingUrl: string;
  price: string;
  receiptUrl: string;
}

const EMPTY_FLIGHT: FlightDraft = {
  fromAirport: "",
  toAirport: "",
  date: "",
  departTime: "",
  arriveTime: "",
  checkInDetails: "",
  bookingRef: "",
  bookingUrl: "",
  price: "",
  receiptUrl: "",
};

const EMPTY_STAY: StayDraft = {
  hotelName: "",
  checkInDate: "",
  checkOutDate: "",
  checkInTime: "",
  checkInDetails: "",
  bookingRef: "",
  bookingUrl: "",
  price: "",
  receiptUrl: "",
};

function keep(value: string | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}

function priceText(price: number | undefined): string | null {
  if (price == null || !Number.isFinite(price)) return null;
  return String(price);
}

function readPrice(raw: string): number | null | "invalid" {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const value = Number(trimmed.replace(/,/g, ""));
  if (!Number.isFinite(value) || value < 0) return "invalid";
  return Math.round(value * 100) / 100;
}

export function BookingsPanel({
  log,
  onChange,
}: {
  log: SeaLog;
  onChange: (log: SeaLog) => void;
}) {
  const [kind, setKind] = useState<BookingKind>("flight");
  const [link, setLink] = useState("");
  const [flight, setFlight] = useState<FlightDraft>(EMPTY_FLIGHT);
  const [stay, setStay] = useState<StayDraft>(EMPTY_STAY);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);

  async function readLink() {
    setError(null);
    setNote(null);
    const url = link.trim();
    if (!url) {
      setError("Paste a booking link, or fill the fields by hand.");
      return;
    }
    setReading(true);
    try {
      const response = await fetch("/api/sea/parse-booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        kind?: BookingKind | null;
        fields?: BookingFields;
        note?: string;
        reason?: string;
      };
      if (!data.ok || !data.fields) {
        setError(data.reason ?? "This link could not be read. Fill the fields by hand.");
        return;
      }
      const fields = data.fields;
      const filledPrice = priceText(fields.price);
      if (data.kind == null) {
        if (fields.receiptUrl) {
          if (kind === "flight") setFlight((current) => ({ ...current, receiptUrl: fields.receiptUrl ?? current.receiptUrl }));
          else setStay((current) => ({ ...current, receiptUrl: fields.receiptUrl ?? current.receiptUrl }));
        } else if (filledPrice != null) {
          if (kind === "flight") setFlight((current) => ({ ...current, price: filledPrice }));
          else setStay((current) => ({ ...current, price: filledPrice }));
        }
        setLink(url);
        setNote(data.note ?? "The amount stays blank unless the page stated a price.");
        return;
      }
      if (data.kind === "stay") setKind("stay");
      if (data.kind === "flight") setKind("flight");
      if (data.kind === "flight") {
        setFlight((current) => ({
          ...current,
          fromAirport: keep(fields.fromAirport, current.fromAirport),
          toAirport: keep(fields.toAirport, current.toAirport),
          date: keep(fields.date, current.date),
          departTime: keep(fields.departTime, current.departTime),
          arriveTime: keep(fields.arriveTime, current.arriveTime),
          bookingRef: keep(fields.confirmation, current.bookingRef),
          bookingUrl: url,
          checkInDetails: keep(fields.flightNumber ? `Flight ${fields.flightNumber}` : undefined, current.checkInDetails),
          price: filledPrice ?? "",
          receiptUrl: fields.receiptUrl || current.receiptUrl,
        }));
      }
      if (data.kind === "stay") {
        setStay((current) => ({
          ...current,
          hotelName: keep(fields.hotelName, current.hotelName),
          checkInDate: keep(fields.date, current.checkInDate),
          checkOutDate: keep(fields.endDate, current.checkOutDate),
          checkInTime: keep(fields.checkInTime, current.checkInTime),
          bookingRef: keep(fields.confirmation, current.bookingRef),
          bookingUrl: url,
          price: filledPrice ?? "",
          receiptUrl: fields.receiptUrl || current.receiptUrl,
        }));
      }
      setLink(url);
      setNote(data.note ?? "Filled from the link. Change anything before you save it.");
    } catch {
      setError("This link could not be read. Fill the fields by hand.");
    } finally {
      setReading(false);
    }
  }

  function save() {
    setError(null);
    const draft = kind === "flight" ? flight : stay;
    const price = readPrice(draft.price);
    if (price === "invalid") {
      setError("Enter the price in pounds, or leave it blank.");
      return;
    }
    if (kind === "flight") {
      if (!flight.fromAirport.trim() && !flight.toAirport.trim() && !flight.bookingRef.trim()) {
        setError("Add the airports, the airport time, or the booking.");
        return;
      }
      const row: FlightBooking = {
        id: newId(),
        kind: "flight",
        fromAirport: flight.fromAirport,
        toAirport: flight.toAirport,
        date: flight.date,
        departTime: flight.departTime,
        arriveTime: flight.arriveTime,
        checkInDetails: flight.checkInDetails,
        bookingRef: flight.bookingRef,
        bookingUrl: flight.bookingUrl || link,
        price,
        receiptUrl: flight.receiptUrl,
      };
      onChange({ ...log, bookings: [row, ...log.bookings] });
      setFlight(EMPTY_FLIGHT);
      setLink("");
      setNote(null);
      return;
    }
    if (!stay.hotelName.trim() && !stay.bookingRef.trim()) {
      setError("Add the hotel or the booking.");
      return;
    }
    const row: StayBooking = {
      id: newId(),
      kind: "stay",
      hotelName: stay.hotelName,
      checkInDate: stay.checkInDate,
      checkOutDate: stay.checkOutDate,
      checkInTime: stay.checkInTime,
      checkInDetails: stay.checkInDetails,
      bookingRef: stay.bookingRef,
      bookingUrl: stay.bookingUrl || link,
      price,
      receiptUrl: stay.receiptUrl,
    };
    onChange({ ...log, bookings: [row, ...log.bookings] });
    setStay(EMPTY_STAY);
    setLink("");
    setNote(null);
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white shadow-[0_18px_40px_-28px_rgba(28,25,23,0.45)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-stone-500">Flights and stays</h2>
        <div className="flex rounded-full bg-stone-100 p-1">
          {(["flight", "stay"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setKind(option)}
              className={
                kind === option
                  ? "rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white"
                  : "rounded-full px-3 py-1 text-xs font-medium text-stone-600"
              }
            >
              {option === "flight" ? "Flight" : "Stay"}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3 px-4 py-3">
        <div className="flex gap-2">
          <label className="min-w-0 flex-1">
            <span className={labelClass}>Booking link</span>
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Paste a flight or hotel link"
              className={fieldClass}
              inputMode="url"
            />
          </label>
          <button
            type="button"
            onClick={readLink}
            disabled={reading}
            className="mt-5 shrink-0 rounded-full border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-800 disabled:opacity-50"
          >
            {reading ? "Reading" : "Read link"}
          </button>
        </div>
        {note ? <p className="text-xs text-emerald-800">{note}</p> : null}
        {error ? <p className="text-xs text-amber-800">{error}</p> : null}
        {kind === "flight" ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Field label="From" value={flight.fromAirport} onChange={(value) => setFlight({ ...flight, fromAirport: value })} placeholder="DXB" />
            <Field label="To" value={flight.toAirport} onChange={(value) => setFlight({ ...flight, toAirport: value })} placeholder="CNX" />
            <Field label="Date" value={flight.date} onChange={(value) => setFlight({ ...flight, date: value })} type="date" />
            <Field label="Airport time" value={flight.departTime} onChange={(value) => setFlight({ ...flight, departTime: value })} type="time" />
            <Field label="Arrives" value={flight.arriveTime} onChange={(value) => setFlight({ ...flight, arriveTime: value })} type="time" />
            <Field label="Check-in details" value={flight.checkInDetails} onChange={(value) => setFlight({ ...flight, checkInDetails: value })} placeholder="Terminal, desk, online" />
            <Field label="Booking" value={flight.bookingRef} onChange={(value) => setFlight({ ...flight, bookingRef: value })} placeholder="Reference" />
            <Field label="Price (GBP)" value={flight.price} onChange={(value) => setFlight({ ...flight, price: value })} placeholder="" inputMode="decimal" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Field label="Hotel" value={stay.hotelName} onChange={(value) => setStay({ ...stay, hotelName: value })} placeholder="Property name" />
            <Field label="Check-in" value={stay.checkInDate} onChange={(value) => setStay({ ...stay, checkInDate: value })} type="date" />
            <Field label="Check-out" value={stay.checkOutDate} onChange={(value) => setStay({ ...stay, checkOutDate: value })} type="date" />
            <Field label="Check-in time" value={stay.checkInTime} onChange={(value) => setStay({ ...stay, checkInTime: value })} type="time" />
            <Field label="Check-in details" value={stay.checkInDetails} onChange={(value) => setStay({ ...stay, checkInDetails: value })} placeholder="Name, room, desk" />
            <Field label="Booking" value={stay.bookingRef} onChange={(value) => setStay({ ...stay, bookingRef: value })} placeholder="Reference" />
            <Field label="Price (GBP)" value={stay.price} onChange={(value) => setStay({ ...stay, price: value })} placeholder="" inputMode="decimal" />
          </div>
        )}
        <ReceiptLine url={kind === "flight" ? flight.receiptUrl : stay.receiptUrl} />
        <button
          type="button"
          onClick={save}
          className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white"
        >
          Save {kind === "flight" ? "flight" : "stay"}
        </button>
        <ul className="space-y-2">
          {log.bookings.length === 0 ? (
            <li className="text-sm text-stone-500">Nothing saved yet. Add a flight or a stay, or paste a link.</li>
          ) : (
            log.bookings.map((booking) => (
              <li key={booking.id} className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">
                    {booking.kind === "flight"
                      ? [booking.fromAirport, booking.toAirport].filter(Boolean).join(" → ") || "Flight"
                      : booking.hotelName || "Stay"}
                  </p>
                  <p className="truncate text-xs text-stone-500">
                    {booking.kind === "flight"
                      ? [booking.date, booking.departTime && `${booking.departTime} airport time`, booking.checkInDetails, booking.bookingRef, booking.price != null ? formatMoney(booking.price, "GBP") : ""]
                          .filter(Boolean)
                          .join(" · ")
                      : [booking.checkInDate, booking.checkOutDate && `to ${booking.checkOutDate}`, booking.checkInTime && `check-in ${booking.checkInTime}`, booking.checkInDetails, booking.bookingRef, booking.price != null ? formatMoney(booking.price, "GBP") : ""]
                          .filter(Boolean)
                          .join(" · ")}
                  </p>
                  {booking.receiptUrl ? (
                    <a href={booking.receiptUrl} target="_blank" rel="noreferrer" className="text-xs text-stone-600 underline-offset-2 hover:underline">
                      Receipt
                    </a>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="shrink-0 text-xs text-stone-500 underline-offset-2 hover:underline"
                  onClick={() => onChange({ ...log, bookings: log.bookings.filter((row) => row.id !== booking.id) })}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

export function SpendPanel({
  log,
  today,
  onChange,
}: {
  log: SeaLog;
  today: string;
  onChange: (log: SeaLog) => void;
}) {
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const total = log.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  function addExpense() {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount.");
      return;
    }
    setError(null);
    onChange({
      ...log,
      expenses: [{ id: newId(), date, category, amount: value, note: note.trim() }, ...log.expenses],
    });
    setAmount("");
    setNote("");
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white shadow-[0_18px_40px_-28px_rgba(28,25,23,0.45)]">
      <div className="flex items-end justify-between gap-3 border-b border-stone-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-stone-500">General</h2>
          <p className="mt-1 font-serif text-3xl tracking-tight text-stone-950" aria-live="polite">
            {formatMoney(total, log.currency)}
          </p>
        </div>
        <label className="text-right">
          <span className={labelClass}>Currency</span>
          <select
            value={log.currency}
            onChange={(event) => onChange({ ...log, currency: event.target.value as TripCurrency })}
            className={fieldClass}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="space-y-3 px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Day" value={date} onChange={setDate} type="date" />
          <label>
            <span className={labelClass}>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value as ExpenseCategory)} className={fieldClass}>
              {EXPENSE_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <Field label="Amount" value={amount} onChange={setAmount} placeholder="0.00" inputMode="decimal" />
          <Field label="Note" value={note} onChange={setNote} placeholder="Dinner, taxi, museum" />
        </div>
        {error ? <p className="text-xs text-amber-800">{error}</p> : null}
        <button type="button" onClick={addExpense} className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white">
          Add cost
        </button>
        <p className="text-xs text-stone-500">
          {EXPENSE_CATEGORIES.map((item) => {
            const sum = log.expenses.filter((expense) => expense.category === item.id).reduce((totalFor, expense) => totalFor + expense.amount, 0);
            return `${item.label} ${formatMoney(sum, log.currency)}`;
          }).join(" · ")}
        </p>
        <ul className="space-y-2">
          {log.expenses.length === 0 ? (
            <li className="text-sm text-stone-500">No general costs yet. Food, transport, leisure, and other stay at zero until you add one.</li>
          ) : (
            log.expenses.map((expense) => (
              <li key={expense.id} className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {formatMoney(expense.amount, log.currency)} · {EXPENSE_CATEGORIES.find((item) => item.id === expense.category)?.label}
                  </p>
                  <p className="text-xs text-stone-500">{[expense.date, expense.note].filter(Boolean).join(" · ")}</p>
                </div>
                <button
                  type="button"
                  className="text-xs text-stone-500 underline-offset-2 hover:underline"
                  onClick={() => onChange({ ...log, expenses: log.expenses.filter((row) => row.id !== expense.id) })}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

function ReceiptLine({ url }: { url: string }) {
  if (!url) return null;
  return (
    <p className="text-xs text-stone-500">
      Receipt stored.{" "}
      <a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
        Open image
      </a>
    </p>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "decimal" | "url" | "text";
}) {
  return (
    <label className="min-w-0">
      <span className={labelClass}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}
