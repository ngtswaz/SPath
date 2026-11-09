"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DESTINATIONS } from "@/lib/app-data";

export default function ExplorePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DESTINATIONS;
    return DESTINATIONS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="shrink-0 px-6 pb-4 pt-7">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink/72">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </p>
        <h1 className="mt-2 mb-3.5 font-serif text-[28px] font-semibold leading-tight tracking-tightish">
          Where to, <em className="text-terracotta italic">you</em>?
        </h1>
        <div className="flex items-center gap-2.5 rounded-full border border-sandstone bg-cream px-4 py-3.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink/60" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.6" y2="16.6" />
          </svg>
          <label htmlFor="explore-search" className="sr-only">Search a destination</label>
          <input
            id="explore-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="A city, a vibe, a 'why not'"
            className="min-w-0 flex-1 border-none bg-transparent text-sm text-ink outline-none placeholder:text-ink/50"
          />
        </div>
      </div>

      <div className="relative mx-6 min-h-[260px] flex-1 overflow-hidden rounded-[20px] border border-sandstone bg-cream">
        <svg width="100%" height="100%" viewBox="0 0 342 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0">
          <path d="M-10 60 Q 90 10, 180 70 T 360 90" fill="none" stroke="#E0C9A6" strokeWidth="1.2" opacity="0.8" />
          <path d="M-10 150 Q 100 110, 200 165 T 360 180" fill="none" stroke="#E0C9A6" strokeWidth="1.2" opacity="0.7" />
          <path d="M-10 260 Q 110 230, 210 275 T 360 290" fill="none" stroke="#E0C9A6" strokeWidth="1.2" opacity="0.6" />
          <path d="M-10 340 Q 120 310, 230 350 T 360 360" fill="none" stroke="#E0C9A6" strokeWidth="1.2" opacity="0.5" />
        </svg>

        {filtered.map((d) => (
          <Link
            key={d.id}
            href={`/app/trip/${TRIP_FOR[d.id] ?? d.id}`}
            aria-label={`View ${d.name}`}
            className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${d.pos.x * 100}%`, top: `${d.pos.y * 100}%` }}
          >
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[2.5px] border-terracotta bg-bone">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            </span>
            <span className="absolute -top-7 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] text-bone">
              {d.name}
            </span>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-ink/60">
            Nothing matches &ldquo;{query}&rdquo; yet &mdash; more destinations on the way.
          </p>
        )}
      </div>

      <div className="mt-3 shrink-0 bg-bone pt-3">
        <div className="mx-auto mb-2.5 h-1 w-9 rounded-full bg-sandstone" />
        <div className="flex items-baseline justify-between px-6 pb-2.5">
          <h2 className="font-serif text-[17px] italic text-ink">Postcards from the road</h2>
          <Link href="/app/trips" className="text-xs font-semibold">See all</Link>
        </div>
        <div className="flex gap-3.5 overflow-x-auto px-6 pb-5">
          {DESTINATIONS.map((d, i) => (
            <Link
              key={d.id}
              href={`/app/trip/${TRIP_FOR[d.id] ?? d.id}`}
              className="block w-[148px] shrink-0"
              style={{ transform: `rotate(${i % 2 === 0 ? -2 : 1.5}deg)` }}
            >
              <div className="relative rounded-md border-[1.5px] border-sandstone bg-cream shadow-[0_6px_14px_rgba(38,32,27,.16)]">
                <div
                  className="h-[98px] rounded-t-[5px]"
                  style={{ background: `linear-gradient(135deg, ${d.gradient[0]}, ${d.gradient[1]})` }}
                />
                <div className="p-3">
                  <div className="font-serif text-sm italic">{d.name}, {d.country}</div>
                  <div className="mt-1 font-mono text-[10.5px] text-ink/72">
                    ${d.price} · {d.days} days
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Demo-only mapping from destination to the one seeded trip we have.
const TRIP_FOR: Record<string, string> = { lisbon: "lisbon-nov" };
