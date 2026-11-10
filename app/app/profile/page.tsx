"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DESTINATIONS, PROFILE_STAMPS, TRIPS } from "@/lib/app-data";
import { ListRow, RowBoard } from "@/components/app/DestinationRow";

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
    <div className="flex min-h-screen flex-col">
      <div className="bg-night px-6 pb-5 pt-7 text-bone">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-terracotta font-serif text-xl font-semibold">
            J
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-serif text-xl font-semibold">Jashan</div>
            <div className="mt-0.5 font-mono text-[10.5px] text-bone/72">
              {label ? label : "Take the quiz to find your pattern"}
            </div>
            <div className="mt-0.5 font-mono text-[10.5px] text-bone/50">Since 2026</div>
          </div>
          <Link
            href="/app/onboarding"
            aria-label="Retake the quiz"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/25 bg-bone/10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF8F4" strokeWidth="2" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-2 pt-5">
        <h2 className="mb-1 font-serif text-[17px] italic text-ink">Passport stamps</h2>
        <div className="mb-3.5 text-xs text-ink/72">{PROFILE_STAMPS.length} places, 0 regrets</div>
        <div className="flex flex-wrap gap-2.5">
          {PROFILE_STAMPS.map((s, i) => (
            <div
              key={s.code}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 border-dashed"
              style={{ borderColor: s.color, transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (3 + i)}deg)` }}
            >
              <span className="font-mono text-[11px] font-bold" style={{ color: s.color }}>
                {s.code}
              </span>
            </div>
          ))}
          <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 border-dashed border-sandstone">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#26201B" strokeWidth="2" opacity=".4" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-5">
        <h2 className="mb-3 font-serif text-[17px] italic text-ink">Your trips</h2>
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
              />
            );
          })}
        </RowBoard>
      </div>
    </div>
  );
}
