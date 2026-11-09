"use client";

import { usePathname } from "next/navigation";
import AppBottomNav from "@/components/app/AppBottomNav";
import AppSidebarNav from "@/components/app/AppSidebarNav";

// Screens that manage their own full-bleed layout and skip the bottom nav
// (onboarding is a linear flow; trip detail has its own header with a back
// button instead, matching the original design).
const NO_NAV_PREFIXES = ["/app/onboarding", "/app/trip/"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const hideNav = NO_NAV_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    // Below md this is untouched: full-bleed single column, bottom tab bar.
    // At md+ it stops pretending to be a phone — a fixed sidebar takes over
    // navigation and the content column gets real reading width instead of
    // floating a 460px phone card alone in a sea of grey.
    <div className="flex min-h-screen bg-cream">
      {!hideNav && <AppSidebarNav />}

      {/* min-w-0 matters here: a flex item's default min-width is its
          content's intrinsic width, not 0, so without it this column
          refused to shrink below the explore page's postcard row and
          pushed the whole page into horizontal overflow on mobile. */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:items-center">
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-bone md:max-w-[640px] md:border-x md:border-sandstone/70">
          <div className="flex-1 overflow-y-auto">{children}</div>
          {!hideNav && <AppBottomNav />}
        </div>
      </div>
    </div>
  );
}
