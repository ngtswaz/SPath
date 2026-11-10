"use client";

import { useEffect, useMemo, useState } from "react";
import { DESTINATIONS } from "@/lib/app-data";
import RouteMap from "@/components/app/RouteMap";
import { DestinationRow, RowBoard } from "@/components/app/DestinationRow";

// Demo-only mapping from destination to the one seeded trip we have.
const TRIP_FOR: Record<string, string> = { lisbon: "lisbon-nov" };

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sidepath_saved_destinations");
      setSavedIds(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedIds([]);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DESTINATIONS;
    return DESTINATIONS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-7">
      <p className="font-mono text-[11px] text-ink/55">
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </p>
      <h1 className="mb-6 mt-2 font-serif text-[34px] italic leading-tight tracking-tightish text-ink">
        Where to, you?
      </h1>

      <div className="mb-7 border-[1.5px] border-ink bg-bone">
        <div className="flex items-center gap-2.5 px-4 py-3.5">
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
            className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-ink/50"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <RouteMap destinations={filtered} tripFor={TRIP_FOR} />
      ) : (
        <div className="flex h-[260px] items-center justify-center rounded-[3px] border border-dashed border-sandstone px-8 text-center text-sm text-ink/60">
          Nothing matches &ldquo;{query}&rdquo; yet. More destinations on the way.
        </div>
      )}

      <p className="mb-2.5 mt-8 font-mono text-[11px] text-ink/50">Nearby, open now</p>
      <RowBoard>
        {filtered.map((d) => (
          <DestinationRow
            key={d.id}
            href={`/app/trip/${TRIP_FOR[d.id] ?? d.id}`}
            name={d.name}
            country={d.country}
            tag={savedIds.includes(d.id) ? "saved" : "open"}
            price={d.price}
            days={d.days}
          />
        ))}
      </RowBoard>
    </div>
  );
}
