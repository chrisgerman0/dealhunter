"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { R2RDeal } from "@/types/r2r";
import { getR2RDealById } from "@/data/mock-r2r-properties";
import { assumptionsFromSettings } from "@/lib/r2r/assemble";
import {
  formatUSD,
  formatPct,
  formatPp,
  formatPayback,
  formatRoi,
  UNIT_TYPE_LABELS,
} from "@/lib/r2r/format";
import { ACTIVE_COMP_SOURCE } from "@/lib/r2r/comps";
import { PhotoGallery } from "@/components/detail/photo-gallery";
import { R2RVettingLayers } from "./r2r-vetting-layers";
import { R2RSpreadCallout } from "./r2r-spread-callout";
import { MiniMap } from "@/components/map/mini-map";
import { QualityBadge } from "@/components/deals/quality-badge";
import { CapitalTagBadge } from "@/components/deals/capital-tag";
import { Button } from "@/components/ui/button";
import { useDealStore } from "@/store/useDealStore";
import { Bookmark, EyeOff, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Structural copy of `src/components/detail/deal-detail-client.tsx` — same back
 * link, same provenance banner slot, same 1.4fr/1fr split with the gallery and
 * the vetting accordion on the left and a sticky summary rail on the right,
 * same eight-cell stat grid, same action row, same mini map at the bottom.
 *
 * BMV re-tags `capitalTag` from live settings. R2R re-derives the whole deal,
 * because R2R settings move the furnishing budget, the cleaning fee and the
 * occupancy assumption — all of which change the figures, not just the badge.
 */
export function R2RDealDetail({ deal: raw }: { deal: R2RDeal }) {
  const settings = useDealStore((s) => s.r2rSettings);
  const toggleShortlist = useDealStore((s) => s.toggleShortlist);
  const dismiss = useDealStore((s) => s.dismiss);
  const snooze = useDealStore((s) => s.snooze);
  const isShortlisted = useDealStore((s) => s.isShortlisted(raw.id));

  const deal = useMemo(
    () => getR2RDealById(raw.id, assumptionsFromSettings(settings)) ?? raw,
    [raw, settings]
  );

  const { layers } = deal;
  const base = layers.arbitrage.scenarios.base;

  return (
    <div className="px-4 py-6">
      <div className="mb-4">
        <Link
          href="/r2r"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Explore
        </Link>
      </div>

      {deal.isMock && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Mock listing. Comp source: <strong>{ACTIVE_COMP_SOURCE.label}</strong> —{" "}
          {ACTIVE_COMP_SOURCE.description} No figure on this page is a real market observation.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <PhotoGallery photos={deal.photos} alt={deal.address} />
          <div>
            <h2 className="mb-3 text-lg font-semibold">Nine-layer vetting</h2>
            <R2RVettingLayers deal={deal} />
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <QualityBadge quality={deal.quality} />
              <CapitalTagBadge tag={deal.capitalTag} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{deal.address}</h1>
            <p className="text-muted-foreground">
              {deal.zip} · {deal.city}, {deal.county} County · {UNIT_TYPE_LABELS[deal.unitType]}
            </p>
            <p className="text-3xl font-bold text-emerald-700">
              {formatUSD(deal.monthlyRent)}
              <span className="text-base font-medium text-muted-foreground">/mo rent</span>
            </p>
          </div>

          <R2RSpreadCallout
            monthlyRent={deal.monthlyRent}
            model={base}
            killed={deal.regulatoryKill}
            aggregateOnly={layers.strComps.comps.length === 0}
            sampleSize={layers.strComps.sampleSize}
          />

          <div className="grid grid-cols-2 gap-2">
            <Stat label="Beds" value={`${deal.beds} · sleeps ${deal.maxSleeps}`} />
            <Stat label="Sqft" value={deal.sqft.toLocaleString("en-US")} />
            <Stat label="Net / mo" value={formatUSD(deal.netMonthlyProfit)} />
            <Stat label="Cash to start" value={formatUSD(deal.cashToStart)} />
            <Stat label="Cash-on-cash ROI" value={formatRoi(deal.cashOnCashRoi)} />
            <Stat label="Payback" value={formatPayback(deal.paybackMonths)} />
            <Stat label="Break-even occ." value={formatPct(deal.breakEvenOccupancy)} />
            <Stat label="Headroom" value={formatPp(base.occupancyHeadroom)} />
          </div>

          <p className="text-sm text-muted-foreground">{deal.description}</p>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={isShortlisted ? "default" : "outline"}
              className={cn(isShortlisted && "bg-emerald-600 hover:bg-emerald-700")}
              onClick={() => {
                toggleShortlist(deal.id);
                toast.success(isShortlisted ? "Removed from shortlist" : "Added to shortlist");
              }}
            >
              <Bookmark className={cn("size-4", isShortlisted && "fill-current")} />
              Shortlist
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                dismiss(deal.id);
                toast.message("Deal dismissed");
              }}
            >
              <EyeOff className="size-4" />
              Dismiss
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                snooze(deal.id, 7);
                toast.message("Snoozed for 7 days");
              }}
            >
              <Clock className="size-4" />
              Snooze
            </Button>
            <a
              href={deal.listingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <ExternalLink className="size-4" />
              View listing
            </a>
          </div>

          <MiniMap coords={deal.coords} label={deal.address} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
