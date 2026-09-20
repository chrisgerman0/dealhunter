const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_UA = "DealHunter/0.1 (+https://dealhunter.vercel.app)";

export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly causeName?: string
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

type FetchInit = RequestInit & {
  timeoutMs?: number;
  next?: { revalidate?: number | false };
};

export async function fetchUpstream(url: string, init: FetchInit = {}): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...rest } = init;
  const signal = rest.signal ?? timeoutSignal(timeoutMs);
  try {
    const res = await fetch(url, {
      ...rest,
      signal,
      headers: {
        Accept: "application/json",
        "User-Agent": DEFAULT_UA,
        ...headers,
      },
      // Next.js Data Cache — 12h. Ignored outside the App Router fetch patch.
      next: rest.next ?? { revalidate: 43_200 },
    } as RequestInit);
    return res;
  } catch (err) {
    const name = err instanceof Error ? err.name : "Error";
    if (name === "AbortError" || name === "TimeoutError") {
      throw new UpstreamError(`Upstream timed out: ${url}`, undefined, name);
    }
    throw new UpstreamError(
      `Upstream request failed: ${err instanceof Error ? err.message : String(err)}`,
      undefined,
      name
    );
  }
}

export async function fetchJson<T>(url: string, init: FetchInit = {}): Promise<T> {
  const res = await fetchUpstream(url, init);
  if (!res.ok) {
    throw new UpstreamError(`Upstream HTTP ${res.status} for ${url}`, res.status);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new UpstreamError(`Upstream returned non-JSON for ${url}`, res.status);
  }
}

export async function fetchJsonAllowEmpty<T>(
  url: string,
  init: FetchInit = {}
): Promise<T | null> {
  const res = await fetchUpstream(url, init);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new UpstreamError(`Upstream HTTP ${res.status} for ${url}`, res.status);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new UpstreamError(`Upstream returned non-JSON for ${url}`, res.status);
  }
}
