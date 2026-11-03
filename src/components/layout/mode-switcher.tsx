"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_MODES, MODE_META, modePath, type AppMode } from "@/lib/modes";
import { useDealStore } from "@/store/useDealStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Switches between the BMV and R2R experiences.
 *
 * The URL is the source of truth for which mode is on screen (`mode` is
 * passed in by the header, derived from the pathname), so switching is a
 * navigation. The store is told first so the correct per-mode slice is
 * already live by the time the destination renders.
 */
export function ModeSwitcher({ mode }: { mode: AppMode }) {
  const router = useRouter();
  const setMode = useDealStore((s) => s.setMode);
  const active = MODE_META[mode];

  const select = (next: AppMode) => {
    if (next === mode) return;
    setMode(next);
    router.push(modePath(next, ""));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Mode: ${active.label}. Change mode`}
        className="ml-1 inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left text-sm font-medium transition-colors hover:bg-muted/60 data-popup-open:bg-muted"
      >
        <span className="whitespace-nowrap">{active.label}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-1.5">
        {APP_MODES.map((id) => {
          const meta = MODE_META[id];
          const isActive = id === mode;
          return (
            <DropdownMenuItem
              key={id}
              onClick={() => select(id)}
              className="items-start gap-2 p-2"
            >
              <Check
                className={cn("mt-0.5 size-4 shrink-0", isActive ? "opacity-100" : "opacity-0")}
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">
                  {meta.label}
                  {isActive && (
                    <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                      current
                    </span>
                  )}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {meta.description}
                </span>
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
