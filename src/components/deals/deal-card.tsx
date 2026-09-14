"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, EyeOff, Clock, ExternalLink, BedDouble, Ruler } from "lucide-react";
import type { Deal } from "@/types/deal";
import { formatGBP } from "@/lib/format";
import { QualityBadge } from "./quality-badge";
import { CapitalTagBadge } from "./capital-tag";
import { Button } from "@/components/ui/button";
import { useDealStore } from "@/store/useDealStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DealCardProps {
  deal: Deal;
  selected?: boolean;
  onSelect?: () => void;
}

export function DealCard({ deal, selected, onSelect }: DealCardProps) {
  const toggleShortlist = useDealStore((s) => s.toggleShortlist);
  const dismiss = useDealStore((s) => s.dismiss);
  const snooze = useDealStore((s) => s.snooze);
  const isShortlisted = useDealStore((s) => s.isShortlisted(deal.id));

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md",
        selected && "ring-2 ring-emerald-600"
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
          {formatGBP(deal.price)}
        </div>
      </div>

      <div className="space-y-2 p-3">
        <div>
          <Link
            href={`/deals/${deal.id}`}
            className="line-clamp-1 font-medium hover:text-emerald-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {deal.address}
          </Link>
          <p className="text-xs text-muted-foreground">
            {deal.postcode} · {deal.city === "liverpool" ? "Liverpool" : "Manchester"} · {deal.tenure}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="size-3.5" />
            {deal.beds}→{deal.targetBeds} beds
          </span>
          <span className="inline-flex items-center gap-1">
            <Ruler className="size-3.5" />
            {deal.sqft.toLocaleString("en-GB")} sqft
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2 text-center text-xs">
          <div>
            <div className="text-muted-foreground">GDV</div>
            <div className="font-semibold">{formatGBP(deal.gdv, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Stuck</div>
            <div className="font-semibold">{formatGBP(deal.capitalStuck, true)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Income</div>
            <div className="font-semibold">{formatGBP(deal.monthlyIncome, true)}/mo</div>
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
            href={`/deals/${deal.id}`}
            className="inline-flex h-7 items-center justify-center rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
