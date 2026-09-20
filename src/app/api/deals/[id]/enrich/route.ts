import { NextResponse } from "next/server";
import { getDealById } from "@/data/mock-properties";
import { enrichDeal } from "@/lib/enrich/merge";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(context.params);
  const deal = getDealById(id);
  if (!deal) {
    return NextResponse.json({ error: `Deal not found: ${id}` }, { status: 404 });
  }
  const enriched = await enrichDeal(deal);
  return NextResponse.json(enriched, {
    headers: { "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400" },
  });
}
