import { Badge } from "@/components/ui/badge";
import { qualityLabel } from "@/lib/format";
import type { DealQuality } from "@/types/deal";
import { cn } from "@/lib/utils";

const styles: Record<DealQuality, string> = {
  excellent: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  good: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  marginal: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};

export function QualityBadge({ quality, className }: { quality: DealQuality; className?: string }) {
  return (
    <Badge variant="outline" className={cn(styles[quality], className)}>
      {qualityLabel(quality)}
    </Badge>
  );
}
