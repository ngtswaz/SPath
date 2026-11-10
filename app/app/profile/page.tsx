"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DESTINATIONS, PROFILE_STAMPS, TRIPS, type PassportStamp } from "@/lib/app-data";
import { ListRow, RowBoard } from "@/components/app/DestinationRow";
import WaxSeal from "@/components/paper/WaxSeal";

const TILT = [-8, 5, -4, 7, -11];

/** One inked entry stamp. The outline cycles through five shapes so a row
 * of them looks like a real passport page rather than a set of badges. */
function InkStamp({ stamp, index }: { stamp: PassportStamp; index: number }) {
  const c = stamp.color;
  const shapes = [
    <g key="0" fill="none" stroke={c}><circle cx="39" cy="39" r="34" strokeWidth="2.2" /><circle cx="39" cy="39" r="27.5" strokeWidth="1" /></g>,
    <g key="1" fill="none" stroke={c}><rect x="5" y="15" width="68" height="48" rx="4" strokeWidth="2.2" /><rect x="10" y="20" width="58" height="38" rx="2" strokeWidth="1" /></g>,
    <g key="2" fill="none" stroke={c}><ellipse cx="39" cy="39" rx="36" ry="25" strokeWidth="2.2" /><ellipse cx="39" cy="39" rx="30.5" ry="19.5" strokeWidth="1" /></g>,
    <g key="3" fill="none" stroke={c} strokeLinejoin="round"><path d="M39 4 L69 21 V57 L39 74 L9 57 V21 Z" strokeWidth="2.2" /><path d="M39 11 L63 24.5 V53.5 L39 67 L15 53.5 V24.5 Z" strokeWidth="1" /></g>,
    <g key="4" fill="none" stroke={c}><circle cx="39" cy="39" r="33" strokeWidth="5" strokeDasharray="1.4 5.5" /><circle cx="39" cy="39" r="26.5" strokeWidth="1.6" /></g>,
  ];
  return (
    <svg
      role="img"
      aria-label={stamp.name}
      width="78"
      height="78"
      viewBox="0 0 78 78"
      className="opacity-90"
      style={{ transform: `rotate(${TILT[index % TILT.length]}deg)` }}
    >
      {shapes[index % shapes.length]}
      <text
        x="39"
        y="45"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-mono), monospace" }}
        fontWeight="700"
        fontSize="17"
        fill={c}
      >
        {stamp.code}
      </text>
    </svg>
  );
}

const pad = (s: string, n: number) => (s + "<".repeat(n)).slice(0, n);

export default function ProfilePage() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLabel(localStorage.getItem("sidepath_label"));
    } catch {
      setLabel(null);
    }
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-66px)] flex-col px-6 pt-[26px] md:min-h-screen md:px-10 md:pt-10">
      <div className="flex items-center gap-3.5">
        <WaxSeal size={70} glyph="letter" letter="J" />
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-[28px] font-semibold leading-[1.1] tracking-tightish text-ink">Jashan</h1>
          {label && <p className="mt-0.5 font-serif text-[14.5px] italic leading-snug text-terracotta-dark">{label}</p>}
          <p className="mt-[3px] font-mono text-[11px] text-ink/80">Since 2026</p>
        </div>
        {label && (
          <Link
            href="/app/onboarding"
            aria-label="Retake the quiz"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink bg-bone/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-dark"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#26201B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </Link>
        )}
      </div>

      {!label && (
        <Link
          href="/app/onboarding"
          className="group mt-4 flex min-h-[48px] items-center gap-2.5 border-[1.5px] border-dashed border-terracotta-dark px-3.5 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-dark"
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="-12 -12 24 24" className="shrink-0 transition-transform duration-300 group-hover:rotate-45">
            <circle r="10.5" fill="none" stroke="#9E411F" strokeWidth="1.3" />
            <path d="M0 -8 L2.6 0 L-2.6 0 Z" fill="#9E411F" />
            <path d="M0 8 L2.6 0 L-2.6 0 Z" fill="#26201B" />
          </svg>
          <span className="font-serif text-[15.5px] italic text-ink">Take the quiz to find your pattern</span>
        </Link>
      )}

      <h2 className="mt-[26px] font-serif text-[19px] font-medium italic text-ink">Passport stamps</h2>
      <p className="mb-3 mt-[3px] text-[12.5px] text-ink/80">{PROFILE_STAMPS.length} places, 0 regrets</p>
      <div className="flex flex-wrap gap-2.5">
        {PROFILE_STAMPS.map((s, i) => (
          <InkStamp key={s.code} stamp={s} index={i} />
        ))}
        {/* An empty page waiting for the next one. Adding places isn't built yet. */}
        <div aria-hidden="true" className="flex h-[78px] w-[78px] items-center justify-center rounded-full border-[1.8px] border-dashed border-ink/50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#26201B" strokeWidth="2" strokeLinecap="round" opacity=".55">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </div>

      <h2 className="mb-1.5 mt-[26px] font-serif text-[19px] font-medium italic text-ink">Your trips</h2>
      <RowBoard>
        {TRIPS.map((trip) => {
          const d = DESTINATIONS.find((x) => x.id === trip.destinationId);
          if (!d) return null;
          return (
            <ListRow
              key={trip.id}
              href={`/app/trip/${trip.id}`}
              title={d.name}
              subtitle={d.country}
              tagLabel="Upcoming"
              primary={trip.dateRange}
              secondary={`$${trip.budget} all in`}
              stacked
            />
          );
        })}
      </RowBoard>

      {/* The machine-readable strip from the bottom of a passport page. Decorative only. */}
      <div aria-hidden="true" className="mt-auto overflow-hidden whitespace-nowrap pb-3.5 pt-10 font-mono text-xs leading-normal tracking-[0.08em] text-ink/40">
        <div>{pad("P<SIDEPATH<<JASHAN", 44)}</div>
        <div>{pad(`${PROFILE_STAMPS.map((s) => s.code).join("<")}<<${String(PROFILE_STAMPS.length).padStart(2, "0")}`, 44)}</div>
      </div>
    </div>
  );
}
