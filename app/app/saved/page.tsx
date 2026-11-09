"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DESTINATIONS } from "@/lib/app-data";

export default function SavedPage() {
  // Demo-only: "saved" state lives in localStorage since there's no
  // backend yet. The Trip screen's save button writes here.
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sidepath_saved_destinations");
      setSavedIds(raw ? JSON.parse(raw) : DESTINATIONS.map((d) => d.id));
    } catch {
      setSavedIds(DESTINATIONS.map((d) => d.id));
    }
  }, []);

  const saved = DESTINATIONS.filter((d) => savedIds.includes(d.id));

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-7">
      <h1 className="font-serif text-2xl font-semibold tracking-tightish">Saved</h1>
      <p className="mt-1 text-[13px] text-ink/70">Places you&rsquo;ve pinned for later.</p>

      {saved.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/60">Nothing saved yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {saved.map((d) => (
            <Link
              key={d.id}
              href={`/app/explore`}
              className="overflow-hidden rounded-[10px] border-[1.5px] border-sandstone bg-cream"
            >
              <div
                className="h-20"
                style={{ background: `linear-gradient(135deg, ${d.gradient[0]}, ${d.gradient[1]})` }}
              />
              <div className="p-2.5">
                <div className="font-serif text-sm italic">{d.name}</div>
                <div className="mt-0.5 font-mono text-[10px] text-ink/72">${d.price} · {d.days}d</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
