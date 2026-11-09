"use client";

import Link from "next/link";
import { DESTINATIONS, TRIPS } from "@/lib/app-data";

export default function TripsPage() {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-7">
      <h1 className="font-serif text-2xl font-semibold tracking-tightish">Your trips</h1>
      <p className="mt-1 text-[13px] text-ink/70">Upcoming and past, in one trail.</p>

      <div className="mt-6 flex flex-col gap-2.5">
        {TRIPS.map((trip) => {
          const d = DESTINATIONS.find((x) => x.id === trip.destinationId);
          if (!d) return null;
          return (
            <Link
              key={trip.id}
              href={`/app/trip/${trip.id}`}
              className="flex items-center gap-3 rounded-[10px] border-[1.5px] border-sandstone bg-cream p-2.5"
            >
              <div
                className="h-[52px] w-[52px] shrink-0 rounded-[7px]"
                style={{ background: `linear-gradient(135deg, ${d.gradient[0]}, ${d.gradient[1]})` }}
              />
              <div className="min-w-0 flex-1">
                <div className="font-serif text-sm italic">{d.name}, {d.country}</div>
                <div className="mt-0.5 font-mono text-[10.5px] text-ink/72">
                  Upcoming · {trip.dateRange}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#26201B" strokeWidth="2" opacity=".4" className="shrink-0" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          );
        })}

        <p className="mt-2 text-center text-[13px] text-ink/60">
          Planning a new trip isn&rsquo;t built yet &mdash; the trip form and planner are next
          on the build order.
        </p>
      </div>
    </div>
  );
}
