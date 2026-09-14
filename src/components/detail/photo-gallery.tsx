"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-2">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
        <Image
          src={photos[active] ?? photos[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 70vw"
          priority
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2",
              active === i ? "border-emerald-600" : "border-transparent opacity-80 hover:opacity-100"
            )}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="96px" />
          </button>
        ))}
      </div>
    </div>
  );
}
