"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, EyeOff, Clock, ExternalLink, BedDouble, Ruler, Ban } from "lucide-react";
import type { R2RDeal } from "@/types/r2r";
import { formatUSD, formatRoi } from "@/lib/r2r/format";
import { QualityBadge } from "@/components/deals/quality-badge";
import { CapitalTagBadge } from "@/components/deals/capital-tag";
import { Button } from "@/components/ui/button";
import { useDealStore } from "@/store/useDealStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface R2RDealCardProps {
  deal: R2RDeal;
  selected?: boolean;
  onSelect?: () => void;
}

/**
 * Deliberately a line-for-line structural copy of `src/components/deals/deal-card.tsx`
 * — same article shell, same 16/10 photo, same badge corners, same three-up
 * metric strip, same action row. Only the figures and the currency differ.
 *
 * Chris's requirement, 2026-11-03: "I want the exact same UI mate."
 *
 * The one addition BMV has no equivalent for is the regulatory kill strip: an
 * STR-illegal address is a hard kill, so it cannot be left to a badge colour.
 */
export function R2RDealCard({ deal, selected, onSelect }: R2RDealCardProps) {
  const toggleShortlist = useDealStore((s) => s.toggleShortlist);
  const dismiss = useDealStore((s) => s.dismiss);
  const snooze = useDealStore((s) => s.snooze);
  const isShortlisted = useDealStore((s) => s.isShortlisted(deal.id));

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md",
        selected && "ring-2 ring-emerald-600",
        deal.regulatoryKill && "opacity-90"
      )}
      onClick={onSelect}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={deal.photos[0]}
          alt={deal.address}
          fill
          className="object-cover transition-transform group-hover:scale-[1.02]"
          sizes="(max-width:768px) 100vw, 400px"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <QualityBadge quality={deal.quality} />
          <CapitalTagBadge tag={deal.capitalTag} />
        </div>
        <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
          {formatUSD(deal.monthlyRent)}/mo rent
        </div>
        {deal.isMock && (
          <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
            Mock
          </div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <div>
          <Link
            href={`/r2r/deals/${deal.id}`}
            className="line-clamp-1 font-medium hover:text-emerald-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {deal.address}
          </Link>
          <p className="text-xs text-muted-foreground">
            {deal.zip} · {deal.city} · {deal.unitType.replace(/_/g, "-")}
          </p>
        </div>

        {deal.regulatoryKill && (
          <p className="flex items-start gap-1.5 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-800">
            <Ban className="mt-px size-3.5 shrink-0" />
            <span className="line-clamp-2">
              {deal.layers.regulatory.killReasons[0] ?? "Short-term letting is not legal here."}
            </span>
          </p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="size-3.5" />
            {deal.beds} bed · sleeps {deal.maxSleeps}
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler className="size-3.5" />
            {deal.sqft.toLocaleString("en-US")} sqft
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2 text-center text-xs">
          <div>
            <div className="text-muted-foreground">Net / mo</div>
            <div className="font-semibold">{formatUSD(deal.netMonthlyProfit, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Cash in</div>
            <div className="font-semibold">{formatUSD(deal.cashToStart, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">ROI</div>
            <div className="font-semibold">{formatRoi(deal.cashOnCashRoi)}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant={isShortlisted ? "default" : "outline"}
            className={cn(isShortlisted && "bg-emerald-600 hover:bg-emerald-700")}
            onClick={() => {
              toggleShortlist(deal.id);
              toast.success(isShortlisted ? "Removed from shortlist" : "Added to shortlist");
            }}
          >
            <Bookmark className={cn("size-3.5", isShortlisted && "fill-current")} />
            Shortlist
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              dismiss(deal.id);
              toast.message("Deal dismissed");
            }}
          >
            <EyeOff className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              snooze(deal.id, 7);
              toast.message("Snoozed for 7 days");
            }}
          >
            <Clock className="size-3.5" />
          </Button>
          <a
            href={deal.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 items-center justify-center rounded-lg px-2.5 text-sm hover:bg-muted"
          >
            <ExternalLink className="size-3.5" />
          </a>
          <Link
            href={`/r2r/deals/${deal.id}`}
            className="inline-flex h-7 items-center justify-center rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
