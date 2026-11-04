"use client";

import { useEffect, useState } from "react";
import type { R2RSeed } from "@/lib/r2r/assemble";
import type { R2RSeedSource } from "@/types/r2r";

export interface R2RSeedsData {
  seeds: R2RSeed[];
  source: R2RSeedSource;
  dataAsOf: string | null;
  note: string;
  marketStatus: Record<string, string>;
}

interface LoadState {
  data: R2RSeedsData | null;
  loading: boolean;
  error: string | null;
}

/**
 * One in-flight fetch shared across every component that calls this hook —
 * Explore, Shortlist and every deal detail page all want the same seed set
 * in the same page load, and the server route is already cached, but there
 * is no reason to round-trip four times for one render.
 */
let inFlight: Promise<R2RSeedsData> | null = null;
let lastResult: R2RSeedsData | null = null;

async function loadSeeds(): Promise<R2RSeedsData> {
  if (lastResult) return lastResult;
  if (!inFlight) {
    inFlight = fetch("/api/r2r/seeds", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Seeds request failed: HTTP ${res.status}`);
        }
        return (await res.json()) as R2RSeedsData;
      })
      .then((data) => {
        lastResult = data;
        return data;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

/** Call after settings that affect the server-side fetch (markets, geo match) change. */
export function invalidateR2RSeeds(): void {
  lastResult = null;
  inFlight = null;
}

export function useR2RSeeds(): LoadState {
  const [state, setState] = useState<LoadState>(() =>
    lastResult ? { data: lastResult, loading: false, error: null } : { data: null, loading: true, error: null }
  );

  useEffect(() => {
    let alive = true;
    if (lastResult) {
      setState({ data: lastResult, loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    loadSeeds()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (alive) setState({ data: null, loading: false, error: err instanceof Error ? err.message : String(err) });
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
