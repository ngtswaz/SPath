"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/icons";
import { TAB_ITEMS, isActive } from "./nav";

export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App"
      className="sticky bottom-0 z-30 flex h-[66px] shrink-0 border-t border-ink/10 bg-bone/95 backdrop-blur md:hidden"
    >
      {TAB_ITEMS.map((tab) => {
        const active = isActive(pathname, tab.href);
        const primary = tab.href === "/app/plan";
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 ${
              active ? "text-terracotta-dark" : "text-ink/70"
            }`}
          >
            {primary ? (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta-dark text-white">
                <Icon name={tab.icon} size={18} />
              </span>
            ) : (
              <Icon name={tab.icon} size={22} filled={active && tab.icon === "saved"} />
            )}
            <span className={`text-[11px] ${active ? "font-bold" : "font-medium"}`}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
