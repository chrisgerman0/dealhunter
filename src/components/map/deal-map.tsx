"use client";

import { useEffect, useRef, useState } from "react";
import type { Deal } from "@/types/deal";
import { useDealStore } from "@/store/useDealStore";
import { MapFallback } from "./map-fallback";
import { formatGBP } from "@/lib/format";

interface DealMapProps {
  deals: Deal[];
}

/** Free vector basemap — no API key required (OpenFreeMap / OSM data). */
const FREE_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function DealMap({ deals }: DealMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markersRef = useRef<import("maplibre-gl").Marker[]>([]);
  const selectedDealId = useDealStore((s) => s.selectedDealId);
  const setSelectedDealId = useDealStore((s) => s.setSelectedDealId);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    let cancelled = false;

    (async () => {
      try {
        const maplibregl = await import("maplibre-gl");
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled || !mapContainer.current) return;

        const map = new maplibregl.Map({
          container: mapContainer.current,
          style: FREE_STYLE,
          center: [-2.6, 53.45],
          zoom: 9.2,
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
        mapRef.current = map;
        map.on("load", () => setReady(true));
        map.on("error", () => setError(true));
      } catch {
        setError(true);
      }
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;

    (async () => {
      const maplibregl = await import("maplibre-gl");
      const map = mapRef.current!;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const colour = (q: Deal["quality"]) =>
        q === "excellent" ? "#059669" : q === "good" ? "#d97706" : "#dc2626";

      deals.forEach((deal) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "deal-marker";
        el.style.cssText = `
          width: 28px; height: 28px; border-radius: 9999px; border: 2px solid white;
          background: ${colour(deal.quality)}; box-shadow: 0 1px 4px rgba(0,0,0,.35);
          cursor: pointer; transform: ${selectedDealId === deal.id ? "scale(1.25)" : "scale(1)"};
        `;
        el.title = `${deal.address} · ${formatGBP(deal.price)}`;
        el.addEventListener("click", () => setSelectedDealId(deal.id));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([deal.coords.lng, deal.coords.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });

      if (deals.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        deals.forEach((d) => bounds.extend([d.coords.lng, d.coords.lat]));
        map.fitBounds(bounds, { padding: 48, maxZoom: 12 });
      }
    })();
  }, [deals, ready, selectedDealId, setSelectedDealId]);

  useEffect(() => {
    if (!ready || !mapRef.current || !selectedDealId) return;
    const deal = deals.find((d) => d.id === selectedDealId);
    if (!deal) return;
    mapRef.current.flyTo({
      center: [deal.coords.lng, deal.coords.lat],
      zoom: Math.max(mapRef.current.getZoom(), 12),
      essential: true,
    });
  }, [selectedDealId, deals, ready]);

  if (error) {
    return <MapFallback deals={deals} />;
  }

  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-none bg-muted">
      <div ref={mapContainer} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 text-[11px] shadow">
        <span className="mr-2 inline-flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-emerald-600" /> Excellent
        </span>
        <span className="mr-2 inline-flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-amber-600" /> Good
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-red-600" /> Marginal
        </span>
      </div>
    </div>
  );
}
