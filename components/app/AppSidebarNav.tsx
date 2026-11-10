"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const TABS = [
  {
    href: "/app/explore",
    label: "Explore",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polygon points="15,9 10,10 9,15 14,14" />
      </>
    ),
  },
  {
    href: "/app/community",
    label: "Community",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.6" />
        <path d="M3 20c.6-3.4 2.9-5.5 6-5.5s5.4 2.1 6 5.5" />
        <path d="M14.5 14.8c2.4.3 4 2.2 4.5 5.2" />
      </>
    ),
  },
  {
    href: "/app/trips",
    label: "Trips",
    icon: (
      <>
        <rect x="4" y="8" width="16" height="11" rx="2" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
  },
  {
    href: "/app/saved",
    label: "Saved",
    icon: (
      <path d="M20.8 8.6c0-3-2.4-5.4-5.4-5.4-1.7 0-3.2.8-4.2 2-1-1.2-2.5-2-4.2-2-3 0-5.4 2.4-5.4 5.4 0 6 9.6 11 9.6 11s9.6-5 9.6-11z" />
    ),
  },
  {
    href: "/app/profile",
    label: "Profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.5-4 4-6 7-6s5.5 2 7 6" />
      </>
    ),
  },
];

/**
 * The desktop/landscape counterpart to AppBottomNav. Below md, the bottom
 * tab bar owns navigation and this renders nothing; at md and up, this
 * takes over as a fixed-width rail so the app actually uses a wide
 * viewport instead of floating a phone-width column in empty space.
 */
export default function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App"
      className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col border-r border-sandstone bg-cream px-5 py-7 md:flex"
    >
      <Link href="/" className="mb-10 flex items-center gap-2.5 px-1 text-ink" aria-label="Sidepath home">
        <Logo />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname?.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className="flex items-center gap-3.5 rounded-[10px] px-3.5 py-3 text-sm font-medium transition-colors"
              style={{
                color: active ? "#C0532E" : "rgba(38,32,27,.78)",
                backgroundColor: active ? "rgba(192,83,46,0.08)" : "transparent",
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                {tab.icon}
              </svg>
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-dashed border-sandstone pt-5">
        <p className="font-serif text-[13px] italic text-ink/50">Why not?</p>
      </div>
    </nav>
  );
}
