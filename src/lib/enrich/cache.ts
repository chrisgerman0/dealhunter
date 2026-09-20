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

export async function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return hit;
  const value = await fn();
  return cacheSet(key, value, ttlMs);
}

export function roundCoord(n: number, places = 4): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}
