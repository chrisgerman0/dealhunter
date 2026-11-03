import type { Metadata } from "next";
import { R2RComingNext } from "@/components/r2r/coming-next";

export const metadata: Metadata = {
  title: "R2R Shortlist · Deal Hunter",
  description: "Shortlisted Florida rent-to-rent units — in build.",
};

export default function R2RShortlistPage() {
  return (
    <R2RComingNext
      title="R2R shortlist"
      summary="Units you have shortlisted in R2R mode, side by side. This list is entirely separate from the BMV shortlist."
      willInclude={[
        "Comparison table across shortlisted units — rent, projected revenue, spread and payback",
        "The same cards as Explore, so a unit can be dropped without leaving the page",
        "Its own set of shortlisted IDs, already namespaced in the store under the R2R mode",
      ]}
    />
  );
}
