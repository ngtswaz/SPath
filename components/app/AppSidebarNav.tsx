"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import Icon from "@/components/ui/icons";
import { NAV_GROUPS, isActive } from "./nav";

/**
 * The desktop counterpart to AppBottomNav. Below md the tab bar owns
 * navigation and this renders nothing; at md and up it is a fixed rail
 * that lists every section, so nothing is more than one click away.
 */
export default function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App"
      className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col overflow-y-auto border-r border-ink/10 bg-cream px-4 py-6 md:flex"
    >
      <Link href="/" className="mb-7 flex min-h-[44px] items-center px-2 text-ink" aria-label="Sidepath home">
        <Logo />
      </Link>

      {NAV_GROUPS.map((group) => (
        <div key={group.title} className="mb-5">
          <p className="mb-1 px-3 text-xs font-semibold text-ink/55">{group.title}</p>
          {group.items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[42px] items-center gap-3 rounded-xl px-3 text-[14.5px] ${
                  active ? "bg-white font-semibold text-terracotta-dark shadow-[0_0_0_1px_rgba(38,32,27,0.08)]" : "font-medium text-ink/80 hover:bg-ink/[0.05]"
                }`}
              >
                <Icon name={item.icon} size={19} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
