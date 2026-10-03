import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { SeaDashboard } from "@/components/sea/sea-dashboard";
import { TRIP_TITLE, utcTodayIso } from "@/data/sea-trip";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TRIP_TITLE,
  description:
    "Chris Germano's South East Asia travel board, from Dubai on 15 January 2027 through Bali on 15 May 2027.",
};

export default function SeaTripPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f6f4ef] lg:h-dvh lg:overflow-hidden">
      <Header />
      <SeaDashboard today={utcTodayIso()} />
    </div>
  );
}
