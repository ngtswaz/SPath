"use client";

import { usePathname } from "next/navigation";
import AppBottomNav from "@/components/app/AppBottomNav";
import AppSidebarNav from "@/components/app/AppSidebarNav";

// Linear first-run flows take the whole screen: no nav to wander off into.
const BARE_PREFIXES = ["/app/onboarding"];
// Detail screens keep the desktop sidebar but swap the phone tab bar for
// their own back button.
const NO_TABS_PREFIXES = ["/app/trip/", "/app/community/"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const bare = BARE_PREFIXES.some((p) => pathname.startsWith(p));
  const noTabs = bare || NO_TABS_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <div className="app-shell flex min-h-screen bg-bone">
      {!bare && <AppSidebarNav />}

      {/* min-w-0: a flex item's default min-width is its content's width,
          which would let one wide child push the page sideways on phones. */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-clip">
        {/* Top padding respects a phone's notch; bottom padding on phones
            leaves room for the floating tab bar. */}
        <div
          className={`mx-auto w-full flex-1 px-5 pt-[max(1.75rem,env(safe-area-inset-top))] md:px-10 md:pb-12 md:pt-10 ${
            noTabs ? "pb-12" : "pb-32"
          } ${bare ? "max-w-[620px]" : "max-w-[1040px]"}`}
        >
          {children}
        </div>
        {!noTabs && <AppBottomNav />}
      </div>
    </div>
  );
}
