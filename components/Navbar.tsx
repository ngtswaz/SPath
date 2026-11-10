"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import StartButton from "./StartButton";
import Icon from "@/components/ui/icons";

export const SITE_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/mission", label: "Mission" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the phone menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // The product app (/app/*) has its own shell and nav, so no site header there.
  if (pathname?.startsWith("/app")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-bone/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="flex min-h-[44px] items-center text-ink" aria-label="Sidepath home">
          <Logo />
        </Link>

        <nav aria-label="Site" className="hidden items-center gap-1 md:flex">
          {SITE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/[0.06] ${
                pathname === l.href ? "text-terracotta-dark" : "text-ink/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/signin" className="hidden min-h-[44px] items-center rounded-lg px-3 text-sm font-semibold text-ink hover:bg-ink/[0.06] sm:flex">
            Sign in
          </Link>
          <StartButton className="min-h-[42px] px-4 py-2 text-sm">Start exploring</StartButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-ink/[0.06] md:hidden"
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="site-menu" aria-label="Site" className="border-t border-ink/10 bg-bone px-5 pb-4 pt-2 md:hidden">
          {[...SITE_LINKS, { href: "/signin", label: "Sign in" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex min-h-[48px] items-center border-b border-ink/10 text-[15px] font-medium text-ink last:border-b-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
