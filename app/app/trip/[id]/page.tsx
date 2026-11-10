"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DESTINATIONS, TRIPS } from "@/lib/app-data";

export default function TripPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const trip = TRIPS.find((t) => t.id === params.id);
  const destination = trip ? DESTINATIONS.find((d) => d.id === trip.destinationId) : undefined;

  if (!trip || !destination) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="font-serif text-xl italic text-ink/80">No itinerary here yet.</p>
        <p className="text-sm text-ink/65">
          This destination doesn&rsquo;t have a planned trip in this preview. The itinerary
          builder (trip form, planner, perk offers) isn&rsquo;t built yet. See the
          product spec for the full build order.
        </p>
        <button
          type="button"
          onClick={() => router.push("/app/explore")}
          className="mt-2 rounded-full bg-terracotta-dark px-6 py-3 text-sm font-semibold text-bone"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="shrink-0 px-6 pb-4 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/app/explore"
            aria-label="Back to Explore"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-sandstone bg-cream"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#26201B" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <button
            type="button"
            aria-label="Save trip"
            aria-pressed={saved}
            onClick={() => setSaved((s) => !s)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-sandstone bg-cream"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? "#C0532E" : "none"}
              stroke={saved ? "#C0532E" : "#26201B"}
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20.8 8.6c0-3-2.4-5.4-5.4-5.4-1.7 0-3.2.8-4.2 2-1-1.2-2.5-2-4.2-2-3 0-5.4 2.4-5.4 5.4 0 6 9.6 11 9.6 11s9.6-5 9.6-11z" />
            </svg>
          </button>
        </div>
        <h1 className="font-serif text-[27px] font-semibold tracking-tightish">{destination.name}</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 font-mono text-[11.5px] text-ink/72">
          <span>{trip.days.length}+ days</span>
          <span>{trip.dateRange}</span>
          <span>${trip.budget} all in</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-1">
        {trip.days.map((day, i) => (
          <div key={day.day} className="flex gap-3.5">
            <div className="flex w-[50px] shrink-0 flex-col items-center">
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-terracotta font-mono text-[11px] font-bold text-terracotta-dark">
                D{day.day}
              </div>
              {i < trip.days.length - 1 && (
                <div className="mt-1 w-0 flex-1 border-l-[1.5px] border-dashed border-sandstone" />
              )}
            </div>
            <div className="mb-[18px] flex-1 overflow-hidden rounded-[10px] border-[1.5px] border-sandstone bg-cream">
              <div
                className="h-[72px]"
                style={{ background: `linear-gradient(135deg, ${day.gradient[0]}, ${day.gradient[1]})` }}
              />
              <div className="p-3.5">
                <div className="mb-2 font-serif text-[15px] italic">{day.title}</div>
                {day.stops.map((stop) => (
                  <div key={stop.name} className="mb-1.5 flex items-center gap-1.5 text-[12.5px] last:mb-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C0532E" strokeWidth="2.4" className="shrink-0" aria-hidden="true">
                      <circle cx="12" cy="10" r="3" />
                      <path d="M12 21s7-7.5 7-12a7 7 0 0 0-14 0c0 4.5 7 12 7 12z" />
                    </svg>
                    <span className="flex-1">{stop.name}</span>
                    <span className="font-mono text-[10.5px] text-ink/72">{stop.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <p className="pb-2 pt-1 text-center font-mono text-[11px] text-ink/72">
          Full planner (live prices, perk offers, alternatives per slot) isn&rsquo;t built yet.
          This is a seeded itinerary for preview.
        </p>
      </div>
    </div>
  );
}
