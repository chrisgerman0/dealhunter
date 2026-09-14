"use client";

import { useEffect, useRef, useState } from "react";
import type { Coords } from "@/types/deal";
import { MapPin } from "lucide-react";

const FREE_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function MiniMap({ coords, label }: { coords: Coords; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    let map: import("maplibre-gl").Map | null = null;
    (async () => {
      try {
        const maplibregl = (await import("maplibre-gl")).default;
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (!ref.current) return;
        map = new maplibregl.Map({
          container: ref.current,
          style: FREE_STYLE,
          center: [coords.lng, coords.lat],
          zoom: 13,
          interactive: false,
        });
        new maplibregl.Marker({ color: "#059669" })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map);
      } catch {
        setFailed(true);
      }
    })();
    return () => {
      map?.remove();
    };
  }, [coords.lat, coords.lng]);

  if (failed) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border bg-slate-100 text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-1 p-4 text-center">
          <MapPin className="size-6 text-emerald-600" />
          <p className="font-medium text-foreground">{label ?? "Property location"}</p>
          <p className="text-xs">
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </p>
        </div>
      </div>
    );
  }

  return <div ref={ref} className="h-48 w-full overflow-hidden rounded-xl border" />;
}
