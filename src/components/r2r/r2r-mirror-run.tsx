"use client";

/**
 * The scrape-run console: paste search URLs, run, watch it work.
 *
 * Modelled on the reference scraper Chris sent — URL list, proxy block,
 * pages/delay/headless settings, live counters, a timestamped log and a
 * results table. Two deliberate departures from that screenshot, both because
 * copying it exactly would mean lying:
 *
 *   PROXY FIELDS ARE READ-ONLY. The reference tool is a desktop app where
 *   typing a proxy password into a form is fine. This is a web app: a form
 *   that posts proxy credentials to an API turns that API into an open relay,
 *   and the credential would sit in the request body, the browser's memory
 *   and probably a log. So the fields show what the *server* has configured
 *   from its environment and say how to change it. Nothing here can set a
 *   proxy, and the password is never rendered — only whether one exists.
 *
 *   HEADLESS BROWSER IS SHOWN AS UNAVAILABLE, NOT AS AN OFF TOGGLE. It was
 *   measured: a real headless Chromium with `navigator.webdriver` stripped
 *   gets the identical PerimeterX 403 as plain `fetch`. The block is IP
 *   reputation, so a browser toggle would be a control that does nothing. It
 *   is rendered disabled with the reason rather than offered as a fix.
 *
 * The run loop lives here rather than on the server — see the header of
 * `src/lib/scrape/run.ts`.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { MirroredListing } from "@/lib/mirror/types";

/* ------------------------------------------------------------------ *
 * Wire types — mirrors of the API route responses
 * ------------------------------------------------------------------ */

interface ProxyStatusWire {
  configured: boolean;
  host: string | null;
  port: number | null;
  authenticated: boolean;
  rotateEvery: number;
  sticky: boolean;
  note: string;
}

interface StoreInfoWire {
  driver: "kv" | "memory";
  durable: boolean;
  note: string;
}

interface AdapterInfo {
  proven: boolean;
  note: string;
}

interface RunPreconditions {
  proxy: ProxyStatusWire;
  store: StoreInfoWire;
  adapters: { zillow: AdapterInfo; realtor: AdapterInfo };
}

interface LogLine {
  at: string;
  level: "info" | "warn" | "error";
  message: string;
}

interface PageResult {
  ok: boolean;
  searchUrl: string;
  page: number;
  source: "zillow" | "realtor";
  market: string | null;
  fetchedUrl: string;
  httpStatus: number;
  via: "direct" | "proxy";
  elapsedMs: number;
  rowsFound: number;
  created: number;
  updated: number;
  revived: number;
  rejectedForSale: number;
  totalResultCount: number | null;
  totalPages: number | null;
  blocked: { kind: string; detail: string } | null;
  error: string | null;
  log: LogLine[];
}

