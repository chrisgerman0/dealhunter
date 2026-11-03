"use client";
import type { ReactNode } from "react";

import Link from "next/link";
import Image from "next/image";
import type { R2RDeal } from "@/types/r2r";
import {
  formatUSD,
  formatPct,
  formatPayback,
  formatRoi,
  UNIT_TYPE_LABELS,
  GEO_MATCH_LABELS,
} from "@/lib/r2r/format";
import { QualityBadge } from "@/components/deals/quality-badge";
import { CapitalTagBadge } from "@/components/deals/capital-tag";
import { useDealStore } from "@/store/useDealStore";
import { X } from "lucide-react";

/** Structural copy of `src/components/shortlist/comparison-table.tsx`. */
export function R2RComparisonTable({ deals }: { deals: R2RDeal[] }) {
  const toggleShortlist = useDealStore((s) => s.toggleShortlist);

  if (deals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">Your shortlist is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Shortlist deals from Explore to compare them side-by-side.
        </p>
        <Link
          href="/r2r"
          className="mt-4 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Browse deals
        </Link>
      </div>
    );
  }

  const rows: { label: string; render: (d: R2RDeal) => ReactNode }[] = [
    {
      label: "Photo",
      render: (d) => (
        <div className="relative mx-auto aspect-[4/3] w-full max-w-[180px] overflow-hidden rounded-lg">
          <Image src={d.photos[0]} alt="" fill className="object-cover" sizes="180px" />
        </div>
      ),
    },
    {
      label: "Address",
      render: (d) => (
        <Link href={`/r2r/deals/${d.id}`} className="font-medium hover:underline">
          {d.address}
        </Link>
      ),
    },
    { label: "ZIP", render: (d) => d.zip },
    { label: "Quality", render: (d) => <QualityBadge quality={d.quality} /> },
    { label: "Capital tag", render: (d) => <CapitalTagBadge tag={d.capitalTag} /> },
    {
      label: "STR legal",
      render: (d) =>
        d.regulatoryKill ? (
          <span className="font-medium text-red-700">No — hard kill</span>
        ) : (
          <span className="text-emerald-700">Yes</span>
        ),
    },
    { label: "Unit type", render: (d) => UNIT_TYPE_LABELS[d.unitType] },
    { label: "Rent / mo", render: (d) => formatUSD(d.monthlyRent) },
    { label: "Beds · sleeps", render: (d) => `${d.beds} · ${d.maxSleeps}` },
    { label: "Sqft", render: (d) => d.sqft.toLocaleString("en-US") },
    { label: "Gross STR / mo", render: (d) => formatUSD(d.layers.arbitrage.scenarios.base.grossMonthlyRevenue) },
    { label: "Net / mo", render: (d) => formatUSD(d.netMonthlyProfit) },
    { label: "Cash to start", render: (d) => formatUSD(d.cashToStart) },
    { label: "Cash-on-cash ROI", render: (d) => formatRoi(d.cashOnCashRoi) },
    { label: "Payback", render: (d) => formatPayback(d.paybackMonths) },
    { label: "Break-even occ.", render: (d) => formatPct(d.breakEvenOccupancy) },
    { label: "Comp occ.", render: (d) => formatPct(d.compOccupancy) },
    {
      label: "Comp basis",
      render: (d) =>
        `${GEO_MATCH_LABELS[d.layers.strComps.geoMatch]} · ${d.layers.strComps.sampleSize}${
          d.layers.strComps.thinSample ? " (thin)" : ""
        }`,
    },
    { label: "Risk", render: (d) => `${d.layers.risk.overallRiskScore}/10` },
    { label: "Flood zone", render: (d) => d.layers.regulatory.femaFloodZone },
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
                  <span className="line-clamp-2">{d.city}</span>
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
