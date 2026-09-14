"use client";
import type { ReactNode } from "react";

import Link from "next/link";
import Image from "next/image";
import type { Deal } from "@/types/deal";
import { formatGBP } from "@/lib/format";
import { QualityBadge } from "@/components/deals/quality-badge";
import { CapitalTagBadge } from "@/components/deals/capital-tag";
import { useDealStore } from "@/store/useDealStore";
import { X } from "lucide-react";

export function ComparisonTable({ deals }: { deals: Deal[] }) {
  const toggleShortlist = useDealStore((s) => s.toggleShortlist);

  if (deals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">Your shortlist is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Shortlist deals from Explore to compare them side-by-side.
        </p>
        <Link href="/" className="mt-4 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">Browse deals</Link>
      </div>
    );
  }

  const rows: { label: string; render: (d: Deal) => ReactNode }[] = [
    { label: "Photo", render: (d) => (
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[180px] overflow-hidden rounded-lg">
        <Image src={d.photos[0]} alt="" fill className="object-cover" sizes="180px" />
      </div>
    )},
    { label: "Address", render: (d) => (
      <Link href={`/deals/${d.id}`} className="font-medium hover:underline">{d.address}</Link>
    )},
    { label: "Postcode", render: (d) => d.postcode },
    { label: "Quality", render: (d) => <QualityBadge quality={d.quality} /> },
    { label: "Capital tag", render: (d) => <CapitalTagBadge tag={d.capitalTag} /> },
    { label: "Price", render: (d) => formatGBP(d.price) },
    { label: "Beds", render: (d) => `${d.beds} → ${d.targetBeds}` },
    { label: "Sqft", render: (d) => d.sqft.toLocaleString("en-GB") },
    { label: "GDV", render: (d) => formatGBP(d.gdv) },
    { label: "Cash-in (base)", render: (d) => formatGBP(d.cashInBase) },
    { label: "Capital stuck", render: (d) => formatGBP(d.capitalStuck) },
    { label: "Monthly income", render: (d) => formatGBP(d.monthlyIncome) },
    { label: "Conversion", render: (d) => `${d.layers.conversion.score}/10` },
    { label: "Refurb", render: (d) => formatGBP(d.layers.refurb.total) },
    { label: "DOM", render: (d) => `${d.layers.risk.daysOnMarket} days` },
    { label: "Flood zone", render: (d) => String(d.layers.regulatory.floodZone) },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="sticky left-0 bg-muted/40 p-3 text-left font-medium">Metric</th>
            {deals.map((d) => (
              <th key={d.id} className="p-3 text-left font-medium">
                <div className="flex items-start justify-between gap-2">
                  <span className="line-clamp-2">{d.area}</span>
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-muted"
                    onClick={() => toggleShortlist(d.id)}
                    aria-label="Remove from shortlist"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b last:border-0">
              <td className="sticky left-0 bg-background p-3 text-muted-foreground">{row.label}</td>
              {deals.map((d) => (
                <td key={d.id} className="p-3 align-top">
                  {row.render(d)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
