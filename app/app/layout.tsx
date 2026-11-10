"use client";

import { usePathname } from "next/navigation";
import AppBottomNav from "@/components/app/AppBottomNav";
import AppSidebarNav from "@/components/app/AppSidebarNav";

// Screens that manage their own full-bleed layout and skip the nav
// (onboarding is a linear flow; trip detail has its own header with a back
// button instead).
const NO_NAV_PREFIXES = ["/app/onboarding", "/app/trip/"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const hideNav = NO_NAV_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    // One sheet of chart paper under everything. Below md: a single
    // full-bleed column with the bottom tab bar. At md+: a fixed sidebar
    // takes over navigation and the content sits in a reading-width column.
    <div className="paper flex min-h-screen">
      {!hideNav && <AppSidebarNav />}

      {/* min-w-0 matters here: a flex item's default min-width is its
          content's intrinsic width, not 0, so without it this column
          refuses to shrink below its widest child and pushes the whole
          page into horizontal overflow on mobile. */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:items-center">
        <div className="paper-edge flex min-h-screen w-full min-w-0 flex-col md:max-w-[720px] md:border-x-[1.5px] md:border-dashed md:border-ink/35">
          <div className="flex-1">{children}</div>
          {!hideNav && <AppBottomNav />}
        </div>
      </div>
    </div>
  );
}
