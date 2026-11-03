import type { Metadata } from "next";
import { R2RSettingsForm } from "@/components/r2r/r2r-settings-form";

export const metadata: Metadata = {
  title: "R2R Settings · Deal Hunter",
  description: "Florida rent-to-rent capital, targets and modelling assumptions.",
};

export default function R2RSettingsPage() {
  return (
    <div className="px-4 py-6">
      <R2RSettingsForm />
    </div>
  );
}
