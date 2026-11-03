"use client";

import type { R2RDeal } from "@/types/r2r";
import { useDealStore } from "@/store/useDealStore";
import { formatUSD } from "@/lib/r2r/format";
import { MapPin } from "lucide-react";
import { QualityBadge } from "@/components/deals/quality-badge";

/**
 * Schematic fallback only if the live MapLibre basemap fails to load.
 *
 * Structural copy of `src/components/map/map-fallback.tsx`, re-projected onto
 * Florida and priced in dollars. Kept separate rather than generalising the BMV
 * component, so BMV stays byte-identical.
 */
export function R2RMapFallback({ deals }: { deals: R2RDeal[] }) {
  const selectedDealId = useDealStore((s) => s.selectedDealId);
  const setSelectedDealId = useDealStore((s) => s.setSelectedDealId);

  const project = (lat: number, lng: number) => {
    // Florida peninsula + panhandle.
    const minLat = 24.3, maxLat = 31.1;
    const minLng = -87.8, maxLng = -79.8;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.min(98, Math.max(2, x)), y: Math.min(98, Math.max(2, y)) };
  };

  return (
    <div className="relative flex h-full min-h-[280px] flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="border-b bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Live map unavailable — showing schematic Florida plot.
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute left-[10%] top-[12%] text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Panhandle
        </div>
        <div className="absolute right-[26%] top-[46%] text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Orlando
        </div>
        <div className="absolute right-[10%] bottom-[22%] text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Miami
        </div>
        {deals.map((deal) => {
          const { x, y } = project(deal.coords.lat, deal.coords.lng);
          const selected = selectedDealId === deal.id;
          const colour = deal.regulatoryKill
            ? "bg-slate-400"
            : deal.quality === "excellent"
            ? "bg-emerald-600"
            : deal.quality === "good"
            ? "bg-amber-500"
            : "bg-red-500";
          return (
            <button
              key={deal.id}
              type="button"
              title={`${deal.address} · ${formatUSD(deal.monthlyRent)}/mo`}
              onClick={() => setSelectedDealId(deal.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ${colour} ${
                selected ? "z-10 size-4 ring-2 ring-emerald-700" : "size-3"
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          );
        })}
      </div>
      {selectedDealId && (
        <div className="absolute bottom-3 left-3 right-3 rounded-lg border bg-white p-3 shadow-lg">
          {(() => {
            const d = deals.find((x) => x.id === selectedDealId);
            if (!d) return null;
            return (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{d.address}</p>
                    <QualityBadge quality={d.quality} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d.zip} · {formatUSD(d.monthlyRent)}/mo · {d.beds} bed · sleeps {d.maxSleeps}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
