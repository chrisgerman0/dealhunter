"use client";

import type { R2RDeal } from "@/types/r2r";
import {
  formatUSD,
  formatUSDPerMonth,
  formatUSDPerNight,
  formatPct,
  formatPp,
  formatPayback,
  formatRoi,
  UNIT_TYPE_LABELS,
  GEO_MATCH_LABELS,
  LEGALITY_LABELS,
  ZONING_STATUS_LABELS,
  SUBLET_CONSENT_LABELS,
  PET_POLICY_LABELS,
  GUEST_SEGMENT_LABELS,
  SCENARIO_LABELS,
} from "@/lib/r2r/format";
import { SEASONALITY_MODEL_LABELS } from "@/lib/r2r/seasonality";
import { MARKET_PROFILES } from "@/lib/r2r/markets";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { R2RCompsTable } from "./r2r-comps-table";
import {
  Home,
  BedDouble,
  DollarSign,
  Sofa,
  Calculator,
  CalendarRange,
  ShieldAlert,
  AlertTriangle,
  Megaphone,
} from "lucide-react";

/**
 * Structural copy of `src/components/detail/vetting-layers.tsx`.
 *
 * Same accordion shell, same numbered triggers with an emerald icon and a
 * summary badge, same `Row` definition-list grid, same open-by-default on the
 * two layers that decide the deal. BMV has eight layers; R2R has nine — the
 * extra one is seasonality, which has no BMV equivalent because a UK purchase
 * does not lose money every September.
 */
