"use client";

import { useEffect, useMemo, useState } from "react";
import { DESTINATIONS, tripHref } from "@/lib/app-data";
import SeaChart from "@/components/app/SeaChart";
import { DestinationRow, RowBoard } from "@/components/app/DestinationRow";

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
    <div className="flex flex-col px-6 pb-10 pt-[26px] md:px-10 md:pt-10">
      <p className="font-mono text-[11px] text-ink/78">
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </p>
      <h1 className="mb-4 mt-1.5 font-serif text-[34px] font-medium italic leading-tight tracking-tightish text-ink md:text-5xl">
        Where to, you?
      </h1>

      {/* Written on the page rather than boxed: one ink rule under the line. */}
      <div className="mb-[22px] flex items-center gap-2.5 border-b-[1.5px] border-ink px-0.5 focus-within:border-terracotta-dark">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-ink" aria-hidden="true">
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
          className="h-[46px] min-w-0 flex-1 border-none bg-transparent font-serif text-base italic text-ink outline-none placeholder:text-ink/60"
        />
      </div>

      {filtered.length > 0 ? (
        <SeaChart destinations={filtered} />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center border-[1.5px] border-dashed border-ink/50 px-8 text-center font-serif text-base italic text-ink/80">
          Nothing on the chart for &ldquo;{query}&rdquo; yet. More destinations on the way.
        </div>
      )}

      {filtered.length > 0 && (
        <>
          <h2 className="mb-1 mt-[22px] font-serif text-lg font-medium italic text-ink">Open now</h2>
          <RowBoard>
            {filtered.map((d, i) => (
              <DestinationRow
                key={d.id}
                href={tripHref(d.id)}
                name={d.name}
                country={d.country}
                tag={savedIds.includes(d.id) ? "saved" : "open"}
                price={d.price}
                days={d.days}
                index={i}
              />
            ))}
          </RowBoard>
        </>
      )}
    </div>
  );
}
