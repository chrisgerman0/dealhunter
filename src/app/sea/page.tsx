import type { Metadata } from "next";
import { SeaDashboard } from "@/components/sea/sea-dashboard";
import { TRIP_TITLE, utcTodayIso } from "@/data/sea-trip";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: TRIP_TITLE,
  description:
    "South East Asia trip board, departing Manchester for Dubai on 15 January 2027 through Bali on 15 May 2027.",
};

export default function SeaTripPage() {
  return <SeaDashboard today={utcTodayIso()} />;
}
