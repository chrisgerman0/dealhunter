import { combineBooking, hasUsefulBooking, inferKind, isDirectImageUrl } from "@/lib/sea/booking-parse";
import { ImageReceiptError, fetchPublicHtml } from "@/lib/sea/fetch-booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function receiptResponse(url: string) {
  return Response.json({
    ok: true,
    kind: null,
    fields: { receiptUrl: url },
    pageRead: false,
    note: "Stored the image as the receipt. The amount stays blank.",
  });
}

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

  const target = parsed.toString();
  if (isDirectImageUrl(target)) {
    return receiptResponse(target);
  }

  let html: string | null = null;
  let pageNote: string | null = null;
  try {
    html = await fetchPublicHtml(target);
  } catch (error) {
    if (error instanceof ImageReceiptError) return receiptResponse(target);
    pageNote = error instanceof Error ? error.message : "The page could not be opened.";
  }

  const fields = combineBooking(target, html);
  if (!hasUsefulBooking(fields) && fields.price == null && !fields.receiptUrl) {
    return Response.json({
      ok: false,
      reason: pageNote ?? "This link did not include flight or hotel details. Fill the fields by hand.",
    });
  }

  const note =
    fields.price != null
      ? "Filled from the link, including the price on the page. Change anything before you save it."
      : html
        ? "Filled from the link. No price was on the page, so the amount stays blank."
        : "Read the link address. The page itself did not open, so the amount stays blank.";

  return Response.json({
    ok: true,
    kind: inferKind(fields),
    fields,
    pageRead: html != null,
    note,
  });
}
