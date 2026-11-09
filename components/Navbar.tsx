"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { SPOKES } from "@/lib/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The product app (/app/*) has its own shell and bottom nav — no marketing header there.
  if (pathname?.startsWith("/app")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-bone/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-center gap-3 text-ink" aria-label="Sidepath home">
          <Logo />
          <span className="hidden font-serif text-xs italic text-terracotta/0 transition-colors duration-200 group-hover:text-terracotta/70 sm:inline">
            Why not?
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {SPOKES.map((s) => {
            const active = pathname === s.href;
            return (
              <Link
                key={s.key}
                href={s.href}
                className="group relative py-1 font-sans text-[13.5px] font-medium lowercase tracking-tight text-ink/75 transition-colors hover:text-ink"
              >
                {s.label.toLowerCase()}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 40 6"
                  preserveAspectRatio="none"
                  className={`absolute -bottom-1.5 left-0 h-1.5 w-full transition-opacity duration-200 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                  }`}
                >
                  <path
                    d="M0 3 Q 10 0, 20 3 T 40 3"
                    fill="none"
                    stroke="#C0532E"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            );
          })}
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="3" y1="7" x2="21" y2="7" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        </button>
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

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu backdrop"
            className="absolute inset-0 bg-night/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[82%] max-w-xs flex-col gap-1 bg-bone px-6 py-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>
            {SPOKES.map((s) => {
              const active = pathname === s.href;
              return (
                <Link
                  key={s.key}
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-4 font-serif text-2xl lowercase hover:bg-ink/5 ${
                    active ? "italic text-terracotta-dark" : "text-ink"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