export function R2RVettingLayers({ deal }: { deal: R2RDeal }) {
  const { layers } = deal;
  const profile = MARKET_PROFILES[deal.market];
  const base = layers.arbitrage.scenarios.base;

  return (
    <Accordion multiple defaultValue={["comps", "arbitrage"]} className="rounded-xl border px-3">
      <AccordionItem value="physical">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Home className="size-4 text-emerald-600" />
            1. Physical
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Row label="Unit type" value={UNIT_TYPE_LABELS[layers.physical.unitType]} />
            <Row label="Beds / baths" value={`${layers.physical.beds} / ${layers.physical.baths}`} />
            <Row label="Sqft" value={layers.physical.sqft.toLocaleString("en-US")} />
            <Row
              label="Pool"
              value={
                layers.physical.pool
                  ? layers.physical.poolHeated
                    ? "Yes — heated"
                    : "Yes — unheated"
                  : "No"
              }
            />
            <Row label="Parking" value={`${layers.physical.parkingSpaces} space(s)`} />
            <Row
              label="A/C age"
              value={
                layers.physical.acAgeYears == null
                  ? "Unknown"
                  : `${layers.physical.acAgeYears} years`
              }
            />
            <Row label="Pets" value={PET_POLICY_LABELS[layers.physical.petPolicy]} />
            <Row
              label="Furnished on arrival"
              value={layers.physical.furnishedOnArrival ? "Yes" : "No"}
            />
            {layers.physical.yearBuilt != null && (
              <Row label="Year built" value={String(layers.physical.yearBuilt)} />
            )}
            {layers.physical.hoa.present && (
              <Row label="HOA fee" value={formatUSDPerMonth(layers.physical.hoa.monthlyFee)} />
            )}
          </dl>
          {layers.physical.acAgeYears != null && layers.physical.acAgeYears >= 12 && (
            <p className="mt-3 text-sm text-amber-800">
              A/C is {layers.physical.acAgeYears} years old. Florida units die at 12–15 years and a
              dead A/C in July cancels bookings — price a replacement into the first year.
            </p>
          )}
          {layers.physical.hoa.present && (
            <p className="mt-3 text-sm text-muted-foreground">{layers.physical.hoa.note}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">{layers.physical.notes}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sleeps">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <BedDouble className="size-4 text-emerald-600" />
            2. Sleeps configuration
            <Badge variant="secondary">{layers.sleeps.score}/10</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <p className="text-sm">
            Sleeps {layers.sleeps.baseSleeps} → {layers.sleeps.maxSleeps} for{" "}
            {formatUSD(layers.sleeps.setupCost)} of furniture
          </p>
          <p className="text-sm text-muted-foreground">{layers.sleeps.notes}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-emerald-700">Positives</p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {layers.sleeps.positives.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-red-700">Negatives</p>
              {layers.sleeps.negatives.length > 0 ? (
                <ul className="list-disc space-y-1 pl-4 text-sm">
                  {layers.sleeps.negatives.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">None recorded.</p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Sleeps drives the nightly rate harder than bedroom count does, and adding sleeps is
            furniture rather than building work — this is the R2R equivalent of BMV&apos;s bedroom
            conversion.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="comps">
        <AccordionTrigger>
          <span className="flex flex-wrap items-center gap-2">
            <DollarSign className="size-4 text-emerald-600" />
            3. Airbnb comps
            <Badge variant="outline">{GEO_MATCH_LABELS[layers.strComps.geoMatch]}</Badge>
            {layers.strComps.thinSample && (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
                Thin sample
              </Badge>
            )}
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Nearby active short-let listings, matched by radius. This is the layer that decides the
            deal — it is the R2R equivalent of BMV&apos;s sold comps and GDV.
          </p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Row label="Geo match" value={GEO_MATCH_LABELS[layers.strComps.geoMatch]} />
            <Row label="Radius" value={`${layers.strComps.radiusMeters} m`} />
            <Row label="Sample size" value={String(layers.strComps.sampleSize)} />
            <Row label="Annual occupancy" value={formatPct(layers.strComps.annualOccupancy)} />
            <Row label="Median nightly — peak" value={formatUSD(layers.strComps.medianNightly.peak)} />
            <Row
              label="Median nightly — shoulder"
              value={formatUSD(layers.strComps.medianNightly.shoulder)}
            />
            <Row label="Median nightly — off" value={formatUSD(layers.strComps.medianNightly.off)} />
            <Row label="RevPAR" value={formatUSDPerNight(layers.strComps.revPar)} />
            {layers.strComps.medianReviewScore != null && (
              <Row
                label="Median review score"
                value={String(layers.strComps.medianReviewScore)}
              />
            )}
          </dl>
          {layers.strComps.thinSample && (
            <p className="text-sm text-amber-800">
              Thin sample — bands kept, but annual occupancy falls back to the configured
              assumption rather than being read off this few listings.
            </p>
          )}
          {layers.strComps.sourceNote && (
            <p className="text-xs text-muted-foreground">{layers.strComps.sourceNote}</p>
          )}
          <R2RCompsTable comps={layers.strComps.comps} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="setup">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Sofa className="size-4 text-emerald-600" />
            4. Furnishing &amp; setup capital
            <Badge variant="outline">{formatUSD(layers.setupCapital.total)}</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {(
              [
                [
                  `Bedroom furniture (${layers.setupCapital.bedrooms} × ${formatUSD(
                    layers.setupCapital.furniturePerBedroom
                  )})`,
                  layers.setupCapital.furnitureBedrooms,
                ],
                ["Living & dining", layers.setupCapital.livingAndDining],
                ["Sleeps upgrade", layers.setupCapital.sleepsUpgrade],
                ["Linens", layers.setupCapital.linens],
                ["Kitchen kit", layers.setupCapital.kitchenKit],
                ["Smart lock", layers.setupCapital.smartLock],
                ["Wifi & tech", layers.setupCapital.wifiAndTech],
                ["Photography", layers.setupCapital.photography],
                ["Listing setup", layers.setupCapital.listingSetup],
                ["Licence & registration fees", layers.setupCapital.licenceFees],
                ["Security deposit (refundable)", layers.setupCapital.securityDeposit],
                ["First month rent", layers.setupCapital.firstMonthRent],
                ["Last month rent", layers.setupCapital.lastMonthRent],
                [
                  `Contingency (${layers.setupCapital.contingencyPct}%)`,
                  layers.setupCapital.contingencyAmount,
                ],
                ["Total cash to start", layers.setupCapital.total],
                ["Sunk (non-refundable)", layers.setupCapital.sunkCapital],
              ] as const
            ).map(([label, value]) => (
              <Row
                key={label}
                label={label}
                value={formatUSD(value)}
                strong={label === "Total cash to start"}
              />
            ))}
          </dl>
          <p className="text-xs text-muted-foreground">
            Contingency is applied to the fit-out and licensing only. Rent and deposit are known to
            the dollar, and padding them would overstate the cash actually needed.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="arbitrage">
        <AccordionTrigger>
          <span className="flex flex-wrap items-center gap-2">
            <Calculator className="size-4 text-emerald-600" />
            5. Arbitrage model
            <Badge variant="outline">{formatRoi(base.cashOnCashRoi)} ROI</Badge>
            {layers.arbitrage.killed && <Badge variant="destructive">Killed</Badge>}
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-2 text-left font-medium">Scenario</th>
                  <th className="p-2 text-left font-medium">Occupancy</th>
                  <th className="p-2 text-left font-medium">Blended ADR</th>
                  <th className="p-2 text-left font-medium">Gross / mo</th>
                  <th className="p-2 text-left font-medium">Net / mo</th>
                  <th className="p-2 text-left font-medium">ROI</th>
                  <th className="p-2 text-left font-medium">Payback</th>
                </tr>
              </thead>
              <tbody>
                {(["best", "base", "worst"] as const).map((key) => {
                  const m = layers.arbitrage.scenarios[key];
                  return (
                    <tr key={key} className={`border-b last:border-0 ${key === "base" ? "font-semibold" : ""}`}>
                      <td className="p-2">{SCENARIO_LABELS[key]}</td>
                      <td className="p-2">{formatPct(m.occupancy)}</td>
                      <td className="p-2">{formatUSD(m.adrBlended)}</td>
                      <td className="p-2">{formatUSD(m.grossMonthlyRevenue)}</td>
                      <td className={`p-2 ${m.netMonthlyProfit < 0 ? "text-red-700" : ""}`}>
                        {formatUSD(m.netMonthlyProfit)}
                      </td>
                      <td className="p-2">{formatRoi(m.cashOnCashRoi)}</td>
                      <td className="p-2">{formatPayback(m.paybackMonths)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Base monthly costs
            </p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <Row label="Rent to landlord" value={formatUSD(base.costs.rentToLandlord)} />
              <Row label="Cleaning (net of guest fee)" value={formatUSD(base.costs.cleaning)} />
              <Row label="Utilities" value={formatUSD(base.costs.utilities)} />
              <Row label="Internet" value={formatUSD(base.costs.internet)} />
              <Row label="Insurance" value={formatUSD(base.costs.insurance)} />
              <Row label="Supplies & maintenance" value={formatUSD(base.costs.suppliesMaintenance)} />
              <Row label="PMS" value={formatUSD(base.costs.pms)} />
              <Row label="Platform fee" value={formatUSD(base.costs.platformFee)} />
              <Row label="Management fee" value={formatUSD(base.costs.managementFee)} />
              <Row label="HOA fee" value={formatUSD(base.costs.hoaFee)} />
              <Row label="Total costs" value={formatUSD(base.costs.total)} strong />
            </dl>
            {base.costs.hostRemittedTax > 0 && (
              <p className="mt-2 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
                Plus {formatUSD(base.costs.hostRemittedTax)}/mo of{" "}
                {layers.regulatory.county} County bed tax passing through the account. Charged to
                the guest on top of the nightly rate, so it is <strong>not</strong> a cost and is
                not in the total above — but it is the host&apos;s job to remit it, and not doing so
                is the most common Florida compliance failure.
              </p>
            )}
          </div>

          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Row label="Break-even occupancy" value={formatPct(base.breakEvenOccupancy)} />
            <Row label="Comp occupancy" value={formatPct(base.occupancy)} />
            <Row label="Headroom" value={formatPp(base.occupancyHeadroom)} strong />
            <Row label="Cash invested" value={formatUSD(base.cashInvested)} />
          </dl>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
              Why this verdict
            </p>
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              {layers.arbitrage.scoreNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              All four gates — ROI, net profit, payback and occupancy headroom — must clear a tier
              for the deal to earn it. Thresholds live in{" "}
              <code className="font-mono">src/lib/r2r/thresholds.ts</code>.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="seasonality">
        <AccordionTrigger>
          <span className="flex flex-wrap items-center gap-2">
            <CalendarRange className="size-4 text-emerald-600" />
            6. Revenue &amp; seasonality
            <Badge variant="secondary">
              {layers.seasonality.seasonalityIndex.toFixed(2)}× peak-to-off
            </Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Row label="Curve" value={SEASONALITY_MODEL_LABELS[layers.seasonality.model]} />
            <Row label="Peak months" value={layers.seasonality.peakMonths.join(", ") || "None"} />
            <Row label="Annual revenue (curve)" value={formatUSD(layers.seasonality.annualRevenue)} />
            <Row
              label="Annual revenue (flat average)"
              value={formatUSD(layers.seasonality.flatAverageAnnualRevenue)}
            />
          </dl>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="p-2 text-left font-medium">Month</th>
                  <th className="p-2 text-left font-medium">Season</th>
                  <th className="p-2 text-left font-medium">Occupancy</th>
                  <th className="p-2 text-left font-medium">ADR</th>
                  <th className="p-2 text-left font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {layers.seasonality.months.map((m) => (
                  <tr key={m.month} className="border-b last:border-0">
                    <td className="p-2 font-medium">{m.month}</td>
                    <td className="p-2 capitalize">{m.season}</td>
                    <td className="p-2">{formatPct(m.occupancy)}</td>
                    <td className="p-2">{formatUSD(m.adr)}</td>
                    <td className="p-2">{formatUSD(m.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground">{layers.seasonality.notes}</p>

          <div className="rounded-lg border border-dashed p-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Mid-term fallback
            </p>
            <p className="mt-1 text-sm">
              {formatUSDPerMonth(layers.seasonality.midTermFallback.monthlyRent)} at a{" "}
              {layers.seasonality.midTermFallback.minimumStayNights}-night minimum
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {layers.seasonality.midTermFallback.note}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="regulatory">
        <AccordionTrigger>
          <span className="flex flex-wrap items-center gap-2">
            <ShieldAlert className="size-4 text-emerald-600" />
            7. Regulatory
            {layers.regulatory.kill ? (
              <Badge variant="destructive">Hard kill</Badge>
            ) : (
              layers.regulatory.flags.length > 0 && (
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
                  {layers.regulatory.flags.length}
                </Badge>
              )
            )}
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          {layers.regulatory.killReasons.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-900">
                Short-term letting is not legal at this address
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-red-800">
                {layers.regulatory.killReasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-red-800">
                This is a hard kill, not a score penalty. The arbitrage figures above are
                arithmetic, not an opportunity.
              </p>
            </div>
          )}
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Row label="Market" value={profile.label} />
            <Row label="City / county" value={`${layers.regulatory.city} · ${layers.regulatory.county}`} />
            <Row label="STR legality" value={LEGALITY_LABELS[layers.regulatory.legality]} />
            <Row
              label="Local ordinance"
              value={
                layers.regulatory.ordinanceYear == null
                  ? "None"
                  : `${layers.regulatory.ordinanceYear}${
                      layers.regulatory.grandfathered ? " — pre-2011, survives preemption" : ""
                    }`
              }
            />
            <Row
              label="Minimum stay"
              value={
                layers.regulatory.minimumStayNights === 1
                  ? "Nightly allowed"
                  : `${layers.regulatory.minimumStayNights} nights`
              }
            />
            <Row label="Zoning" value={ZONING_STATUS_LABELS[layers.regulatory.zoningStatus]} />
            <Row
              label="DBPR licence"
              value={
                layers.regulatory.dbprLicenceRequired
                  ? `${layers.regulatory.dbprLicenceClass} · ${formatUSD(
                      layers.regulatory.dbprLicenceCost
                    )}`
                  : "Not required"
              }
            />
            <Row
              label="Local registration"
              value={
                layers.regulatory.localRegistrationRequired
                  ? formatUSD(layers.regulatory.localRegistrationCost)
                  : "Not required"
              }
            />
            <Row
              label="State sales tax"
              value={`${layers.regulatory.stateSalesTaxPct}%${
                layers.regulatory.platformRemitsStateTax ? " — platform remits" : ""
              }`}
            />
            <Row
              label="Tourist development tax"
              value={`${layers.regulatory.touristDevelopmentTaxPct}%${
                layers.regulatory.hostRemitsCountyTax ? " — host remits" : ""
              }`}
            />
            <Row
              label="Landlord sublet consent"
              value={SUBLET_CONSENT_LABELS[layers.regulatory.landlordSubletConsent]}
            />
            <Row
              label="HOA permits STR"
              value={
                layers.regulatory.hoaStrAllowed == null
                  ? "Unknown / no HOA"
                  : layers.regulatory.hoaStrAllowed
                    ? "Yes"
                    : "No"
              }
            />
            <Row
              label="FEMA flood zone"
              value={`${layers.regulatory.femaFloodZone} · ${layers.regulatory.floodRisk} risk`}
            />
          </dl>
          {layers.regulatory.flags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {layers.regulatory.flags.map((f) => (
                <Badge
                  key={f}
                  variant="outline"
                  className="border-amber-300 bg-amber-50 text-amber-900"
                >
                  {f}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No major flags on file.</p>
          )}
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">
              Static reference table, re-verified {profile.verifiedOn}. Florida ordinances change by
              council vote — confirm at the address before signing.
            </p>
            <ul className="list-disc space-y-0.5 pl-4">
              {layers.regulatory.sources.map((s) => (
                <li key={s}>
                  <a href={s} target="_blank" rel="noopener noreferrer">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="risk">
        <AccordionTrigger>
          <span className="flex flex-wrap items-center gap-2">
            <AlertTriangle className="size-4 text-emerald-600" />
            8. Risk
            <Badge variant="secondary">{layers.risk.overallRiskScore}/10</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Row label="Competition density" value={`${layers.risk.competitionDensity} comps`} />
            <Row label="Competition score" value={`${layers.risk.competitionScore}/10`} />
            <Row label="Seasonality volatility" value={`${layers.risk.seasonalityVolatility}/10`} />
            <Row label="HOA strictness" value={`${layers.risk.hoaStrictness}/10`} />
            <Row label="Landlord flexibility" value={`${layers.risk.landlordFlexibility}/10`} />
            <Row label="Hurricane exposure" value={`${layers.risk.hurricaneExposure}/10`} />
            <Row label="Review score bar" value={String(layers.risk.reviewScoreBar)} />
            <Row label="Overall risk" value={`${layers.risk.overallRiskScore}/10`} strong />
          </dl>
          {layers.risk.watchItems.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {layers.risk.watchItems.map((w) => (
                <Badge key={w} variant="secondary">
                  {w}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground">{layers.risk.reasoning}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="positioning">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            <Megaphone className="size-4 text-emerald-600" />
            9. Positioning
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <Row
              label="Target segment"
              value={GUEST_SEGMENT_LABELS[layers.positioning.targetSegment]}
            />
            <Row
              label="Secondary"
              value={
                layers.positioning.secondarySegments
                  .map((s) => GUEST_SEGMENT_LABELS[s])
                  .join(", ") || "None"
              }
            />
          </dl>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">USP</p>
            <p className="text-sm">{layers.positioning.usp}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Photo strategy
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {layers.positioning.photoStrategy.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Pricing strategy
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {layers.positioning.pricingStrategy.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
              Minimum stay
            </p>
            <p className="text-sm">{layers.positioning.minimumStayStrategy}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-red-700">
              Weaknesses &amp; mitigations
            </p>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {layers.positioning.weaknesses.map((w) => (
                <li key={w.weakness}>
                  <strong>{w.weakness}</strong> — {w.mitigation}
                </li>
              ))}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
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
    <div
      className={`flex justify-between gap-3 rounded-md border px-3 py-2 ${
        strong ? "font-semibold" : ""
      }`}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
