"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  COUNTRY_COUNT,
  MILESTONES,
  PHASES,
  TRIP_END,
  TRIP_SPAN_DAYS,
  TRIP_START,
  TRIP_TITLE,
  VISA_ALERTS,
  activePhaseId,
  addDays,
  clampToRoute,
  dayNumber,
  daysBetween,
  formatAxisDate,
  formatLongDate,
  progressFor,
  tripWindow,
} from "@/data/sea-trip";
import { EMPTY_SEA_LOG, expenseTotal, formatMoney, readSeaLog, writeSeaLog, type SeaLog } from "@/lib/sea/log";
import { BookingsPanel, SpendPanel } from "@/components/sea/sea-log";

export function SeaDashboard({ today }: { today: string }) {
  const [clock, setClock] = useState(today);
  const [log, setLog] = useState<SeaLog>(EMPTY_SEA_LOG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLog(readSeaLog());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeSeaLog(log);
  }, [log, ready]);

  const windowState = tripWindow(clock);
  const activeId = activePhaseId(clock);
  const active = PHASES.find((phase) => phase.id === activeId) ?? null;
  const number = dayNumber(clock);
  const until = daysBetween(clock, TRIP_START);
  const total = expenseTotal(log.expenses);

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-stone-950">
      <div className="border-b border-stone-200/80">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
          <SeaMark />
          <p className="text-sm font-semibold tracking-tight text-stone-950">{TRIP_TITLE}</p>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 lg:py-10">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Private itinerary</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl tracking-tight text-stone-950 sm:text-5xl">{TRIP_TITLE}</h1>
              <p className="mt-2 max-w-3xl text-sm text-stone-600 sm:text-base">
                Departs Manchester for Dubai on {formatLongDate(TRIP_START)}, then Thailand, Vietnam, Kuala Lumpur, and
                Bali through {formatLongDate(TRIP_END)}.
              </p>
            </div>
          </div>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
            <Stat label="Span" value={`${TRIP_SPAN_DAYS} days`} />
            <Stat label="Chapters" value={String(PHASES.length)} />
            <Stat label="Countries" value={String(COUNTRY_COUNT)} />
            <Stat label="Spend" value={formatMoney(total, log.currency)} />
          </dl>
          <p className="mt-3 text-sm text-stone-500">{PHASES.map((phase) => phase.city).join(" · ")}</p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.75fr)]">
          <ClockCard clock={clock} today={today} onClock={setClock} />
          <VisaCard clock={clock} today={today} />
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <BookingsPanel log={log} onChange={setLog} />
          <SpendPanel log={log} today={today} onChange={setLog} />
        </div>
        <p className="sr-only">
          {windowState === "upcoming"
            ? `Upcoming. ${until} days until departure. No chapter is active yet.`
            : active
              ? `Viewing ${active.city}. Day ${number} of ${TRIP_SPAN_DAYS}.`
              : "Route complete."}
        </p>
      </div>
    </div>
  );
}

function SeaMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
      <circle cx="16" cy="16" r="15" fill="#047857" />
      <path d="M7 19.5c3.2-5 6.6-7.5 9-7.5s5.8 2.5 9 7.5" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="11.2" r="1.7" fill="white" />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</dt>
      <dd className="font-serif text-xl text-stone-950">{value}</dd>
    </div>
  );
}

