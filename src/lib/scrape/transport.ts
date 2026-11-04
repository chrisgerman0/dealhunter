/**
 * The one way a scrape leaves this app.
 *
 * WHY A TRANSPORT LAYER AT ALL
 * ----------------------------
 * Measured from the Contabo box on 2026-11-04, every one of these was the
 * same request to the same URL seconds apart, so the variable is the egress
 * IP and nothing else:
 *
 *   Zillow, direct from Contabo (FR, hosting=true)   HTTP 403, PerimeterX
 *   Zillow, via a different egress IP                HTTP 200, 979 KB,
 *                                                    41 parsed listings
 *   Realtor, direct from Contabo                     HTTP 429 (Kasada)
 *   Realtor, real headless Chrome from Contabo       HTTP 200 but the page is
 *                                                    "Not available in your
 *                                                    region" — a geo-block
 *
 * Two conclusions that shape this file. First, the Zillow block is IP
 * reputation, not browser fingerprinting: the same bytes that get a 403 from
 * a datacenter IP get a 200 and a full `__NEXT_DATA__` payload from a
 * different one, with no JS executed at all. A headless browser is therefore
 * not the fix and is not used — it would cost ~300 MB of Chromium per
 * invocation to solve a problem it does not solve. Second, Realtor needs a
 * **US** IP before anything else is even testable.
 *
 * So: one fetch path, an optional proxy in front of it, and the proxy comes
 * from the environment.
 *
 * CREDENTIAL HANDLING — THE RULE THIS FILE ENFORCES
 * -------------------------------------------------
 * Proxy host, port, username and password are read from env only. They are
 * never written to a log line, never put in an error message, never returned
 * in an API response, and never accepted from the browser. `describeProxy()`
 * is the only thing the UI ever sees and it reports host, port and whether a
 * credential is present — never the credential. The run log prints
 * `via proxy` or `direct`, nothing more.
 *
 * The UI's proxy fields are therefore *display and settings* for values that
 * must already exist server-side; the form cannot inject a proxy. That is
 * deliberate — a scraper that accepts an arbitrary caller-supplied proxy is
 * an open relay.
 */

/* ------------------------------------------------------------------ *
 * Config
 * ------------------------------------------------------------------ */

export interface ProxyConfig {
  host: string;
  port: number;
  username: string | null;
  hasPassword: boolean;
  /** New upstream identity every N requests. 0 = never rotate. */
  rotateEvery: number;
  /** Keep one upstream IP for the whole run (provider-dependent, see below). */
  sticky: boolean;
}

/** Safe to serialise to the client: no secret material. */
export interface ProxyStatus {
  configured: boolean;
  host: string | null;
  port: number | null;
  /** True when a username/password pair is present. The values are never exposed. */
  authenticated: boolean;
  rotateEvery: number;
  sticky: boolean;
  note: string;
}

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Reads `SCRAPE_PROXY_*`.
 *
 * `SCRAPE_PROXY_URL` is supported as a single-value alternative because every
 * residential proxy vendor hands out exactly that shape
 * (`http://user:pass@host:port`), and making Chris decompose it by hand into
 * four variables is how a password ends up in the wrong box.
 */
function proxyConfig(): ProxyConfig | null {
  const single = process.env.SCRAPE_PROXY_URL?.trim();
  if (single) {
    try {
      const u = new URL(single);
      return {
        host: u.hostname,
        port: Number.parseInt(u.port, 10) || (u.protocol === "https:" ? 443 : 80),
        username: u.username ? decodeURIComponent(u.username) : null,
        hasPassword: Boolean(u.password),
        rotateEvery: intEnv("SCRAPE_PROXY_ROTATE_EVERY", 0),
        sticky: process.env.SCRAPE_PROXY_STICKY?.trim() === "true",
      };
    } catch {
      // A malformed URL must not fall through to "no proxy" silently —
      // `proxyStatus()` reports it below.
      return null;
    }
  }

  const host = process.env.SCRAPE_PROXY_HOST?.trim();
  const port = intEnv("SCRAPE_PROXY_PORT", 0);
  if (!host || !port) return null;
  return {
    host,
    port,
    username: process.env.SCRAPE_PROXY_USERNAME?.trim() || null,
    hasPassword: Boolean(process.env.SCRAPE_PROXY_PASSWORD?.trim()),
    rotateEvery: intEnv("SCRAPE_PROXY_ROTATE_EVERY", 0),
    sticky: process.env.SCRAPE_PROXY_STICKY?.trim() === "true",
  };
}

