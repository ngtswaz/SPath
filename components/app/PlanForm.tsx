"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { DESTINATIONS, TRIP_FOR, tripHref } from "@/lib/app-data";
import { DEFAULT_PROFILE, KEYS, useLocal, type Profile } from "@/lib/store";
import Button from "@/components/Button";
import Photo from "@/components/ui/Photo";
import { Card, Field, Notice } from "@/components/ui";
import type { StoredPoints } from "@/components/app/editors";

const DENSITY = [
  { id: "easy", label: "Easy", detail: "One or two things a day" },
  { id: "balanced", label: "Balanced", detail: "A full day with breathing room" },
  { id: "packed", label: "Packed", detail: "See as much as possible" },
];

interface PlanDraft {
  to: string;
  start: string;
  end: string;
  budget: string;
  density: string;
  from: string;
  travellers: string;
}

const addDays = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

/** The trip form: everything the itinerary engine will need, in the order the spec lists it. */
export default function PlanForm({ initialTo, initialDays }: { initialTo?: string; initialDays?: number }) {
  const router = useRouter();
  const [profile] = useLocal<Profile>(KEYS.profile, DEFAULT_PROFILE);
  const [points] = useLocal<StoredPoints[]>(KEYS.points, []);
  const [, saveDraft] = useLocal<PlanDraft | null>(KEYS.plan, null);

  const first = DESTINATIONS.find((d) => d.id === initialTo) ?? DESTINATIONS[0];
  const [to, setTo] = useState(first.id);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [budget, setBudget] = useState(String(first.price));
  const [density, setDensity] = useState("balanced");
  const [from, setFrom] = useState("");
  const [travellers, setTravellers] = useState("1");

  const destination = DESTINATIONS.find((d) => d.id === to) ?? first;

  // Dates default to two weeks out for the destination's usual length; set
  // after mount so server and client render the same markup.
  useEffect(() => {
    const s = addDays(new Date().toISOString().slice(0, 10), 14);
    setStart(s);
    setEnd(addDays(s, (initialDays ?? first.days) - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile.home) setFrom((f) => f || profile.home);
  }, [profile.home]);

  function submit(e: FormEvent) {
    e.preventDefault();
    saveDraft({ to, start, end, budget, density, from, travellers });
    router.push(tripHref(to));
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="space-y-6">
        <Field label="Where to" htmlFor="plan-to">
          <select
            id="plan-to"
            className="field"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              const d = DESTINATIONS.find((x) => x.id === e.target.value);
              if (d) {
                setBudget(String(d.price));
                if (start) setEnd(addDays(start, d.days - 1));
              }
            }}
          >
            {DESTINATIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}, {d.country}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="From" htmlFor="plan-start">
            <input id="plan-start" type="date" className="field" required value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Until" htmlFor="plan-end">
            <input id="plan-end" type="date" className="field" required min={start} value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Budget, all in" htmlFor="plan-budget" hint="US dollars per person, flights included.">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[15px] text-ink/60">$</span>
              <input id="plan-budget" type="number" min={50} step={10} inputMode="numeric" className="field pl-8 font-mono" required value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
          </Field>
          <Field label="Travellers" htmlFor="plan-travellers">
            <input id="plan-travellers" type="number" min={1} max={12} inputMode="numeric" className="field" required value={travellers} onChange={(e) => setTravellers(e.target.value)} />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-ink">How full should the days be</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {DENSITY.map((d) => (
              <label
                key={d.id}
                className={`flex min-h-[64px] cursor-pointer flex-col justify-center rounded-xl border px-4 py-2.5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta-dark ${
                  density === d.id ? "border-ink bg-ink text-bone" : "border-ink/20 bg-white text-ink hover:border-ink/40"
                }`}
              >
                <input type="radio" name="density" value={d.id} checked={density === d.id} onChange={() => setDensity(d.id)} className="sr-only" />
                <span className="text-[15px] font-semibold">{d.label}</span>
                <span className={`text-[13px] ${density === d.id ? "text-bone/80" : "text-ink/65"}`}>{d.detail}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Starting from" htmlFor="plan-from" hint="The city you leave from.">
          <input id="plan-from" className="field" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Your home city" />
        </Field>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-ink">Points and miles</p>
            <p className="text-[13px] text-ink/65">
              {points.length === 0
                ? "None added. Add balances to see where they can pay for part of the trip."
                : `${points.length} ${points.length === 1 ? "balance" : "balances"} will be considered for this trip.`}
            </p>
          </div>
          <Link href="/app/wallet" className="shrink-0 text-sm font-semibold text-terracotta-dark underline-offset-4 hover:underline">
            {points.length === 0 ? "Add" : "Edit"}
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden lg:sticky lg:top-8">
        <Photo name={destination.photo} width={520} className="aspect-[16/10]" />
        <div className="p-5">
          <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">
            {destination.name}
            <span className="ml-2 font-sans text-sm font-normal text-ink/65">{destination.country}</span>
          </h2>
          <p className="mt-1 text-sm leading-snug text-ink/75">{destination.blurb}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ink/10 pt-4 text-sm">
            <div>
              <dt className="text-ink/65">Typical trip</dt>
              <dd className="font-mono font-bold text-ink">{destination.days} days</dd>
            </div>
            <div>
              <dt className="text-ink/65">Typical cost</dt>
              <dd className="font-mono font-bold text-ink">${destination.price}</dd>
            </div>
          </dl>
          <Button type="submit" className="mt-5 w-full">
            Build my itinerary
          </Button>
          <Notice className="mt-4">
            {TRIP_FOR[to]
              ? "The live planner isn't connected yet. This opens a sample itinerary for this place."
              : "The live planner isn't connected yet, and there is no sample itinerary for this place."}
          </Notice>
        </div>
      </Card>
    </form>
  );
}
