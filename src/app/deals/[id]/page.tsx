import { notFound } from "next/navigation";
import { getDealById, getAllDeals } from "@/data/mock-properties";
import { DealDetailClient } from "@/components/detail/deal-detail-client";

export function generateStaticParams() {
  return getAllDeals().map((d) => ({ id: d.id }));
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await Promise.resolve(params);
  const deal = getDealById(id);
  if (!deal) notFound();
  return <DealDetailClient deal={deal} />;
}
