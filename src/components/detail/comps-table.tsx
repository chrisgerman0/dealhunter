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
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead>Beds</TableHead>
            <TableHead>Sqft</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Dist.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comps.map((c, i) => (
            <TableRow key={`${c.address}-${i}`}>
              <TableCell className="font-medium">
                <div>{c.address}</div>
                <div className="text-xs text-muted-foreground">{c.postcode}</div>
              </TableCell>
              <TableCell>{c.soldDate}</TableCell>
              <TableCell>{c.beds}</TableCell>
              <TableCell>{c.sqft.toLocaleString("en-GB")}</TableCell>
              <TableCell>{formatGBP(c.price)}</TableCell>
              <TableCell>{c.distanceMiles.toFixed(2)} mi</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
