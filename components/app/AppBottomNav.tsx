"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icons";
import { TAB_ITEMS, isActive } from "./nav";

/**
 * The phone tab bar: a floating pill above the bottom edge. The highlight
 * behind the current tab is one element that glides between tabs.
 */
export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex h-[66px] items-stretch rounded-full border border-ink/10 bg-white/90 px-1.5 shadow-float backdrop-blur-md md:hidden"
    >
      {TAB_ITEMS.map((tab) => {
        const active = isActive(pathname, tab.href);
        const primary = tab.href === "/app/plan";
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full transition-transform active:scale-95 ${
              active ? "text-accent-dark" : "text-ink/65"
            }`}
          >
            {active && !primary && (
              <motion.span
                layoutId="tab-highlight"
                aria-hidden="true"
                className="absolute inset-x-1 inset-y-1.5 rounded-full bg-accent/10"
                transition={{ type: "spring", damping: 30, stiffness: 380 }}
              />
            )}
            {primary ? (
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-accent-dark text-white">
                <Icon name={tab.icon} size={19} />
              </span>
            ) : (
              <Icon name={tab.icon} size={22} className="relative" />
            )}
            <span className={`relative text-[11px] ${active ? "font-bold" : "font-medium"}`}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
