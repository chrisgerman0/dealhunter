"use client";

import { formatUSD } from "@/lib/r2r/format";
import { spreadVerdict } from "@/lib/r2r/finance";
import type { R2RScenarioModel } from "@/types/r2r";
import { cn } from "@/lib/utils";

/**
 * The R2R answer to `src/components/detail/gdv-callout.tsx`: the first thing to
 * read on a deal page.
 *
 * BMV asks "what is it worth against what they want for it". R2R asks "what
 * does the nightly market gross against what the landlord wants every month".
 * Same box, same two-up figures, same tone colours, same headline-then-footnote
 * shape.
 */
export function R2RSpreadCallout({
  monthlyRent,
  model,
  killed,
  aggregateOnly,
  sampleSize,
}: {
  monthlyRent: number;
  model: R2RScenarioModel;
  killed?: boolean;
  /** Comps came from an area aggregate, not matched listings. */
  aggregateOnly?: boolean;
  sampleSize?: number;
}) {
  const v = spreadVerdict(monthlyRent, model, killed);
  const box =
    v.tone === "dead"
      ? "border-red-200 bg-red-50 text-red-950"
      : v.tone === "strong"
        ? "border-emerald-200 bg-emerald-50 text-emerald-950"
        : v.tone === "modest"
          ? "border-amber-200 bg-amber-50 text-amber-950"
          : "border-border bg-muted/40 text-foreground";

  return (
    <div className={cn("space-y-3 rounded-xl border p-3", box)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">
          {killed
            ? "Short-term letting is prohibited here"
            : aggregateOnly
              ? "Modelled spread (area-level comps)"
              : "Nightly gross vs the rent"}
        </p>
        {sampleSize != null && (
          <p className="text-[11px] text-muted-foreground">{sampleSize} active comps</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Rent out / mo
          </div>
          <div className="text-lg font-semibold">{formatUSD(monthlyRent)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Gross STR / mo
          </div>
          <div className="text-lg font-semibold">{formatUSD(v.grossMonthlyRevenue)}</div>
        </div>
      </div>
      <p className="text-sm leading-snug">{v.headline}</p>
      <p className="text-xs text-muted-foreground">{v.headroomNote}</p>
    </div>
  );
}
