import type { Deal, EnrichmentStatus, LayerEnrichmentMeta } from "@/types/deal";
import { getLiveFloodData } from "./flood";
import { getLiveSoldComps } from "./comps";

const MIN_SAMPLE = 3;

function meta(
  status: EnrichmentStatus,
  extra: Partial<LayerEnrichmentMeta> = {}
): LayerEnrichmentMeta {
  return {
    ...extra,
    status,
    updatedAt:
      extra.updatedAt !== undefined
        ? extra.updatedAt
        : status === "live"
          ? new Date().toISOString()
          : null,
  };
}

function floodFlags(existing: string[], zone: 1 | 2 | 3, risk: "low" | "medium" | "high"): string[] {
  const flags = existing.filter((f) => !/^flood zone/i.test(f));
  if (zone >= 2) flags.push(`Flood zone ${zone} (${risk} risk)`);
  return flags;
}

export async function enrichDeal(deal: Deal): Promise<Deal> {
  const [floodR, compsR] = await Promise.allSettled([
    getLiveFloodData(deal.coords),
    getLiveSoldComps({
      postcode: deal.postcode,
      beds: deal.targetBeds,
      coords: deal.coords,
      address: deal.address,
      city: deal.city,
    }),
  ]);

  const next: Deal = {
    ...deal,
    layers: {
      ...deal.layers,
      regulatory: { ...deal.layers.regulatory },
      risk: { ...deal.layers.risk },
      soldComps: { ...deal.layers.soldComps, comps: [...deal.layers.soldComps.comps] },
    },
    enrichment: {
      crime: meta("mock-fallback", { note: "Crime enrichment is not used." }),
      flood: meta("mock-fallback"),
      comps: meta("mock-fallback"),
    },
  };

  if (floodR.status === "fulfilled") {
    const flood = floodR.value;
    next.layers.regulatory.floodZone = flood.zone;
    next.layers.regulatory.floodRisk = flood.risk;
    next.layers.regulatory.flags = floodFlags(
      next.layers.regulatory.flags,
      flood.zone,
      flood.risk
    );
    next.enrichment!.flood = meta("live", {
      source: "Environment Agency Flood Map for Planning",
      note: flood.sourceNote,
    });
  } else {
    next.enrichment!.flood = meta("mock-fallback", {
      note: floodR.reason instanceof Error ? floodR.reason.message : "Flood source unavailable",
    });
  }

  if (compsR.status === "fulfilled") {
    const live = compsR.value;
    const thin = live.bands.thinSample || live.bands.sampleSize < MIN_SAMPLE;
    if (live.comps.length > 0) {
      next.layers.soldComps.comps = live.comps;
      next.layers.soldComps.sampleSize = live.bands.sampleSize;
      next.layers.soldComps.sourceNote = live.note;
      next.layers.soldComps.thinSample = thin;
    }
    if (!thin) {
      next.layers.soldComps.median = live.bands.median;
      next.layers.soldComps.gdvRealistic = live.bands.gdvRealistic;
      next.layers.soldComps.gdvStretch = live.bands.gdvStretch;
      next.layers.soldComps.gdvConservative = live.bands.gdvConservative;
      next.gdv = live.bands.gdvRealistic;
    } else if (live.comps.length > 0) {
      next.layers.soldComps.thinSample = true;
      next.layers.soldComps.sourceNote = live.note;
    }
    next.enrichment!.comps = meta("live", {
      source: "HM Land Registry Price Paid",
      thinSample: thin,
      note: live.note,
      updatedAt: live.updatedAt,
    });
  } else {
    next.enrichment!.comps = meta("mock-fallback", {
      note: compsR.reason instanceof Error ? compsR.reason.message : "Comps source unavailable",
    });
  }

  return next;
}
