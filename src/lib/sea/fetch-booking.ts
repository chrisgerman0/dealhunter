import { lookup } from "node:dns/promises";

const MAX_BYTES = 800_000;
const MAX_REDIRECTS = 3;

function isPrivateIp(ip: string): boolean {
  const value = ip.toLowerCase();
  if (value.includes(":")) {
    return (
      value === "::1" ||
      value === "::" ||
      value.startsWith("fc") ||
      value.startsWith("fd") ||
      value.startsWith("fe80") ||
      value.startsWith("::ffff:127.") ||
      value.startsWith("::ffff:10.") ||
      value.startsWith("::ffff:192.168.")
    );
  }
  const parts = value.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) return true;
  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

async function assertPublicHttpUrl(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only web links can be read.");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("That link cannot be read. Fill the fields by hand.");
  }
  const records = await lookup(host, { all: true, verbatim: true });
  if (records.length === 0 || records.some((record) => isPrivateIp(record.address))) {
    throw new Error("That link cannot be read. Fill the fields by hand.");
  }
}

async function readLimited(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let received = 0;
  while (received < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    received += value.byteLength;
    chunks.push(value);
  }
  await reader.cancel().catch(() => undefined);
  const bytes = new Uint8Array(Math.min(received, MAX_BYTES));
  let offset = 0;
  for (const chunk of chunks) {
    const slice = chunk.subarray(0, Math.max(0, bytes.length - offset));
    bytes.set(slice, offset);
    offset += slice.length;
    if (offset >= bytes.length) break;
  }
  return new TextDecoder().decode(bytes);
}

export async function fetchPublicHtml(raw: string): Promise<string> {
  let current = new URL(raw.trim());
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    await assertPublicHttpUrl(current);
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
      headers: {
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.1",
        "user-agent": "DealHunterTripBoard/1.0",
      },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The link redirected without a destination.");
      current = new URL(location, current);
      continue;
    }
    if (!response.ok) {
      throw new Error("The page did not open. Fill the fields by hand.");
    }
    const type = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml|application\/json|text\/plain/i.test(type) && type.length > 0) {
      throw new Error("That page is not readable text. Fill the fields by hand.");
    }
    return readLimited(response);
  }
  throw new Error("The link redirected too many times.");
}

export { isPrivateIp };
