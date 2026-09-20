import { Badge } from "@/components/ui/badge";
import type { LayerEnrichmentMeta } from "@/types/deal";
import { format, parseISO } from "date-fns";

function formatWhen(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    return format(parseISO(iso), "d MMM yyyy, HH:mm");
  } catch {
    return null;
  }
}

export function LiveBadge({ meta }: { meta?: LayerEnrichmentMeta }) {
  if (!meta || meta.status === "pending") {
    return (
      <Badge variant="outline" className="font-normal text-muted-foreground">
        Refreshing
      </Badge>
    );
  }
  if (meta.status === "live") {
    const when = formatWhen(meta.updatedAt);
    return (
      <span className="inline-flex flex-wrap items-center gap-1.5">
        <Badge className="border-transparent bg-emerald-600 text-white">Live data</Badge>
        {meta.thinSample && (
          <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
            Thin sample
          </Badge>
        )}
        {when && <span className="text-[11px] font-normal text-muted-foreground">Updated {when}</span>}
      </span>
    );
  }
  const when = formatWhen(meta.updatedAt);
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <Badge variant="outline">Mock fallback</Badge>
      {when && <span className="text-[11px] font-normal text-muted-foreground">Updated {when}</span>}
    </span>
  );
}
