import { NextResponse } from "next/server";
import { finishSearchRefresh, resolveSearchUrl, scrapeOnePage } from "@/lib/scrape/run";
import { proxyStatus } from "@/lib/scrape/transport";
import { mirrorStoreInfo } from "@/lib/mirror/store";
import { realtorParseConfidence } from "@/lib/scrape/realtor";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * One step of a scrape run.
 *
 * The client drives the loop and calls this once per page — see the header of
 * `src/lib/scrape/run.ts` for why the loop is not server-side.
 *
 * Two actions:
 *   { action: "page",   searchUrl, page, isLastPage }  fetch + mirror one page
 *   { action: "finish", searchUrl, seenKeys }          delisting sweep
 *
 * GET returns the run *preconditions* — proxy state, store durability and
 * which adapters have a proven parser — so the UI can warn before a run
 * rather than after it fails.
 */

export async function GET() {
  return NextResponse.json({
    proxy: proxyStatus(),
    store: mirrorStoreInfo(),
    adapters: {
      zillow: {
        proven: true,
        note:
          "Parser verified against 41 real Zillow records (Tampa, 2026-11-04): price, beds, baths, sqft, ZIP and " +
          "coordinates all present. Reachability depends entirely on the egress IP.",
      },
      realtor: realtorParseConfidence(),
    },
  });
}

interface PageBody {
  action?: "page" | "finish";
  searchUrl?: string;
  page?: number;
  isLastPage?: boolean;
  seenKeys?: string[];
}

export async function POST(request: Request) {
  let body: PageBody;
  try {
    body = (await request.json()) as PageBody;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const searchUrl = typeof body.searchUrl === "string" ? body.searchUrl.trim() : "";
  if (!searchUrl) {
    return NextResponse.json({ error: "searchUrl is required." }, { status: 400 });
  }

  // Host allow-list before anything else. The server fetches this URL, so an
  // unchecked value here is an SSRF primitive — see `resolveSearchUrl`.
  if (!resolveSearchUrl(searchUrl)) {
    return NextResponse.json(
      {
        error:
          "Only zillow.com and realtor.com search URLs are accepted. " +
          "Example: https://www.zillow.com/tampa-fl/rent-houses/",
      },
      { status: 400 }
    );
  }

  try {
    if (body.action === "finish") {
      const keys = Array.isArray(body.seenKeys)
        ? body.seenKeys.filter((k): k is string => typeof k === "string")
        : [];
      const result = await finishSearchRefresh(searchUrl, keys);
      return NextResponse.json(result);
    }

    const page = Number.isFinite(body.page) ? Math.max(1, Math.floor(body.page as number)) : 1;
    const result = await scrapeOnePage({
      searchUrl,
      page,
      isLastPage: body.isLastPage === true,
    });
    return NextResponse.json(result);
  } catch (err) {
    // scrapeOnePage is written not to throw; this is the store failing.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Scrape step failed." },
      { status: 502 }
    );
  }
}
