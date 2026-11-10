"use client";

import WaxSeal from "@/components/paper/WaxSeal";
import { useStartExploring } from "@/components/StartButton";

/**
 * The home page's one call to action, as a wax seal you press. Same
 * destination logic as StartButton (quiz for a first visit, Explore after).
 */
export default function SealStart({ className = "" }: { className?: string }) {
  const go = useStartExploring();
  return (
    <button
      type="button"
      onClick={go}
      className={`group flex items-center gap-3.5 rounded-[3px] text-left text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-dark ${className}`}
    >
      <WaxSeal size={72} className="transition-transform duration-150 group-hover:-rotate-6 group-active:scale-95" />
      <span className="block">
        <span className="block font-serif text-[25px] font-semibold leading-tight tracking-tightish md:text-[28px]">
          Start exploring
        </span>
        <svg aria-hidden="true" width="168" height="8" viewBox="0 0 168 8" className="mt-0.5 block">
          <path
            d="M1 5 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0"
            fill="none"
            stroke="#C0532E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span className="mt-1.5 block font-mono text-[10px] text-ink/80">No ads. No booking fees. Ever.</span>
      </span>
    </button>
  );
}
