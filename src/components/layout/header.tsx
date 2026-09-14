"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Heart, Settings, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDealStore } from "@/store/useDealStore";
import { Badge } from "@/components/ui/badge";

const links = [
  { href: "/", label: "Explore", icon: Compass },
  { href: "/shortlist", label: "Shortlist", icon: Heart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const shortlisted = useDealStore((s) => s.shortlisted);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Building2 className="size-4" />
          </span>
          <span className="hidden sm:inline">Deal Hunter</span>
          <span className="hidden text-xs font-normal text-muted-foreground md:inline">
            Liverpool & Manchester BMV
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
                {href === "/shortlist" && shortlisted.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1">
                    {shortlisted.length}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
