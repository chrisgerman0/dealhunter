import { Badge } from "@/components/ui/badge";
import { capitalTagLabel } from "@/lib/format";
import type { CapitalTag } from "@/types/deal";
import { cn } from "@/lib/utils";

const styles: Record<CapitalTag, string> = {
  solo_doable: "bg-sky-50 text-sky-800 border-sky-200",
  jv_recommended: "bg-violet-50 text-violet-800 border-violet-200",
  jv_required: "bg-orange-50 text-orange-800 border-orange-200",
};

export function CapitalTagBadge({ tag, className }: { tag: CapitalTag; className?: string }) {
  return (
    <Badge variant="outline" className={cn(styles[tag], className)}>
      {capitalTagLabel(tag)}
    </Badge>
  );
}
