import type { Metadata } from "next";
import { R2RExploreView } from "@/components/r2r/r2r-explore-view";

export const metadata: Metadata = {
  title: "R2R Explore · Deal Hunter",
  description: "Florida rent-to-rent deal explorer — lease the unit, run it, keep the spread.",
};

export default function R2RExplorePage() {
  return <R2RExploreView />;
}
