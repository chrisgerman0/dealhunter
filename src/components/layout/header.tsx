"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Heart, Settings, Compass, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDealStore } from "@/store/useDealStore";
import { Badge } from "@/components/ui/badge";
import { MODE_META, modeFromPathname, modePath, type AppMode, type ModeSection } from "@/lib/modes";
import { ModeSwitcher } from "@/components/layout/mode-switcher";

interface NavSection {
  section: ModeSection;
  label: string;
  icon: typeof Compass;
}

const sections: NavSection[] = [
  { section: "" as const, label: "Explore", icon: Compass },
  { section: "shortlist" as const, label: "Shortlist", icon: Heart },
  { section: "settings" as const, label: "Settings", icon: Settings },
];

/**
 * Sections that only exist in one mode.
 *
 * The listing mirror scrapes Zillow/Realtor rentals, which is an R2R concept
 * — BMV has no equivalent, so showing the tab there would link to a 404.
 */
const MODE_ONLY_SECTIONS: Partial<Record<AppMode, NavSection[]>> = {
  r2r: [{ section: "mirror", label: "Mirror", icon: Database }],
};

export function Header() {
  const pathname = usePathname();
  const mode = modeFromPathname(pathname);
  const storeMode = useDealStore((s) => s.mode);
  const setMode = useDealStore((s) => s.setMode);

  // The URL wins. Deep links and back/forward both land here, so the store's
  // active slice is reconciled to the route rather than the other way round.
  useEffect(() => {
    if (storeMode !== mode) setMode(mode);
  }, [mode, storeMode, setMode]);

  // Read the route's mode directly instead of the live slice, so the count is
  // never one render stale while the store catches up with a mode switch.
  const shortlistCount = useDealStore((s) =>
    s.mode === mode ? s.shortlisted.length : s.modes[mode].shortlisted.length
  );

  const explorePath = modePath(mode, "");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-2 overflow-x-auto overflow-y-hidden px-4 sm:gap-4">
        <Link
          href={explorePath}
          aria-label={`Deal Hunter — ${MODE_META[mode].label}`}
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Building2 className="size-4" />
          </span>
          <span className="hidden md:inline">Deal Hunter</span>
        </Link>
        <nav className="flex items-center gap-1">
          {[...sections, ...(MODE_ONLY_SECTIONS[mode] ?? [])].map(({ section, label, icon: Icon }) => {
            const href = modePath(mode, section);
            const active = section === "" ? pathname === explorePath : pathname.startsWith(href);
            return (
              <Link
                key={section || "explore"}
                href={href}
                title={label}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
                {section === "shortlist" && shortlistCount > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1">
                    {shortlistCount}
                  </Badge>
                )}
              </Link>
            );
          })}
          <ModeSwitcher mode={mode} />
        </nav>
      </div>
    </header>
  );
}
