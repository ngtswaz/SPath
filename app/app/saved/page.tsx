"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DESTINATIONS, tripHref } from "@/lib/app-data";
import Postcard from "@/components/app/Postcard";
import { Pin } from "@/components/paper/WaxSeal";

// Each pinned card sits a little differently, so the board looks handled
// rather than laid out. Cycles if there are more cards than entries.
const PLACEMENT = [
  "-rotate-3 mr-auto",
  "rotate-[2.4deg] ml-auto",
  "-rotate-[1.4deg] mr-auto ml-2",
  "rotate-[1.8deg] ml-auto mr-2",
];

export default function SavedPage() {
  // Demo-only: "saved" state lives in localStorage since there's no
  // backend yet.
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
    <div className="flex flex-col px-6 pb-12 pt-7 md:px-10 md:pt-10">
      <h1 className="font-serif text-3xl font-semibold tracking-tightish text-ink md:text-4xl">Saved</h1>
      <p className="mt-1 text-[13.5px] text-ink/80">Places you&rsquo;ve pinned for later.</p>

      {saved.length === 0 ? (
        <p className="mt-12 text-center font-serif text-base italic text-ink/80">
          Nothing pinned yet. Save a place from Explore and it lands here.
        </p>
      ) : (
        <div className="mt-[30px] flex flex-col md:grid md:grid-cols-2 md:gap-x-7 md:gap-y-9">
          {saved.map((d, i) => (
            <Link
              key={d.id}
              href={tripHref(d.id)}
              className={`group relative block w-[88%] max-w-[340px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-dark md:w-full md:max-w-none max-md:[&:not(:first-child)]:-mt-1.5 ${PLACEMENT[i % PLACEMENT.length]}`}
            >
              <Postcard destination={d} sceneClassName="h-[130px] md:h-[150px]" className="pb-[11px]">
                <Pin className="absolute -top-[7px] left-1/2 -ml-[7px]" />
                <span className="mt-[9px] flex items-baseline gap-2 px-[3px]">
                  <span className="font-serif text-[21px] italic text-ink decoration-terracotta decoration-wavy underline-offset-4 group-hover:underline">
                    {d.name}
                  </span>
                  <span className="text-[12.5px] text-ink/78">{d.country}</span>
                  <span aria-hidden="true" className="leader" />
                  <span className="font-mono text-sm font-bold text-ink">${d.price}</span>
                  <span className="font-mono text-[11px] text-ink/78">{d.days} days</span>
                </span>
              </Postcard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
