"use client";

import Link from "next/link";
import type { Deal } from "@/types/deal";
import { formatGBP, capitalTagFromCashIn } from "@/lib/format";
import { PhotoGallery } from "./photo-gallery";
import { FloorplanPlaceholder } from "./floorplan-placeholder";
import { VettingLayers } from "./vetting-layers";
import { MiniMap } from "@/components/map/mini-map";
import { QualityBadge } from "@/components/deals/quality-badge";
import { CapitalTagBadge } from "@/components/deals/capital-tag";
import { Button } from "@/components/ui/button";
import { useDealStore } from "@/store/useDealStore";
import { Bookmark, EyeOff, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DealDetailClient({ deal: raw }: { deal: Deal }) {
  const capital = useDealStore((s) => s.settings.capital);
  const deal = { ...raw, capitalTag: capitalTagFromCashIn(raw.cashInBase, capital) };
  const toggleShortlist = useDealStore((s) => s.toggleShortlist);
  const dismiss = useDealStore((s) => s.dismiss);
  const snooze = useDealStore((s) => s.snooze);
  const isShortlisted = useDealStore((s) => s.isShortlisted(deal.id));

  return (
    <div className="px-4 py-6">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Explore
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <PhotoGallery photos={deal.photos} alt={deal.address} />
          <FloorplanPlaceholder present={deal.layers.physical.floorplanPresent} />
          <div>
            <h2 className="mb-3 text-lg font-semibold">Eight-layer vetting</h2>
            <VettingLayers deal={deal} />
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
              {deal.postcode} · {deal.city === "liverpool" ? "Liverpool" : "Manchester"} ·{" "}
              {deal.propertyType} · {deal.tenure}
            </p>
            <p className="text-3xl font-bold text-emerald-700">{formatGBP(deal.price)}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Stat label="Beds" value={`${deal.beds} → ${deal.targetBeds}`} />
            <Stat label="Sqft" value={deal.sqft.toLocaleString("en-GB")} />
            <Stat label="GDV" value={formatGBP(deal.gdv)} />
            <Stat label="Capital stuck" value={formatGBP(deal.capitalStuck)} />
            <Stat label="Cash-in (base)" value={formatGBP(deal.cashInBase)} />
            <Stat label="Income / mo" value={formatGBP(deal.monthlyIncome)} />
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
            <a href={deal.listingUrl} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"><ExternalLink className="size-4" />View listing</a>
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
