import type { Comp } from "@/types/deal";
import { formatGBP } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CompsTable({ comps }: { comps: Comp[] }) {
  const showBeds = comps.some((c) => c.beds > 0);
  const showSqft = comps.some((c) => c.sqft > 0);

  if (!comps.length) {
    return <p className="text-sm text-muted-foreground">No sold comps to show.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Sold</TableHead>
            {showBeds && <TableHead>Beds</TableHead>}
            {showSqft && <TableHead>Sqft</TableHead>}
            <TableHead>Price</TableHead>
            <TableHead>Dist.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comps.map((c, i) => (
            <TableRow key={`${c.address}-${i}`}>
              <TableCell className="font-medium">
                <div>{c.address}</div>
                <div className="text-xs text-muted-foreground">
                  {c.postcode}
                  {c.propertyType ? ` · ${c.propertyType}` : ""}
                </div>
              </TableCell>
              <TableCell>{c.soldDate}</TableCell>
              {showBeds && <TableCell>{c.beds > 0 ? c.beds : "n/a"}</TableCell>}
              {showSqft && <TableCell>{c.sqft > 0 ? c.sqft.toLocaleString("en-GB") : "n/a"}</TableCell>}
              <TableCell className="font-semibold">{formatGBP(c.price)}</TableCell>
              <TableCell>{c.distanceMiles > 0 ? `${c.distanceMiles.toFixed(2)} mi` : "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
