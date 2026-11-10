"use client";

import Link from "next/link";
import { useState } from "react";
import { DESTINATIONS, SCENE_TONE, TRIPS, postmarkDate } from "@/lib/app-data";
import Button from "@/components/Button";
import Postcard from "@/components/app/Postcard";
import { Postmark, Stamp } from "@/components/paper/Stamp";

const ROUND_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-ink bg-bone/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-dark";

export default function TripPage({ params }: { params: { id: string } }) {
  const [saved, setSaved] = useState(false);
  const trip = TRIPS.find((t) => t.id === params.id);
  const destination = trip ? DESTINATIONS.find((d) => d.id === trip.destinationId) : undefined;

  if (!trip || !destination) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-8 text-center">
        <svg aria-hidden="true" width="34" height="34" viewBox="0 0 26 26">
          <path d="M5 5 L21 21 M21 5 L5 21" fill="none" stroke="#C0532E" strokeWidth="4.2" strokeLinecap="round" />
        </svg>
        <h1 className="font-serif text-2xl italic text-ink">No itinerary here yet.</h1>
        <p className="text-sm leading-relaxed text-ink/80">
          This destination doesn&rsquo;t have a planned trip in this preview. The itinerary
          builder (trip form, planner, perk offers) isn&rsquo;t built yet. See the
          product spec for the full build order.
        </p>
        <Button href="/app/explore" className="mt-2">
          Back to Explore
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-[22px] md:px-10 md:pt-8">
      <div className="flex items-center justify-between">
        <Link href="/app/explore" aria-label="Back to Explore" className={ROUND_BUTTON}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#26201B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <button
          type="button"
          aria-label="Save trip"
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className={ROUND_BUTTON}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? "#C0532E" : "none"} stroke="#9E411F" strokeWidth="2.2" aria-hidden="true">
            <path d="M20.8 8.6c0-3-2.4-5.4-5.4-5.4-1.7 0-3.2.8-4.2 2-1-1.2-2.5-2-4.2-2-3 0-5.4 2.4-5.4 5.4 0 6 9.6 11 9.6 11s9.6-5 9.6-11z" />
          </svg>
        </button>
      </div>

      {/* The trip arrives as a postcard: picture, greeting, a stamp worth
          exactly what the trip costs, and a postmark with the day it starts. */}
      <Postcard
        destination={destination}
        sceneClassName="h-[176px] md:h-[260px]"
        className="mx-1 mt-[18px] -rotate-[1.8deg] pb-3"
      >
        <div className="mt-2.5 flex items-baseline justify-between gap-3 px-[3px]">
          <h1 className="font-serif text-[23px] font-medium italic leading-tight tracking-[-0.01em] text-ink md:text-3xl">
            Greetings from {destination.name}
          </h1>
          <span className="whitespace-nowrap font-mono text-[9.5px] text-ink/80">{destination.coords}</span>
        </div>
        <div className="absolute -right-1.5 -top-3.5 rotate-[7deg]" style={{ filter: "drop-shadow(1px 1.5px 0 rgba(38,32,27,.2))" }}>
          <Stamp value={`$${trip.budget}`} tone={SCENE_TONE[destination.scene]} />
        </div>
        <Postmark
          city={destination.name}
          lines={[postmarkDate(trip.dateRange), String(new Date().getFullYear())]}
          waves
          className="absolute right-[42px] top-0 -rotate-[10deg]"
        />
      </Postcard>

      <div className="mt-6 flex flex-wrap gap-x-[18px] gap-y-1 font-mono text-xs text-ink/85">
        <span>{trip.days.length}+ days</span>
        <span>{trip.dateRange}</span>
        <span className="font-bold text-ink">${trip.budget} all in</span>
      </div>

      <div className="mt-[22px] border-t-[1.5px] border-ink pt-5">
        {trip.days.map((day) => (
          <div key={day.day} className="flex gap-4">
            <div className="flex w-11 shrink-0 flex-col items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-terracotta font-mono text-xs font-bold text-terracotta-dark">
                D{day.day}
              </div>
              <div className="mt-[5px] w-0 flex-1 border-l-2 border-dashed border-terracotta/70" />
            </div>
            <div className="min-w-0 flex-1 pb-[26px]">
              <h2 className="mb-2.5 mt-2 font-serif text-xl font-medium italic text-ink">{day.title}</h2>
              {day.stops.map((stop) => (
                <div key={stop.name} className="flex items-baseline gap-2 py-[5px] text-[13.5px] text-ink">
                  <span className="min-w-0">{stop.name}</span>
                  <span aria-hidden="true" className="leader" style={{ transform: "translateY(-3px)" }} />
                  <span className="shrink-0 font-mono text-[11.5px]">{stop.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* The trail ends, as it should, at an X. */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center">
            <svg aria-hidden="true" width="26" height="26" viewBox="0 0 26 26">
              <path d="M5 5 L21 21 M21 5 L5 21" fill="none" stroke="#C0532E" strokeWidth="4.2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-serif text-[15px] italic leading-snug text-ink/85">
            Full planner (live prices, perk offers, alternatives per slot) isn&rsquo;t built yet.
            This is a seeded itinerary for preview.
          </p>
        </div>
      </div>
    </div>
  );
}
