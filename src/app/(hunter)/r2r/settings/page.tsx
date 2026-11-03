import type { Metadata } from "next";
import { R2RComingNext } from "@/components/r2r/coming-next";

export const metadata: Metadata = {
  title: "R2R Settings · Deal Hunter",
  description: "Florida rent-to-rent defaults — in build.",
};

export default function R2RSettingsPage() {
  return (
    <R2RComingNext
      title="R2R settings"
      summary="Capital and search defaults for the R2R experience. These are stored separately from BMV settings — changing one never touches the other."
      willInclude={[
        "Available capital for deposits, furnishing and float, in USD",
        "Default Florida markets and monthly rent band",
        "Deal assumptions — occupancy, management share, utilities and turnover costs",
        "Apply-defaults-to-filters, matching the BMV settings page",
      ]}
    />
  );
}