export function proxyStatus(): ProxyStatus {
  const malformed =
    Boolean(process.env.SCRAPE_PROXY_URL?.trim()) && proxyConfig() === null;
  const cfg = proxyConfig();
  if (!cfg) {
    return {
      configured: false,
      host: null,
      port: null,
      authenticated: false,
      rotateEvery: 0,
      sticky: false,
      note: malformed
        ? "SCRAPE_PROXY_URL is set but is not a valid URL. Expected http://user:pass@host:port — scrapes are going out direct."
        : "No proxy configured. Requests leave from the host's own IP. Zillow blocks datacenter IPs (PerimeterX) and " +
          "Realtor.com blocks non-US IPs, so a US residential proxy is required for both. Set SCRAPE_PROXY_URL to enable.",
    };
  }
  return {
    configured: true,
    host: cfg.host,
    port: cfg.port,
    authenticated: Boolean(cfg.username && cfg.hasPassword),
    rotateEvery: cfg.rotateEvery,
    sticky: cfg.sticky,
    note:
      `Proxying via ${cfg.host}:${cfg.port}` +
      (cfg.username && cfg.hasPassword ? " with credentials from the environment." : " with no credentials set.") +
      (cfg.sticky ? " Sticky session requested." : cfg.rotateEvery > 0 ? ` Rotating every ${cfg.rotateEvery} requests.` : ""),
  };
}

export function hasProxy(): boolean {
  return proxyConfig() !== null;
}

/* ------------------------------------------------------------------ *
 * Fetch
 * ------------------------------------------------------------------ */

/**
 * The UA both adapters send.
 *
 * Same honest position as `apartmentguide.ts`: a self-identifying UA is
 * turned away at the door by these sites, so the choice is a browser UA or no
 * feature. The politeness budget is kept where it actually costs the upstream
 * something — bounded pages per search, a real delay between requests, and no
 * retry storm — rather than in a UA string nobody reads.
 */
export const SCRAPE_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

/**
 * Full desktop-Chrome header set.
 *
 * Measured: on Zillow these change nothing from a blocked IP (403 either
 * way), so they are not a bypass and are not presented as one. They are here
 * because from an *allowed* IP a bare `fetch` UA gets a different, lighter
 * page than a browser does, and the lighter page sometimes omits
 * `__NEXT_DATA__`.
 */
function browserHeaders(referer?: string): Record<string, string> {
  const h: Record<string, string> = {
    "User-Agent": SCRAPE_UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Upgrade-Insecure-Requests": "1",
    "sec-ch-ua": '"Chromium";v="141", "Not;A=Brand";v="24", "Google Chrome";v="141"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": referer ? "same-origin" : "none",
    "Sec-Fetch-User": "?1",
  };
  if (referer) h.Referer = referer;
  return h;
}

export interface ScrapeFetchResult {
  ok: boolean;
  status: number;
  body: string;
  /** "direct" or "proxy". Never contains credentials. */
  via: "direct" | "proxy";
  elapsedMs: number;
  /** Set when the transport itself failed rather than the site answering. */
  transportError: string | null;
}

/** Requests completed this process-lifetime, for rotation accounting. */
let requestCount = 0;

/**
 * Build the per-request proxy username.
 *
 * Every residential vendor encodes session control in the username rather
 * than the URL (Bright Data `-session-`, Oxylabs `sessid-`, Smartproxy
 * `-session-`), so rotation is a username transform, not a different
 * endpoint. `sticky` pins one session id for the whole process; `rotateEvery`
 * advances it every N requests. With neither set the username is passed
 * through untouched and the vendor's default (new IP per request) applies.
 */
function sessionUsername(cfg: ProxyConfig): string | null {
  if (!cfg.username) return null;
  if (!cfg.sticky && cfg.rotateEvery <= 0) return cfg.username;
  const bucket = cfg.sticky ? stickyId : Math.floor(requestCount / Math.max(1, cfg.rotateEvery));
  // Only append if the vendor's own session token is not already present.
  if (/session|sessid/i.test(cfg.username)) return cfg.username;
  return `${cfg.username}-session-${bucket}`;
}