interface ListingsResponse {
  listings: MirroredListing[];
  stats: {
    total: number;
    active: number;
    delisted: number;
    bySource: Record<string, number>;
    oldestActiveSeenAt: string | null;
    newestSeenAt: string | null;
  };
  excluded: { apartmentComplexes: number; delisted: number };
  searches: Array<{
    searchUrl: string;
    source: string;
    lastRefreshedAt: string;
    lastRowCount: number;
    lastError: string | null;
  }>;
  store: StoreInfoWire;
  proxy: ProxyStatusWire;
  dataAge: {
    stalestHours: number | null;
    freshestHours: number | null;
    stale: boolean;
    note: string;
  };
  generatedAt: string;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function clock(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

function hhmmss(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

const EXAMPLE_URLS = [
  "https://www.zillow.com/tampa-fl/rent-houses/",
  "https://www.zillow.com/kissimmee-fl/rent-houses/",
].join("\n");

/** Counters, exactly the set the reference tool shows. */
interface Counters {
  pages: number;
  urlsDone: number;
  urlsTotal: number;
  created: number;
  dupes: number;
  errors: number;
}

const ZERO: Counters = { pages: 0, urlsDone: 0, urlsTotal: 0, created: 0, dupes: 0, errors: 0 };

/* ------------------------------------------------------------------ *
 * The console
 * ------------------------------------------------------------------ */

export function R2RMirrorRun() {
  const [urlsText, setUrlsText] = useState(EXAMPLE_URLS);
  const [maxPages, setMaxPages] = useState(2);
  const [delayMin, setDelayMin] = useState(3);
  const [delayMax, setDelayMax] = useState(7);

  const [pre, setPre] = useState<RunPreconditions | null>(null);
  const [running, setRunning] = useState(false);
  const [counters, setCounters] = useState<Counters>(ZERO);
  const [log, setLog] = useState<LogLine[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [data, setData] = useState<ListingsResponse | null>(null);
  const [showComplexes, setShowComplexes] = useState(false);
  const [showDelisted, setShowDelisted] = useState(false);

  /** Set to true to ask the loop to stop at the next page boundary. */
  const stopRef = useRef(false);
  const logRef = useRef<HTMLDivElement | null>(null);

  const appendLog = useCallback((lines: LogLine[]) => {
    // Bounded: a 20-page run over 5 URLs produces a few hundred lines and an
    // unbounded array in state re-renders the whole list every page.
    setLog((prev) => [...prev, ...lines].slice(-400));
  }, []);

  const loadPreconditions = useCallback(async () => {
    try {
      const res = await fetch("/api/mirror/run", { cache: "no-store" });
      if (res.ok) setPre((await res.json()) as RunPreconditions);
    } catch {
      /* the banner simply will not render */
    }
  }, []);

  const loadListings = useCallback(async () => {
    const params = new URLSearchParams();
    if (showComplexes) params.set("includeApartmentComplexes", "true");
    if (showDelisted) params.set("includeDelisted", "true");
    try {
      const res = await fetch(`/api/mirror/listings?${params}`, { cache: "no-store" });
      if (res.ok) setData((await res.json()) as ListingsResponse);
    } catch {
      /* table keeps its previous contents */
    }
  }, [showComplexes, showDelisted]);

  useEffect(() => {
    void loadPreconditions();
  }, [loadPreconditions]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const searchUrls = useMemo(
    () =>
      urlsText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0),
    [urlsText]
  );

  /**
   * The run loop.
   *
   * Per URL: walk pages 1..maxPages, stopping early when a page yields nothing
   * or the source's own `totalPages` is reached. Collect every key seen across
   * that URL's pages, then call the `finish` action so delisting is decided
   * against the whole search rather than one page.
   */
  const start = useCallback(async () => {
    if (searchUrls.length === 0) {
      toast.error("Paste at least one Zillow or Realtor.com search URL.");
      return;
    }
    stopRef.current = false;
    setRunning(true);
    setCounters({ ...ZERO, urlsTotal: searchUrls.length });
    setLog([]);
    const startedAt = Date.now();
    const timer = setInterval(() => setElapsedMs(Date.now() - startedAt), 500);

    appendLog([
      {
        at: new Date().toISOString(),
        level: "info",
        message: `Run started — ${searchUrls.length} search URL(s), up to ${maxPages} page(s) each, ${delayMin}-${delayMax}s between fetches.`,
      },
    ]);

    try {
      for (const raw of searchUrls) {
        if (stopRef.current) break;
        const seenKeys: string[] = [];
        let pageCap = maxPages;

        for (let page = 1; page <= pageCap; page++) {
          if (stopRef.current) break;

          let result: PageResult | null = null;
          try {
            const res = await fetch("/api/mirror/run", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "page", searchUrl: raw, page }),
            });
            const body = (await res.json()) as PageResult | { error: string };
            if ("error" in body && !("page" in body)) {
              appendLog([{ at: new Date().toISOString(), level: "error", message: body.error }]);
              setCounters((c) => ({ ...c, errors: c.errors + 1, pages: c.pages + 1 }));
              break;
            }
            result = body as PageResult;
          } catch (err) {
            appendLog([
              {
                at: new Date().toISOString(),
                level: "error",
                message: `Request failed: ${err instanceof Error ? err.message : String(err)}`,
              },
            ]);
            setCounters((c) => ({ ...c, errors: c.errors + 1, pages: c.pages + 1 }));
            break;
          }

          appendLog(result.log);
          setCounters((c) => ({
            ...c,
            pages: c.pages + 1,
            created: c.created + result.created,
            dupes: c.dupes + result.updated,
            errors: c.errors + (result.ok ? 0 : 1),
          }));

          // Zillow tells us the real page count; never walk past it.
          if (result.totalPages != null && result.totalPages < pageCap) {
            pageCap = Math.max(1, result.totalPages);
          }

          if (result.blocked) {
            appendLog([
              {
                at: new Date().toISOString(),
                level: "error",
                message: `Stopping this search — ${result.blocked.kind} block will not clear by retrying from the same IP.`,
              },
            ]);
            break;
          }
          if (!result.ok) break;
          if (result.rowsFound === 0) {
            appendLog([
              {
                at: new Date().toISOString(),
                level: "info",
                message: `No rows on page ${page} — end of this search.`,
              },
            ]);
            break;
          }

          // The keys this page contributed, recomputed from the table after
          // the commit so `finish` sees exactly what is in the store.
          const fresh = await fetch(
            `/api/mirror/listings?includeApartmentComplexes=true&includeDelisted=true`,
            { cache: "no-store" }
          )
            .then((r) => (r.ok ? (r.json() as Promise<ListingsResponse>) : null))
            .catch(() => null);
          if (fresh) {
            for (const l of fresh.listings) {
              if (l.searchUrl === result.searchUrl && !seenKeys.includes(l.key)) {
                // Only rows refreshed in this run count as "seen now".
                if (new Date(l.lastSeenAt).getTime() >= startedAt) seenKeys.push(l.key);
              }
            }
          }

          if (page < pageCap && !stopRef.current) {
            const wait = (delayMin + Math.random() * Math.max(0, delayMax - delayMin)) * 1000;
            appendLog([
              {
                at: new Date().toISOString(),
                level: "info",
                message: `Waiting ${(wait / 1000).toFixed(1)}s before the next page.`,
              },
            ]);
            await new Promise((r) => setTimeout(r, wait));
          }
        }

        // Delisting sweep for this search.
        try {
          const res = await fetch("/api/mirror/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "finish", searchUrl: raw, seenKeys }),
          });
          if (res.ok) {
            const fin = (await res.json()) as { delisted: number; log: LogLine[] };
            appendLog(fin.log);
          }
        } catch {
          /* the sweep is best-effort; mirrored rows are already committed */
        }

        setCounters((c) => ({ ...c, urlsDone: c.urlsDone + 1 }));
      }
    } finally {
      clearInterval(timer);
      setElapsedMs(Date.now() - startedAt);
      setRunning(false);
      appendLog([
        {
          at: new Date().toISOString(),
          level: "info",
          message: stopRef.current ? "Run stopped by user." : "Run complete.",
        },
      ]);
      await loadListings();
    }
  }, [searchUrls, maxPages, delayMin, delayMax, appendLog, loadListings]);

