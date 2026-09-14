"use client";

import type { Deal } from "@/types/deal";
import { useDealStore } from "@/store/useDealStore";
import { formatGBP } from "@/lib/format";
import { MapPin } from "lucide-react";
import { QualityBadge } from "@/components/deals/quality-badge";

export function MapFallback({ deals }: { deals: Deal[] }) {
  const selectedDealId = useDealStore((s) => s.selectedDealId);
  const setSelectedDealId = useDealStore((s) => s.setSelectedDealId);

  // Project lat/lng into a simple 2D plot for Liverpool + Manchester corridor
  const project = (lat: number, lng: number) => {
    const minLat = 53.35, maxLat = 53.55;
    const minLng = -3.05, maxLng = -2.1;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.min(98, Math.max(2, x)), y: Math.min(98, Math.max(2, y)) };
  };

  return (
    <div className="relative flex h-full min-h-[280px] flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="border-b bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Mapbox token missing — showing schematic plot. Add{" "}
        <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable the live map.
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute left-[8%] top-[35%] text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Liverpool
        </div>
        <div className="absolute right-[12%] top-[28%] text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Manchester
        </div>
        {deals.map((deal) => {
          const { x, y } = project(deal.coords.lat, deal.coords.lng);
          const selected = selectedDealId === deal.id;
          const colour =
            deal.quality === "excellent"
              ? "bg-emerald-600"
              : deal.quality === "good"
              ? "bg-amber-500"
              : "bg-red-500";
          return (
            <button
              key={deal.id}
              type="button"
              title={`${deal.address} · ${formatGBP(deal.price)}`}
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
                    {d.postcode} · {formatGBP(d.price)} · {d.beds}→{d.targetBeds} beds
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
