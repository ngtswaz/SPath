"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Sidepath",
    links: [
      { href: "/mission", label: "Mission" },
      { href: "/join", label: "Join the waitlist" },
      { href: "/credits", label: "Photo credits" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/signin", label: "Sign in" },
      { href: "/signup", label: "Create an account" },
      { href: "/app/explore", label: "Open the app" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/app")) return null;

  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink/75">
            Travel isn&rsquo;t a luxury. It&rsquo;s yours. No ads, no affiliate
            commissions, no sponsored content. Ever.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-sm font-semibold text-ink">{col.title}</p>
            <ul className="mt-3 space-y-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-[36px] items-center text-sm text-ink/75 hover:text-ink hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-[13px] text-ink/65 md:px-8">
          <span className="font-mono text-xs">sidepath.travel</span>
          <span>Global pricing in USD. Not a booking platform.</span>
        </div>
      </div>
    </footer>
  );
}
