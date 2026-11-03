import type { StrComp } from "@/types/r2r";
import { formatUSD, formatPct, UNIT_TYPE_LABELS } from "@/lib/r2r/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Structural copy of `src/components/detail/comps-table.tsx`. */
export function R2RCompsTable({ comps }: { comps: StrComp[] }) {
  if (!comps.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No per-listing comps to show. The active comp source reports an area-level distribution
        rather than matched listings — see the source note above.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Listing</TableHead>
            <TableHead>Sleeps</TableHead>
            <TableHead>Peak</TableHead>
            <TableHead>Off</TableHead>
            <TableHead>Occ.</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Dist.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comps.map((c, i) => (
            <TableRow key={`${c.title}-${i}`}>
              <TableCell className="font-medium">
                <div>{c.title}</div>
                <div className="text-xs text-muted-foreground">
                  {UNIT_TYPE_LABELS[c.unitType]} · {c.beds} bed
                  {c.sameStreet ? " · same street" : ""}
                </div>
              </TableCell>
              <TableCell>{c.sleeps}</TableCell>
              <TableCell className="font-semibold">{formatUSD(c.nightlyPeak)}</TableCell>
              <TableCell>{formatUSD(c.nightlyOff)}</TableCell>
              <TableCell>{formatPct(c.occupancy)}</TableCell>
              <TableCell>
                {c.reviewScore != null ? `${c.reviewScore} (${c.reviewCount})` : "n/a"}
              </TableCell>
              <TableCell>{c.distanceMeters > 0 ? `${c.distanceMeters} m` : "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
