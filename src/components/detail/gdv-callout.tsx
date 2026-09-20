"use client";

import { formatGBP } from "@/lib/format";
import { gdvVerdict } from "@/lib/gdv";
import { cn } from "@/lib/utils";

export function GdvCallout({
  asking,
  gdv,
  live,
  thin,
  sampleSize,
}: {
  asking: number;
  gdv: number;
  live?: boolean;
  thin?: boolean;
  sampleSize?: number;
}) {
  const v = gdvVerdict(asking, gdv);
  const box =
    v.tone === "strong"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : v.tone === "modest"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-border bg-muted/40 text-foreground";

  return (
    <div className={cn("space-y-3 rounded-xl border p-3", box)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">
          {live && !thin ? "Live GDV vs asking" : thin ? "Modelled GDV (thin live sample)" : "GDV vs asking"}
        </p>
        {sampleSize != null && (
          <p className="text-[11px] text-muted-foreground">{sampleSize} nearby sales</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Asking</div>
          <div className="text-lg font-semibold">{formatGBP(asking)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {live && !thin ? "Sold median (GDV)" : "GDV"}
          </div>
          <div className="text-lg font-semibold">{formatGBP(gdv)}</div>
        </div>
      </div>
      <p className="text-sm leading-snug">{v.headline}</p>
      <p className="text-xs text-muted-foreground">{v.refinanceNote}</p>
    </div>
  );
}
