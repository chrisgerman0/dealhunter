"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Hotel,
  Luggage,
  Plane,
  Stamp,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PHASES,
  TRIP_TITLE,
  VISA_ALERTS,
  activePhaseId,
  checklistGroups,
  daysBetween,
  formatLongDate,
  phaseStatus,
  routeProgress,
  tripWindow,
  type PhaseStatus,
  type TripPhase,
} from "@/data/sea-trip";

const CHECKS_KEY = "dealhunter.sea.checklist.v1";

const cardClass =
  "rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition duration-200 hover:z-10 hover:scale-[1.02] hover:border-slate-700 motion-reduce:transition-none motion-reduce:hover:scale-100";

function pluralDays(count: number): string {
  const n = Math.abs(count);
  return `${n} ${n === 1 ? "day" : "days"}`;
}

function statusWord(status: PhaseStatus): string {
  if (status === "active") return "Now";
  if (status === "complete") return "Done";
  return "Ahead";
}

export function SeaDashboard({ today }: { today: string }) {
  const routeState = tripWindow(today);
  const activeId = activePhaseId(today);
  const progress = routeProgress(today);
  const [selectedId, setSelectedId] = useState(activeId ?? PHASES[0].id);
  const [noteTab, setNoteTab] = useState<"weather" | "packing">("weather");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [checksReady, setChecksReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CHECKS_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setChecked(parsed as Record<string, boolean>);
        }
      }
    } catch {
      // Ignore unreadable checklist storage.
    }
    setChecksReady(true);
  }, []);

  useEffect(() => {
    if (!checksReady) return;
    window.localStorage.setItem(CHECKS_KEY, JSON.stringify(checked));
  }, [checked, checksReady]);

  const selected = PHASES.find((phase) => phase.id === selectedId) ?? PHASES[0];
  const active = PHASES.find((phase) => phase.id === activeId) ?? null;
  const departureIn = daysBetween(today, PHASES[0].start);
  const elapsed = daysBetween(PHASES[0].start, today);

  function toggleCheck(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  }

  let statusLine = "Upcoming";
  let statusDetail = `Departs ${formatLongDate(PHASES[0].start)}. No phase is active yet.`;
  if (routeState === "underway" && active) {
    statusLine = `Now · ${active.city}`;
    statusDetail = `Day ${elapsed + 1} on the route.`;
  } else if (routeState === "complete") {
    statusLine = "Complete";
    statusDetail = `The route closed on ${formatLongDate(PHASES[PHASES.length - 1].end)}.`;
  } else if (departureIn > 0) {
    statusDetail = `${pluralDays(departureIn)} until departure. No phase is active yet.`;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.14),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
          >
            <ArrowLeft className="size-4" />
            Deal Hunter
          </Link>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Today · {formatLongDate(today)}
          </p>
        </div>

        <header className="mt-8 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            Chris Germano
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            {TRIP_TITLE}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            {formatLongDate(PHASES[0].start)} to {formatLongDate(PHASES[PHASES.length - 1].end)}. Eight
            phases from Dubai to Bali.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              data-trip-window={routeState}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium",
                routeState === "underway"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 bg-slate-900 text-slate-200"
              )}
            >
              {statusLine}
            </span>
            <span className="text-sm text-slate-400">{statusDetail}</span>
          </div>
        </header>

        <ProgressTimeline
          today={today}
          activeId={activeId}
          selectedId={selected.id}
          progress={progress}
          onSelect={setSelectedId}
        />

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)]">
          <ItineraryFeed today={today} activeId={activeId} />
          <div className="space-y-6">
            <VisaWidget today={today} />
            <PhaseChecklist phase={selected} checked={checked} onToggle={toggleCheck} />
            <WeatherPacking phase={selected} tab={noteTab} onTab={setNoteTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressTimeline({
  today,
  activeId,
  selectedId,
  progress,
  onSelect,
}: {
  today: string;
  activeId: string | null;
  selectedId: string;
  progress: number;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="mt-10" aria-labelledby="sea-timeline-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id="sea-timeline-heading" className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            Progress timeline
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {progress === 0
              ? "The route has not started."
              : `${Math.round(progress * 100)}% of the way from Dubai to the end of Bali.`}
          </p>
        </div>
      </div>
      <ol className="flex gap-3 overflow-x-auto pb-2">
          {PHASES.map((phase) => {
            const status = phaseStatus(phase, today, activeId);
            const selected = phase.id === selectedId;
            return (
              <li key={phase.id} className="min-w-[11.5rem] flex-1">
                <button
                  type="button"
                  onClick={() => onSelect(phase.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex h-full w-full flex-col rounded-2xl border px-3 py-3 text-left transition duration-200 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100",
                    status === "active"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-900/80 hover:border-slate-700",
                    selected && status !== "active" && "ring-1 ring-slate-500"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        status === "active" ? "bg-emerald-400" : "bg-slate-600"
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "text-[11px] font-medium uppercase tracking-[0.14em]",
                        status === "active" ? "text-emerald-300" : "text-slate-500"
                      )}
                    >
                      {statusWord(status)}
                    </span>
                  </span>
                  <span className="mt-3 block text-sm font-medium text-slate-50">{phase.city}</span>
                  <span className="mt-1 block text-xs leading-snug text-slate-400">{phase.dateLabel}</span>
                </button>
              </li>
            );
          })}
        </ol>
      <div
        className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Route progress"
      >
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress * 100}%` }} />
      </div>
    </section>
  );
}

function ItineraryFeed({ today, activeId }: { today: string; activeId: string | null }) {
  return (
    <section aria-labelledby="sea-itinerary-heading">
      <h2 id="sea-itinerary-heading" className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
        Itinerary
      </h2>
      <ol className="mt-4 space-y-4">
        {PHASES.map((phase) => {
          const status = phaseStatus(phase, today, activeId);
          return (
            <li key={phase.id}>
              <article
                className={cn(
                  cardClass,
                  status === "active" && "border-emerald-500/80 bg-emerald-500/10"
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-medium text-slate-50">{phase.city}</h3>
                  <span
                    className={cn(
                      "text-xs font-medium uppercase tracking-[0.14em]",
                      status === "active" ? "text-emerald-300" : "text-slate-500"
                    )}
                  >
                    {statusWord(status)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {phase.country} · {phase.dateLabel}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{phase.summary}</p>
                <ul className="mt-4 space-y-3 border-t border-slate-800 pt-4">
                  {phase.itinerary.map((entry) => (
                    <li key={entry.title}>
                      <p className="text-sm font-medium text-slate-100">{entry.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{entry.detail}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function VisaWidget({ today }: { today: string }) {
  return (
    <section aria-labelledby="sea-visa-heading">
      <h2 id="sea-visa-heading" className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300/90">
        Visa alerts
      </h2>
      <ul className="mt-4 space-y-3">
        {VISA_ALERTS.map((alert) => {
          const remaining = daysBetween(today, alert.due);
          let timing = `Due in ${pluralDays(remaining)}`;
          if (remaining === 0) timing = "Due today";
          if (remaining < 0) timing = `${pluralDays(remaining)} past the deadline`;
          return (
            <li key={alert.id}>
              <article className={cn(cardClass, "border-amber-500/40 bg-amber-500/10")}>
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden />
                  <div>
                    <p className="text-sm font-medium leading-snug text-amber-100">{alert.label}</p>
                    <p className="mt-2 text-xs text-amber-200/80">{timing}</p>
                    <p className="mt-2 text-sm leading-relaxed text-amber-100/70">{alert.context}</p>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const GROUP_ICONS = {
  flights: Plane,
  hotels: Hotel,
  visas: Stamp,
} as const;

function PhaseChecklist({
  phase,
  checked,
  onToggle,
}: {
  phase: TripPhase;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const groups = checklistGroups(phase);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const done = groups.reduce(
    (sum, group) => sum + group.items.filter((item) => checked[item.id]).length,
    0
  );

  return (
    <section className={cardClass} aria-labelledby="sea-checklist-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="sea-checklist-heading" className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            Checklist
          </h2>
          <p className="mt-2 text-base font-medium text-slate-50">{phase.city}</p>
          <p className="text-sm text-slate-400">{phase.dateLabel}</p>
        </div>
        <p className="text-xs text-slate-500">
          {done}/{total}
        </p>
      </div>
      <div className="mt-5 space-y-5">
        {groups.map((group) => {
          const Icon = GROUP_ICONS[group.key];
          return (
            <div key={group.key}>
              <h3 className="flex items-center gap-2 text-sm font-medium text-slate-100">
                <Icon className="size-4 text-slate-400" aria-hidden />
                {group.title}
              </h3>
              <ul className="mt-2 space-y-2">
                {group.items.map((item) => {
                  const on = Boolean(checked[item.id]);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => onToggle(item.id)}
                        className="flex w-full items-start gap-3 rounded-xl border border-slate-800 px-3 py-2 text-left text-sm transition-colors hover:border-slate-600"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                            on
                              ? "border-emerald-500 bg-emerald-500 text-slate-950"
                              : "border-slate-600"
                          )}
                          aria-hidden
                        >
                          {on ? <Check className="size-3" /> : null}
                        </span>
                        <span className={on ? "text-slate-500 line-through" : "text-slate-200"}>
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WeatherPacking({
  phase,
  tab,
  onTab,
}: {
  phase: TripPhase;
  tab: "weather" | "packing";
  onTab: (tab: "weather" | "packing") => void;
}) {
  return (
    <section className={cardClass} aria-labelledby="sea-notes-heading">
      <h2 id="sea-notes-heading" className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
        Weather and packing
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Notes for {phase.city}, with the rest of the route underneath.
      </p>
      <div className="mt-4 flex gap-1 rounded-xl border border-slate-800 bg-slate-950/70 p-1" role="tablist" aria-label="Weather and packing">
        <button
          type="button"
          role="tab"
          id="sea-tab-weather"
          aria-selected={tab === "weather"}
          aria-controls="sea-panel-notes"
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
            tab === "weather" ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:text-slate-200"
          )}
          onClick={() => onTab("weather")}
        >
          <Sun className="size-4" aria-hidden />
          Weather
        </button>
        <button
          type="button"
          role="tab"
          id="sea-tab-packing"
          aria-selected={tab === "packing"}
          aria-controls="sea-panel-notes"
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
            tab === "packing" ? "bg-slate-800 text-slate-50" : "text-slate-400 hover:text-slate-200"
          )}
          onClick={() => onTab("packing")}
        >
          <Luggage className="size-4" aria-hidden />
          Packing
        </button>
      </div>
      <div role="tabpanel" id="sea-panel-notes" aria-labelledby={tab === "weather" ? "sea-tab-weather" : "sea-tab-packing"} className="mt-4">
        <ul className="space-y-3">
          {PHASES.map((item) => {
            const note = tab === "weather" ? item.weather : item.packing;
            const viewing = item.id === phase.id;
            return (
              <li
                key={item.id}
                className={cn(
                  "rounded-xl border px-3 py-3",
                  viewing ? "border-emerald-500/40 bg-emerald-500/5" : "border-slate-800"
                )}
              >
                <p className="text-sm font-medium text-slate-100">{item.city}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{note}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
