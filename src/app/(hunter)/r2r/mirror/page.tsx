import { R2RMirrorRun } from "@/components/r2r/r2r-mirror-run";

/**
 * The Zillow / Realtor mirror console.
 *
 * R2R-only: the BMV side has no scraped-listing mirror, which is why the nav
 * entry for this page is gated on mode in `header.tsx` rather than added to
 * the shared `sections` list.
 */
export default function R2RMirrorPage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="border-b px-4 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Listing mirror</h1>
        <p className="text-sm text-muted-foreground">
          Scrape Zillow and Realtor.com search URLs into Deal Hunter&apos;s own store, then grade the results
          through the R2R engine. Every row is dated — the mirror never presents an old scrape as live.
        </p>
      </div>
      <R2RMirrorRun />
    </div>
  );
}
