import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MODE_META, modePath } from "@/lib/modes";

/**
 * Shared placeholder for every scaffolded R2R route.
 *
 * States plainly what will live on the page so the shell is self-documenting
 * until the Florida domain model and data land. Intentionally renders no
 * deal-shaped data — inventing throwaway shapes now would mean rework.
 */
export function R2RComingNext({
  title,
  summary,
  willInclude,
  blockedOn = "the Florida rent-to-rent domain model and deal data",
}: {
  title: string;
  summary: string;
  willInclude: string[];
  blockedOn?: string;
}) {
  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{MODE_META.r2r.label}</Badge>
            <Badge variant="outline">Coming next</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Construction className="size-4 text-amber-600" />
              What will live here
            </CardTitle>
            <CardDescription>
              The route, navigation and per-mode state are in place. The page itself is next.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {willInclude.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-emerald-600"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
              Waiting on {blockedOn}. Nothing on this page is mocked, so no placeholder numbers
              can be mistaken for real ones.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href={modePath("r2r", "")}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            R2R explore
          </Link>
          <Link
            href={modePath("bmv", "")}
            className="text-muted-foreground hover:text-foreground"
          >
            Switch to {MODE_META.bmv.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
