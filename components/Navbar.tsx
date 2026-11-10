"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import StartButton from "./StartButton";

export default function Navbar() {
  const pathname = usePathname();

  // The product app (/app/*) has its own shell and nav, so no marketing header there.
  if (pathname?.startsWith("/app")) return null;

  return (
    <header className="paper fixed inset-x-0 top-0 z-50 border-b-[1.5px] border-dashed border-ink/50">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex min-h-[44px] items-center text-ink" aria-label="Sidepath home">
          <Logo />
        </Link>

        <StartButton variant="secondary" className="px-4 py-2 text-[13px]">
          Start exploring
        </StartButton>
      </div>
    </header>
  );
}
