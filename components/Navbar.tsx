"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import StartButton from "./StartButton";

export default function Navbar() {
  const pathname = usePathname();

  // The product app (/app/*) has its own shell and bottom nav — no marketing header there.
  if (pathname?.startsWith("/app")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-bone/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3 text-ink" aria-label="Sidepath home">
          <Logo />
          <span className="hidden font-serif text-xs italic text-terracotta/0 transition-colors duration-200 group-hover:text-terracotta/70 sm:inline">
            Why not?
          </span>
        </Link>

        <StartButton variant="primary" className="px-5 py-2.5 text-[13px]">
          Start exploring
        </StartButton>
      </div>

      {/* Dashed trail instead of a flat rule — the brand's winding-path motif, flattened to a seam */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 2"
        preserveAspectRatio="none"
        className="block h-px w-full"
      >
        <line x1="0" y1="1" x2="400" y2="1" stroke="#C0532E" strokeWidth="1.2" strokeDasharray="1 5" opacity="0.5" />
      </svg>
    </header>
  );
}
