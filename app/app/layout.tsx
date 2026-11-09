"use client";

import { usePathname } from "next/navigation";
import AppBottomNav from "@/components/app/AppBottomNav";

// Screens that manage their own full-bleed layout and skip the bottom nav
// (onboarding is a linear flow; trip detail has its own header with a back
// button instead, matching the original design).
const NO_NAV_PREFIXES = ["/app/onboarding", "/app/trip/"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const hideNav = NO_NAV_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <div className="flex min-h-screen justify-center bg-ink/5">
      <div className="flex w-full max-w-[460px] flex-col bg-bone shadow-2xl min-h-screen">
        <div className="flex-1 overflow-y-auto">{children}</div>
        {!hideNav && <AppBottomNav />}
      </div>
    </div>
  );
}
