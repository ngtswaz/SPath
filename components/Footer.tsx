"use client";

import { usePathname } from "next/navigation";
import Logo from "./Logo";
import StartButton from "./StartButton";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/app")) return null;

  return (
    <footer className="paper relative border-t-[1.5px] border-dashed border-ink/50">
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

      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            Travel isn&rsquo;t a luxury. It&rsquo;s yours. No ads, no affiliate
            commissions, no sponsored content. Ever.
          </p>
        </div>

        <StartButton variant="secondary">Start exploring</StartButton>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-8 font-mono text-[11px] text-ink/60">
        sidepath.travel
      </div>
    </footer>
  );
}
