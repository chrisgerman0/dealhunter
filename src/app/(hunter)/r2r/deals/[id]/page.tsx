"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { assembleR2RDeal, assumptionsFromSettings } from "@/lib/r2r/assemble";
import { useDealStore } from "@/store/useDealStore";
import { useR2RSeeds } from "@/hooks/useR2RSeeds";
import { R2RDealDetail } from "@/components/r2r/r2r-deal-detail";

/**
 * Live listings have no fixed id set at build time, so this can no longer be
 * statically generated the way the mock-only version was — it resolves the
 * id against whatever `/api/r2r/seeds` currently returns (live or mock).
 */
export default function R2RDealDetailPage() {
  const params = useParams<{ id: string }>();
  const settings = useDealStore((s) => s.r2rSettings);
  const { data, loading, error } = useR2RSeeds();

  const deal = useMemo(() => {
    if (!data) return undefined;
    const seed = data.seeds.find((s) => s.id === params.id);
    if (!seed) return undefined;
    return assembleR2RDeal(seed, assumptionsFromSettings(settings));
  }, [data, params.id, settings]);

  if (loading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading live listing…</p>;
  }
  if (error) {
    return <p className="p-6 text-sm text-red-700">Live feed failed to load — {error}</p>;
  }
  if (!deal) {
    return (
      <p className="p-6 text-sm text-muted-foreground">
        That deal was not found in the current feed. It may have rotated out of the live
        catalogue.
      </p>
    );
  }
  return <R2RDealDetail deal={deal} />;
}
