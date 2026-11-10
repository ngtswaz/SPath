"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App"
      className="paper sticky bottom-0 z-30 flex h-[66px] shrink-0 border-t-[1.5px] border-dashed border-ink/50 md:hidden"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname?.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-terracotta-dark"
            style={{ color: active ? "#9E411F" : "rgba(38,32,27,.78)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {tab.icon}
            </svg>
            <span className="text-[10.5px] font-semibold">{tab.label}</span>
            {/* A dot of sealing wax marks where you are; the empty one keeps every tab the same height. */}
            <span aria-hidden="true" className={`h-[5px] w-[5px] rounded-full ${active ? "bg-burgundy" : ""}`} />
          </Link>
        );
      })}
    </nav>
  );
}
