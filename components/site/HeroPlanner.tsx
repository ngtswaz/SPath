"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DESTINATIONS } from "@/lib/app-data";
import Button from "@/components/Button";

/**
 * The first thing a visitor can do: say where and for how long. It hands
 * both answers to the real trip form inside the app rather than being a
 * separate toy.
 */
export default function HeroPlanner() {
  const router = useRouter();
  const [to, setTo] = useState(DESTINATIONS[0].id);
  const [days, setDays] = useState(String(DESTINATIONS[0].days));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/app/plan?to=${to}&days=${encodeURIComponent(days)}`);
      }}
      className="grid gap-2 rounded-3xl bg-white p-2 shadow-float sm:grid-cols-[1.4fr_1fr_auto]"
    >
      <div className="rounded-2xl px-3 pb-1.5 pt-2 focus-within:bg-ink/[0.04]">
        <label htmlFor="hero-to" className="block text-xs font-semibold text-ink/70">
          Where to
        </label>
        <select
          id="hero-to"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            const d = DESTINATIONS.find((x) => x.id === e.target.value);
            if (d) setDays(String(d.days));
          }}
          className="h-8 w-full cursor-pointer border-0 bg-transparent p-0 text-[15px] font-medium text-ink focus:outline-none"
        >
          {DESTINATIONS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}, {d.country}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-2xl px-3 pb-1.5 pt-2 focus-within:bg-ink/[0.04] sm:border-l sm:border-ink/10">
        <label htmlFor="hero-days" className="block text-xs font-semibold text-ink/70">
          How many days
        </label>
        <input
          id="hero-days"
          type="number"
          min={1}
          max={30}
          inputMode="numeric"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="h-8 w-full border-0 bg-transparent p-0 text-[15px] font-medium text-ink focus:outline-none"
        />
      </div>
      <Button type="submit" className="sm:px-6">
        Plan this trip
      </Button>
    </form>
  );
}
