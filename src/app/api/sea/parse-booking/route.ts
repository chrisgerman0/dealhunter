import { combineBooking, hasUsefulBooking, inferKind } from "@/lib/sea/booking-parse";
import { fetchPublicHtml } from "@/lib/sea/fetch-booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const url = body && typeof body === "object" && "url" in body ? (body as { url: unknown }).url : null;
  if (typeof url !== "string" || url.trim().length === 0) {
    return Response.json({ ok: false, reason: "Paste a booking link." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return Response.json(
      { ok: false, reason: "That is not a link. Fill the fields by hand." },
      { status: 400 }
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return Response.json(
      { ok: false, reason: "Only web links can be read. Fill the fields by hand." },
      { status: 400 }
    );
  }

  let html: string | null = null;
  let pageNote: string | null = null;
  try {
    html = await fetchPublicHtml(parsed.toString());
  } catch (error) {
    pageNote = error instanceof Error ? error.message : "The page could not be opened.";
  }

  const fields = combineBooking(parsed.toString(), html);
  if (!hasUsefulBooking(fields)) {
    return Response.json({
      ok: false,
      reason: pageNote ?? "This link did not include flight or hotel details. Fill the fields by hand.",
    });
  }

  return Response.json({
    ok: true,
    kind: inferKind(fields),
    fields,
    pageRead: html != null,
    note: html
      ? "Filled from the link. Change anything before you save it."
      : "Read the link address. The page itself did not open, so check these details.",
  });
}
