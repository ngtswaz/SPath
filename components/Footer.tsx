"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { SPOKES } from "@/lib/constants";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/app")) return null;

  return (
    <footer className="relative mt-24 border-t border-ink/10 bg-cream">
      <svg
        viewBox="0 0 400 24"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="h-6 w-full text-terracotta"
      >
        <path
          d="M0 12 Q 50 2, 100 12 T 200 12 T 300 12 T 400 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
      </svg>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            Travel isn&rsquo;t a luxury. It&rsquo;s yours. No ads, no affiliate
            commissions, no sponsored content. Ever.
          </p>
        </div>

        <nav aria-label="Footer" className="flex gap-10">
          <ul className="flex flex-col gap-3">
            {SPOKES.map((s) => (
              <li key={s.key}>
                <Link
                  href={s.href}
                  className="font-mono text-xs uppercase tracking-wide text-ink/70 hover:text-terracotta-dark"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-8 font-mono text-[11px] uppercase tracking-wide text-ink/70">
        Why not? · sidepath.travel
      </div>
    </footer>
  );
}
