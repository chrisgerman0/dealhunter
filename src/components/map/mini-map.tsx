"use client";

import { useEffect, useRef, useState } from "react";
import type { Coords } from "@/types/deal";
import { MapPin } from "lucide-react";

export function MiniMap({ coords, label }: { coords: Coords; label?: string }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token || !ref.current) return;
    let map: import("mapbox-gl").Map | null = null;
    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        await import("mapbox-gl/dist/mapbox-gl.css");
        if (!ref.current) return;
        mapboxgl.accessToken = token;
        map = new mapboxgl.Map({
          container: ref.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [coords.lng, coords.lat],
          zoom: 13,
          interactive: false,
        });
        new mapboxgl.Marker({ color: "#059669" })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map);
      } catch {
        setFailed(true);
      }
    })();
    return () => {
      map?.remove();
    };
  }, [token, coords.lat, coords.lng]);

  if (!token || failed) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border bg-slate-100 text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-1 p-4 text-center">
          <MapPin className="size-6 text-emerald-600" />
          <p className="font-medium text-foreground">{label ?? "Property location"}</p>
          <p className="text-xs">
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </p>
          <p className="text-[11px]">Add Mapbox token for interactive mini-map</p>
        </div>
      </div>
    );
  }

  return <div ref={ref} className="h-48 w-full overflow-hidden rounded-xl border" />;
}
