import type { Metadata } from "next";
import { R2RComingNext } from "@/components/r2r/coming-next";

export const metadata: Metadata = {
  title: "R2R Explore · Deal Hunter",
  description: "Florida rent-to-rent deal explorer — in build.",
};

export default function R2RExplorePage() {
  return (
    <R2RComingNext
      title="Explore Florida R2R deals"
      summary="The R2R equivalent of BMV Explore: a filterable list of candidate rental units with a map beside it."
      willInclude={[
        "Filter panel for Florida markets, monthly rent band, unit type, bedrooms and furnishing state",
        "Ranked list of candidate units with the monthly spread and cash-to-start on each card",
        "Map of the active market with pins linked to the list selection",
        "Shortlist, dismiss and snooze on each card, stored separately from BMV",
      ]}
    />
  );
}
