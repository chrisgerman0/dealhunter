import { LayoutTemplate } from "lucide-react";

export function FloorplanPlaceholder({ present }: { present: boolean }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/40 text-center">
      <LayoutTemplate className="size-8 text-muted-foreground" />
      <p className="text-sm font-medium">
        {present ? "Floorplan available on listing" : "No floorplan on listing"}
      </p>
      <p className="max-w-sm px-4 text-xs text-muted-foreground">
        {present
          ? "Open the original listing to view the agent floorplan. A parsed SVG floorplan can be plugged in here later."
          : "Treat layout assumptions cautiously — request a measured survey before exchange."}
      </p>
    </div>
  );
}
