type Entry<T> = { value: T; expires: number };

const store = new Map<string, Entry<unknown>>();
const MAX_ENTRIES = 500;

/** Crime monthly data: 12h. Flood / comps / postcodes: 24h. */
export const TTL_12H_MS = 12 * 60 * 60 * 1000;
export const TTL_24H_MS = 24 * 60 * 60 * 1000;

function evictIfNeeded() {
  if (store.size <= MAX_ENTRIES) return;
  const now = Date.now();
  for (const [key, entry] of Array.from(store.entries())) {
    if (entry.expires <= now) store.delete(key);
  }
  if (store.size <= MAX_ENTRIES) return;
  const extras = store.size - MAX_ENTRIES;
  const keys = Array.from(store.keys());
  for (let i = 0; i < extras; i++) {
    const key = keys[i];
    if (key != null) store.delete(key);
  }
}

export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key) as Entry<T> | undefined;
  if (!entry) return undefined;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): T {
  evictIfNeeded();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}

/**
 * In-flight requests, keyed the same way as `store`.
 *
 * Without this, N concurrent callers for the same key all miss the cache and
 * all call `fn()` — which for a scraper means N identical upstream requests
 * for one piece of data. The R2R seeds route builds up to a dozen seeds per
 * market concurrently and every one of them asks for that market's Airbnb
 * comp scan, so the un-deduped version was a dozen scrapes of the same URL
 * per market per cold request. Sharing the promise makes it one.
 */
const inFlight = new Map<string, Promise<unknown>>();

export async function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return hit;

  const pending = inFlight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  // Failures must NOT be cached — only the in-flight entry is shared, and it
  // is cleared on both settle paths so the next caller retries.
  const promise = fn()
    .then((value) => cacheSet(key, value, ttlMs))
    .finally(() => {
      inFlight.delete(key);
    });
  inFlight.set(key, promise);
  return promise;
}

export function roundCoord(n: number, places = 4): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}
