import { notFound } from "next/navigation";
import { getR2RDealById, R2R_SEEDS } from "@/data/mock-r2r-properties";
import { R2RDealDetail } from "@/components/r2r/r2r-deal-detail";

/** Mirrors the BMV deal route: every seed is pre-rendered at build time. */
export function generateStaticParams() {
  return R2R_SEEDS.map((s) => ({ id: s.id }));
}

export default async function R2RDealDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await Promise.resolve(params);
  const deal = getR2RDealById(id);
  if (!deal) notFound();
  return <R2RDealDetail deal={deal} />;
}