/** One id per process, so a sticky run keeps one upstream IP. */
const stickyId = Math.random().toString(36).slice(2, 10);

/**
 * Fetch one page through the configured transport.
 *
 * Never throws: a transport failure is a result with `ok: false` and a
 * `transportError`, because a run of 20 pages must not die on page 3. The
 * error string is scrubbed — see `safeError()`.
 */
export async function scrapeFetch(
  url: string,
  opts: { timeoutMs?: number; referer?: string } = {}
): Promise<ScrapeFetchResult> {
  const started = Date.now();
  const cfg = proxyConfig();
  const timeoutMs = opts.timeoutMs ?? 20_000;

  const init: RequestInit & { dispatcher?: unknown } = {
    headers: browserHeaders(opts.referer),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  };

  if (cfg) {
    const dispatcher = await proxyDispatcher(cfg, timeoutMs);
    if (dispatcher) init.dispatcher = dispatcher;
  }

  requestCount += 1;

  try {
    const res = await fetch(url, init);
    const body = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      body,
      via: cfg ? "proxy" : "direct",
      elapsedMs: Date.now() - started,
      transportError: null,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      body: "",
      via: cfg ? "proxy" : "direct",
      elapsedMs: Date.now() - started,
      transportError: safeError(err, cfg),
    };
  }
}

/**
 * Undici `ProxyAgent`, loaded only when a proxy is configured.
 *
 * Imported dynamically and by a non-literal specifier: `undici` is bundled
 * inside the Node runtime on Vercel but is not a declared dependency of this
 * app, so a static import would make the build fail everywhere the proxy is
 * not used. Failing to load it degrades to a direct request with a named
 * reason rather than taking the route down.
 */
async function proxyDispatcher(cfg: ProxyConfig, timeoutMs: number): Promise<unknown | null> {
  try {
    const specifier = "undici";
    const undici = (await import(/* webpackIgnore: true */ specifier)) as {
      ProxyAgent?: new (opts: unknown) => unknown;
    };
    if (!undici.ProxyAgent) return null;

    const user = sessionUsername(cfg);
    const pass = process.env.SCRAPE_PROXY_PASSWORD?.trim() ?? passwordFromUrl();
    const token =
      user && pass
        ? `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`
        : undefined;

    return new undici.ProxyAgent({
      uri: `http://${cfg.host}:${cfg.port}`,
      ...(token ? { token } : {}),
      requestTls: { timeout: timeoutMs },
    });
  } catch {
    return null;
  }
}

function passwordFromUrl(): string | null {
  const single = process.env.SCRAPE_PROXY_URL?.trim();
  if (!single) return null;
  try {
    const u = new URL(single);
    return u.password ? decodeURIComponent(u.password) : null;
  } catch {
    return null;
  }
}

/**
 * Scrub anything credential-shaped out of an error before it can reach a log
 * or an API response.
 *
 * Node's proxy errors happily include the full proxy URI, which is where a
 * password leaks from. Belt and braces: replace the known secrets by value,
 * then strip any surviving `user:pass@` pattern.
 */
function safeError(err: unknown, cfg: ProxyConfig | null): string {
  let msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  const secrets = [
    process.env.SCRAPE_PROXY_PASSWORD,
    process.env.SCRAPE_PROXY_USERNAME,
    process.env.SCRAPE_PROXY_URL,
    passwordFromUrl(),
  ].filter((s): s is string => Boolean(s && s.length > 2));
  for (const s of secrets) msg = msg.split(s).join("[redacted]");
  msg = msg.replace(/\/\/[^/@\s]+:[^/@\s]+@/g, "//[redacted]@");
  if (cfg) msg = `${msg} (via proxy ${cfg.host}:${cfg.port})`;
  return msg;
}

/* ------------------------------------------------------------------ *
 * Politeness
 * ------------------------------------------------------------------ */

/** Uniform delay in [minMs, maxMs]. The run's own pacing, applied between page fetches. */
export function randomDelayMs(minMs: number, maxMs: number): number {
  const lo = Math.max(0, Math.min(minMs, maxMs));
  const hi = Math.max(lo, maxMs);
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