function ClockCard({
  clock,
  today,
  onClock,
  className,
}: {
  clock: string;
  today: string;
  onClock: (day: string) => void;
  className?: string;
}) {
  const state = tripWindow(clock);
  const activeId = activePhaseId(clock);
  const active = PHASES.find((phase) => phase.id === activeId) ?? null;
  const number = dayNumber(clock);
  const until = Math.max(0, daysBetween(clock, TRIP_START));
  const thumb =
    clock < TRIP_START ? 0 : clock > TRIP_END ? 100 : (daysBetween(TRIP_START, clock) / (TRIP_SPAN_DAYS - 1)) * 100;
  const percent = Math.round(progressFor(clock) * 100);
  const trackRef = useRef<HTMLDivElement>(null);

  function moveTo(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const index = Math.round(ratio * (TRIP_SPAN_DAYS - 1));
    onClock(addDays(TRIP_START, index));
  }

  function nudge(delta: number) {
    if (clock < TRIP_START) {
      if (delta > 0) onClock(TRIP_START);
      return;
    }
    if (clock > TRIP_END) {
      if (delta < 0) onClock(TRIP_END);
      return;
    }
    const next = addDays(clock, delta);
    if (next < TRIP_START) onClock(today < TRIP_START ? today : TRIP_START);
    else if (next > TRIP_END) onClock(TRIP_END);
    else onClock(next);
  }

  return (
    <section
      className={cn(
        "rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(28,25,23,0.45)] sm:p-6",
        className
      )}
      aria-labelledby="sea-clock-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p id="sea-clock-heading" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {state === "upcoming" ? "Upcoming" : state === "complete" ? "Route closed" : active?.country}
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
            {state === "upcoming" ? (
              <p className="font-serif text-6xl leading-none tracking-tight text-stone-950 sm:text-7xl">{until}</p>
            ) : (
              <p className="font-serif text-6xl leading-none tracking-tight text-stone-950 sm:text-7xl">
                {state === "complete" ? "Done" : `Day ${number}`}
              </p>
            )}
            <p className="pb-1 text-lg text-stone-500">
              {state === "upcoming" ? "days until departure" : `of ${TRIP_SPAN_DAYS}`}
            </p>
          </div>
          <p className={cn("mt-3 text-3xl font-medium tracking-tight", active ? "text-emerald-700" : "text-stone-700")}>
            {state === "upcoming" ? "No chapter is active yet" : state === "complete" ? formatLongDate(TRIP_END) : active?.city}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            {state === "underway" && active
              ? `${active.dateLabel}. ${active.note}`
              : state === "upcoming"
                ? `Departs Manchester for Dubai on ${formatLongDate(TRIP_START)}. Drag the clock to preview a chapter.`
                : "The route has closed."}
          </p>
        </div>
        <p className="font-serif text-5xl tracking-tight text-emerald-700">{percent}%</p>
      </div>

      <div className="mt-6">
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Trip clock"
          aria-valuemin={0}
          aria-valuemax={TRIP_SPAN_DAYS - 1}
          aria-valuenow={clock < TRIP_START ? 0 : daysBetween(TRIP_START, clampToRoute(clock))}
          aria-valuetext={formatLongDate(clock)}
          className="relative h-10 cursor-pointer touch-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            moveTo(event.clientX);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) moveTo(event.clientX);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault();
              nudge(event.shiftKey ? 7 : 1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault();
              nudge(event.shiftKey ? -7 : -1);
            } else if (event.key === "Home") {
              event.preventDefault();
              onClock(today < TRIP_START ? today : TRIP_START);
            } else if (event.key === "End") {
              event.preventDefault();
              onClock(TRIP_END);
            }
          }}
        >
          <div className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-stone-200" />
          <div
            className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-emerald-600"
            style={{ width: `${thumb}%` }}
          />
          {PHASES.map((phase) => {
            const left = (daysBetween(TRIP_START, phase.start) / (TRIP_SPAN_DAYS - 1)) * 100;
            return (
              <span
                key={phase.id}
                className={cn(
                  "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  left <= thumb ? "bg-emerald-700" : "bg-stone-300"
                )}
                style={{ left: `${left}%` }}
              />
            );
          })}
          <span
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-700 bg-white shadow"
            style={{ left: `${thumb}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] font-semibold tracking-[0.16em] text-stone-400">
          <span>{formatAxisDate(TRIP_START)}</span>
          <span>Drag to move the clock</span>
          <span>{formatAxisDate(TRIP_END)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PHASES.map((phase) => {
          const on = phase.id === activeId;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onClock(phase.start)}
              className={cn(
                "rounded-2xl border px-3 py-2 text-left transition",
                on ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-200 bg-white text-stone-800 hover:border-stone-400"
              )}
            >
              <span className={cn("block text-[10px] uppercase tracking-[0.14em]", on ? "text-emerald-100" : "text-stone-500")}>
                {phase.country}
              </span>
              <span className="mt-1 block text-sm font-medium">{phase.chip}</span>
              <span className={cn("mt-0.5 block text-[11px]", on ? "text-emerald-50" : "text-stone-500")}>{phase.dateLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {MILESTONES.map((milestone) => {
          const on = milestone.date == null ? clock < TRIP_START : clock === milestone.date;
          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => onClock(milestone.date ?? (today < TRIP_START ? today : addDays(TRIP_START, -1)))}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                on ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-stone-200 text-stone-600 hover:border-stone-400"
              )}
            >
              {milestone.label}
            </button>
          );
        })}
        <label className="ml-auto flex items-center gap-2 text-xs text-stone-500">
          As of
          <input
            type="date"
            value={clock}
            onChange={(event) => {
              if (event.target.value) onClock(event.target.value);
            }}
            className="rounded-full border border-stone-200 bg-white px-2 py-1 text-stone-800"
          />
        </label>
        <button
          type="button"
          onClick={() => onClock(today)}
          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-700"
        >
          Today
        </button>
      </div>
      <p className="mt-3 text-xs text-stone-500">
        {state === "underway" && active
          ? `Emerald marks the chapter this date falls in. Viewing ${active.city}.`
          : state === "upcoming"
            ? "Emerald marks the chapter this date falls in. Nothing is active before 15 January 2027."
            : "The clock is after the last day in Bali."}
      </p>
    </section>
  );
}

function VisaCard({ clock, today, className }: { clock: string; today: string; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(28,25,23,0.45)] sm:p-6",
        className
      )}
      aria-labelledby="sea-visa-heading"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Visa windows</p>
      <h2 id="sea-visa-heading" className="mt-2 font-serif text-3xl tracking-tight text-stone-950">
        Two dates that cannot slip
      </h2>
      <p className="mt-2 text-sm text-stone-500">
        {clock === today
          ? `Counted from today, ${formatLongDate(clock)}.`
          : `Counted from the trip clock, ${formatLongDate(clock)}.`}
      </p>
      <ul className="mt-4 space-y-3">
        {VISA_ALERTS.map((alert) => {
          const remaining = daysBetween(clock, alert.due);
          const headline = remaining === 0 ? "Today" : String(Math.abs(remaining));
          const caption = remaining === 0 ? "Due" : remaining > 0 ? "Days until" : "Days past";
          return (
            <li key={alert.id} className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold leading-snug text-stone-950">{alert.label}</p>
                <p className="text-right">
                  <span className="block font-serif text-4xl leading-none text-amber-800">{headline}</span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">{caption}</span>
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">{alert.detail}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-stone-500">Planning aid for this itinerary, not immigration advice.</p>
    </section>
  );
}