  const stop = useCallback(() => {
    stopRef.current = true;
    toast.info("Stopping after the current page…");
  }, []);

  const rows = data?.listings ?? [];

  return (
    <div className="space-y-4 p-4">
      {/* ---------- preconditions ---------- */}
      {pre && (
        <div className="space-y-2">
          {!pre.store.durable && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <span className="font-medium">Mirror is not durable yet.</span> {pre.store.note}
            </div>
          )}
          <div
            className={
              pre.proxy.configured
                ? "rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-900"
                : "rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-900"
            }
          >
            <span className="font-medium">{pre.proxy.configured ? "Proxy active." : "No proxy."}</span>{" "}
            {pre.proxy.note}
          </div>
          {!pre.adapters.realtor.proven && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <span className="font-medium">Realtor.com parser unverified.</span>{" "}
              {pre.adapters.realtor.note}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* ---------- search URLs ---------- */}
        <div className="space-y-2 rounded-xl border p-3">
          <Label htmlFor="mirror-urls" className="text-sm font-medium">
            Search URLs — one per line
          </Label>
          <textarea
            id="mirror-urls"
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            spellCheck={false}
            rows={6}
            className="w-full rounded-lg border bg-background p-2 font-mono text-xs"
            placeholder="https://www.zillow.com/tampa-fl/rent-houses/"
          />
          <p className="text-xs text-muted-foreground">
            Paste Zillow or Realtor.com search pages. You control the search — set the filters on their site,
            then copy the URL. Page segments (<code className="font-mono">/2_p/</code>) are stripped; pages are
            walked automatically.
          </p>
          <p className="text-xs text-muted-foreground">
            For R2R use the <strong>houses</strong> URL shape —{" "}
            <code className="font-mono">zillow.com/tampa-fl/rent-houses/</code>. The plain{" "}
            <code className="font-mono">/rentals/</code> URL returns apartment complexes, whose leases ban
            subletting.
          </p>
        </div>

        {/* ---------- settings ---------- */}
        <div className="space-y-3 rounded-xl border p-3">
          <p className="text-sm font-medium">Settings</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="mirror-pages" className="text-xs">
                Max pages / URL
              </Label>
              <Input
                id="mirror-pages"
                type="number"
                min={1}
                max={20}
                value={maxPages}
                onChange={(e) => setMaxPages(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mirror-dmin" className="text-xs">
                Delay min (s)
              </Label>
              <Input
                id="mirror-dmin"
                type="number"
                min={0}
                value={delayMin}
                onChange={(e) => setDelayMin(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mirror-dmax" className="text-xs">
                Delay max (s)
              </Label>
              <Input
                id="mirror-dmax"
                type="number"
                min={0}
                value={delayMax}
                onChange={(e) => setDelayMax(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-dashed p-2">
            <Checkbox id="mirror-headless" checked={false} disabled />
            <div className="space-y-0.5">
              <Label htmlFor="mirror-headless" className="text-xs text-muted-foreground">
                Headless browser — unavailable
              </Label>
              <p className="text-xs text-muted-foreground">
                Measured: real headless Chromium gets the identical PerimeterX 403 as a plain fetch. The block is
                IP reputation, not fingerprinting, so a browser would not help. Left here disabled rather than
                offered as a fix that does nothing.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {running ? (
              <Button type="button" variant="destructive" onClick={stop} className="flex-1">
                Stop
              </Button>
            ) : (
              <Button type="button" onClick={() => void start()} className="flex-1">
                Start run
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => void loadListings()} disabled={running}>
              Refresh table
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- proxy (read-only, from the server's env) ---------- */}
      <div className="space-y-2 rounded-xl border p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">Proxy</p>
          <Badge variant="outline">Server-side only</Badge>
          {pre?.proxy.configured ? (
            <Badge className="border-transparent bg-emerald-600 text-white">Configured</Badge>
          ) : (
            <Badge variant="outline">Not set</Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <ProxyField label="Host" value={pre?.proxy.host ?? "—"} />
          <ProxyField label="Port" value={pre?.proxy.port != null ? String(pre.proxy.port) : "—"} />
          <ProxyField label="Username" value={pre?.proxy.authenticated ? "set (hidden)" : "—"} />
          <ProxyField label="Password" value={pre?.proxy.authenticated ? "set (hidden)" : "—"} />
          <ProxyField
            label="Rotate every"
            value={pre?.proxy.rotateEvery ? `${pre.proxy.rotateEvery} req` : "off"}
          />
          <ProxyField label="Sticky session" value={pre?.proxy.sticky ? "on" : "off"} />
        </div>
        <p className="text-xs text-muted-foreground">
          These are read from the server&apos;s environment and cannot be set from this page — a web form that
          posted proxy credentials would put them in the request body and make this endpoint an open relay. To
          change them set <code className="font-mono">SCRAPE_PROXY_URL</code> (
          <code className="font-mono">http://user:pass@host:port</code>), or the individual{" "}
          <code className="font-mono">SCRAPE_PROXY_HOST</code> /{" "}
          <code className="font-mono">_PORT</code> / <code className="font-mono">_USERNAME</code> /{" "}
          <code className="font-mono">_PASSWORD</code> /{" "}
          <code className="font-mono">_ROTATE_EVERY</code> / <code className="font-mono">_STICKY</code> vars. The
          password is never rendered here or written to the log.
        </p>
      </div>

      {/* ---------- counters ---------- */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Counter label="Elapsed" value={hhmmss(elapsedMs)} />
        <Counter label="Pages" value={String(counters.pages)} />
        <Counter label="URLs" value={`${counters.urlsDone}/${counters.urlsTotal}`} />
        <Counter label="New" value={String(counters.created)} tone="good" />
        <Counter label="Dupes" value={String(counters.dupes)} />
        <Counter label="Errors" value={String(counters.errors)} tone={counters.errors > 0 ? "bad" : undefined} />
      </div>

      {/* ---------- log ---------- */}
      <div className="rounded-xl border">
        <div className="flex items-center justify-between border-b px-3 py-1.5">
          <p className="text-sm font-medium">Log</p>
          {running && <Badge className="border-transparent bg-blue-600 text-white">Running</Badge>}
        </div>
        <div ref={logRef} className="h-56 overflow-y-auto bg-slate-950 p-2 font-mono text-[11px] leading-relaxed">
          {log.length === 0 ? (
            <p className="text-slate-500">No run yet.</p>
          ) : (
            log.map((l, i) => (
              <div
                key={`${l.at}-${i}`}
                className={
                  l.level === "error"
                    ? "text-red-400"
                    : l.level === "warn"
                      ? "text-amber-300"
                      : "text-slate-300"
                }
              >
                <span className="text-slate-500">{clock(l.at)}</span> {l.message}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ---------- mirror state ---------- */}
      {data && (
        <div className="space-y-2 rounded-xl border p-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">Mirror</p>
            <Badge variant="outline">{data.stats.active} active</Badge>
            {data.stats.delisted > 0 && <Badge variant="outline">{data.stats.delisted} delisted</Badge>}
            <Badge
              className={
                data.dataAge.stale
                  ? "border-transparent bg-amber-500 text-white"
                  : "border-transparent bg-emerald-600 text-white"
              }
            >
              {data.dataAge.stale ? "Stale" : "Fresh"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{data.dataAge.note}</p>
          {data.excluded.apartmentComplexes > 0 && !showComplexes && (
            <p className="text-xs text-muted-foreground">
              {data.excluded.apartmentComplexes} apartment-complex row(s) hidden — their leases prohibit
              subletting, so they are not R2R candidates.
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs">
              <Checkbox
                checked={showComplexes}
                onCheckedChange={(v) => setShowComplexes(v === true)}
              />
              Show apartment complexes
            </label>
            <label className="flex items-center gap-2 text-xs">
              <Checkbox checked={showDelisted} onCheckedChange={(v) => setShowDelisted(v === true)} />
              Show delisted
            </label>
          </div>
        </div>
      )}

      {/* ---------- results table ---------- */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              {["ID", "Price", "Address", "Beds", "Type", "Agent", "Tags", "Seen"].map((h) => (
                <th key={h} className="whitespace-nowrap px-2 py-1.5 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-2 py-6 text-center text-muted-foreground">
                  Mirror is empty. Paste a search URL and press Start run.
                </td>
              </tr>
            ) : (
              rows.map((l) => (
                <tr key={l.key} className={l.delistedAt ? "border-t opacity-50" : "border-t"}>
                  <td className="whitespace-nowrap px-2 py-1 font-mono">
                    {l.listingUrl ? (
                      <a
                        href={l.listingUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="underline"
                      >
                        {l.sourceListingId.slice(0, 14)}
                      </a>
                    ) : (
                      l.sourceListingId.slice(0, 14)
                    )}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1">
                    {l.rent != null ? `$${l.rent.toLocaleString("en-US")}` : "—"}
                  </td>
                  <td className="px-2 py-1">
                    {l.address}
                    {l.city ? `, ${l.city}` : ""} {l.zip}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1">{l.beds ?? "—"}</td>
                  <td className="whitespace-nowrap px-2 py-1">
                    <span className="font-mono">{l.rawHomeType ?? l.unitType}</span>
                    {l.isApartmentComplex && (
                      <Badge variant="outline" className="ml-1">
                        complex
                      </Badge>
                    )}
                  </td>
                  <td className="px-2 py-1">{l.agentName ?? "—"}</td>
                  <td className="px-2 py-1">{l.tags.slice(0, 3).join(" · ")}</td>
                  <td className="whitespace-nowrap px-2 py-1 text-muted-foreground">
                    {l.delistedAt ? "delisted" : clock(l.lastSeenAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Counter({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="rounded-lg border px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={
          tone === "good"
            ? "font-mono text-sm text-emerald-600"
            : tone === "bad"
              ? "font-mono text-sm text-red-600"
              : "font-mono text-sm"
        }
      >
        {value}
      </p>
    </div>
  );
}

function ProxyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="truncate font-mono text-xs">{value}</p>
    </div>
  );
}
