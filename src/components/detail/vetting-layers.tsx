"use client";

import type { Deal } from "@/types/deal";
import { formatGBP } from "@/lib/format";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CompsTable } from "./comps-table";
import { FinancialModel } from "./financial-model";
import { LiveBadge } from "./live-badge";
import {
  Home,
  Shapes,
  PoundSterling,
  Hammer,
  Calculator,
  Wallet,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

export function VettingLayers({ deal }: { deal: Deal }) {
  const { layers } = deal;

  return (
    <Accordion multiple defaultValue={["comps", "financial"]} className="rounded-xl border px-3">
      <AccordionItem value="physical">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Home className="size-4 text-emerald-600" />
            1. Physical
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <dl className="grid gap-2 sm:grid-cols-2 text-sm">
            <Row label="Tenure" value={layers.physical.tenure} />
            <Row label="Floorplan present" value={layers.physical.floorplanPresent ? "Yes" : "No"} />
            <Row label="Sqft" value={layers.physical.sqft.toLocaleString("en-GB")} />
            <Row label="Age category" value={layers.physical.ageCategory} />
            {layers.physical.leaseYearsRemaining != null && (
              <Row label="Lease years remaining" value={String(layers.physical.leaseYearsRemaining)} />
            )}
          </dl>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="conversion">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Shapes className="size-4 text-emerald-600" />
            2. Conversion score
            <Badge variant="secondary">{layers.conversion.score}/10</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <p className="text-sm">
            {layers.conversion.currentBeds} → {layers.conversion.targetBeds} beds
          </p>
          <p className="text-sm text-muted-foreground">{layers.conversion.conversionNotes}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-emerald-700">Positives</p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {layers.conversion.positives.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-red-700">Negatives</p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {layers.conversion.negatives.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="comps">
        <AccordionTrigger>
          <span className="flex flex-wrap items-center gap-2">
            <PoundSterling className="size-4 text-emerald-600" />
            3. Sold comps
            <LiveBadge meta={deal.enrichment?.comps} />
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Nearby HM Land Registry sold prices. Realistic GDV is the median; stretch is the 75th percentile; conservative is the 25th.
          </p>
          <dl className="grid gap-2 sm:grid-cols-2 text-sm">
            <Row label="Median (realistic GDV)" value={formatGBP(layers.soldComps.median)} />
            <Row label="Sample size" value={String(layers.soldComps.sampleSize)} />
            <Row label="GDV stretch (75th)" value={formatGBP(layers.soldComps.gdvStretch)} />
            <Row label="GDV conservative (25th)" value={formatGBP(layers.soldComps.gdvConservative)} />
          </dl>
          {layers.soldComps.thinSample && (
            <p className="text-sm text-amber-800">
              Thin sample — modelled GDV bands kept. Price Paid Data does not record bedroom counts.
            </p>
          )}
          {layers.soldComps.sourceNote && (
            <p className="text-xs text-muted-foreground">{layers.soldComps.sourceNote}</p>
          )}
          <CompsTable comps={layers.soldComps.comps} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="refurb">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Hammer className="size-4 text-emerald-600" />
            4. Refurb breakdown
            <Badge variant="outline">{formatGBP(layers.refurb.total)}</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <dl className="grid gap-2 sm:grid-cols-2 text-sm">
            {(
              [
                ["Kitchen", layers.refurb.kitchen],
                ["Bathrooms", layers.refurb.bathrooms],
                ["Flooring", layers.refurb.flooring],
                ["Paint", layers.refurb.paint],
                ["Electrics", layers.refurb.electrics],
                ["Boiler", layers.refurb.boiler],
                ["Roof", layers.refurb.roof],
                ["Damp", layers.refurb.damp],
                ["Bedroom conversion", layers.refurb.bedroomConversion],
                ["SA finish", layers.refurb.saFinish],
                [`Contingency (${layers.refurb.contingencyPct}%)`, layers.refurb.contingencyAmount],
                ["Total", layers.refurb.total],
              ] as const
            ).map(([label, value]) => (
              <Row key={label} label={label} value={formatGBP(value)} strong={label === "Total"} />
            ))}
          </dl>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="financial">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Calculator className="size-4 text-emerald-600" />
            5. Financial model
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <FinancialModel deal={deal} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="income">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Wallet className="size-4 text-emerald-600" />
            6. Income
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          <dl className="grid gap-2 sm:grid-cols-2 text-sm">
            <Row label="Airbnb 75th pct (mo)" value={formatGBP(layers.income.airbnb75th)} />
            <Row
              label={`Council lease (${layers.income.councilLeaseLhaPct}% LHA)`}
              value={formatGBP(layers.income.councilLeaseMonthly)}
            />
            <Row label="Hybrid (mo)" value={formatGBP(layers.income.hybridMonthly)} />
            <Row label="LHA weekly" value={formatGBP(layers.income.lhaWeekly)} />
          </dl>
          <p className="text-xs text-muted-foreground">{layers.income.notes}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="regulatory">
        <AccordionTrigger>
          <span className="flex flex-wrap items-center gap-2">
            <ShieldAlert className="size-4 text-emerald-600" />
            7. Regulatory flags
            {layers.regulatory.flags.length > 0 && (
              <Badge variant="destructive">{layers.regulatory.flags.length}</Badge>
            )}
            <LiveBadge meta={deal.enrichment?.flood} />
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2">
          <dl className="grid gap-2 sm:grid-cols-2 text-sm">
            <Row label="Article 4" value={yn(layers.regulatory.article4)} />
            <Row label="Selective licensing" value={yn(layers.regulatory.selectiveLicensing)} />
            <Row label="Additional HMO" value={yn(layers.regulatory.additionalHmo)} />
            <Row label="Conservation" value={yn(layers.regulatory.conservation)} />
            <Row label="Flood zone" value={String(layers.regulatory.floodZone)} />
            {layers.regulatory.floodRisk && (
              <Row label="Flood risk" value={layers.regulatory.floodRisk} />
            )}
          </dl>
          {deal.enrichment?.flood?.note && (
            <p className="text-xs text-muted-foreground">{deal.enrichment.flood.note}</p>
          )}
          {layers.regulatory.flags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {layers.regulatory.flags.map((f) => (
                <Badge key={f} variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
                  {f}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No major flags on file.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="risk">
        <AccordionTrigger>
          <span className="flex flex-wrap items-center gap-2">
            <AlertTriangle className="size-4 text-emerald-600" />
            8. Risk & motivation
            <Badge variant="secondary">{layers.risk.dealQualityScore}/10</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <dl className="grid gap-2 sm:grid-cols-2 text-sm">
            <Row label="Days on market" value={String(layers.risk.daysOnMarket)} />
            <Row label="Price reductions" value={String(layers.risk.priceReductions)} />
            <Row label="Auction" value={yn(layers.risk.auction)} />
            <Row label="Ofsted" value={layers.risk.ofstedRating} />
            <Row label="Transport" value={`${layers.risk.transportScore}/10`} />
            <Row label="Green space" value={`${layers.risk.greenSpaceScore}/10`} />
          </dl>
          {layers.risk.distressedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {layers.risk.distressedKeywords.map((k) => (
                <Badge key={k} variant="secondary">
                  {k}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">{layers.risk.reasoning}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function yn(v: boolean) {
  return v ? "Yes" : "No";
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-3 rounded-md border px-3 py-2 ${strong ? "font-semibold" : ""}`}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="capitalize text-right">{value}</dd>
    </div>
  );
}
