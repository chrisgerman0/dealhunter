import type { Metadata } from "next";
import { R2RComingNext } from "@/components/r2r/coming-next";

export const metadata: Metadata = {
  title: "R2R Deal · Deal Hunter",
  description: "Florida rent-to-rent deal detail — in build.",
};

/**
 * Mirrors the BMV `/deals/[id]` route. No `generateStaticParams` yet — there
 * are no R2R deal IDs to enumerate, so this stays server-rendered on demand
 * and accepts any id without 404ing while the shell is in place.
 */
export default async function R2RDealDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await Promise.resolve(params);

  return (
    <R2RComingNext
      title="R2R deal detail"
      summary={`Full vetting breakdown for a single Florida unit (requested id: ${id}).`}
      willInclude={[
        "Photos, address and the landlord's asking rent",
        "Short-let revenue comps for the immediate area",
        "The monthly model — rent out, rent in, running costs and the resulting spread",
        "Start-up cost breakdown: deposit, furnishing, float and licensing",
        "Regulatory layer — city short-let rules, HOA restrictions and licence requirements",
        "Shortlist, dismiss and snooze, scoped to R2R mode",
      ]}
    />
  );
}
