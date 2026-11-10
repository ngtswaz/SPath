"use client";

import Link from "next/link";
import { useState } from "react";
import { DESTINATIONS, TRIPS, countryName, type ItinerarySlot } from "@/lib/app-data";
import { KEYS, useLocal } from "@/lib/store";
import Button from "@/components/Button";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/icons";
import { Card, EmptyState, Notice, Tag } from "@/components/ui";
import type { StoredCard, StoredPoints } from "@/components/app/editors";

function Slot({
  slot,
  choice,
  onChoose,
  perkApplied,
  onTogglePerk,
  hasWallet,
}: {
  slot: ItinerarySlot;
  choice: number;
  onChoose: (index: number) => void;
  perkApplied: boolean;
  onTogglePerk: () => void;
  hasWallet: boolean;
}) {
  const [open, setOpen] = useState<"options" | "perk" | null>(null);
  const picked = slot.options[choice] ?? slot.options[0];
  const others = slot.options.length - 1;

  return (
    <li className="border-b border-ink/10 px-4 py-4 last:border-b-0 sm:px-5">
      <div className="flex gap-4">
        <span className="w-12 shrink-0 pt-0.5 font-mono text-sm font-bold text-ink/70">{slot.time}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug text-ink">{picked.name}</p>
          {picked.note && <p className="mt-0.5 text-sm leading-snug text-ink/70">{picked.note}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {others > 0 && (
              <button
                type="button"
                aria-expanded={open === "options"}
                onClick={() => setOpen(open === "options" ? null : "options")}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-ink/20 bg-white px-3 text-[13px] font-semibold text-ink hover:border-ink/40"
              >
                {others} other {others === 1 ? "option" : "options"}
              </button>
            )}
            {slot.perk && (
              <button
                type="button"
                aria-expanded={open === "perk"}
                onClick={() => setOpen(open === "perk" ? null : "perk")}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ${
                  perkApplied ? "bg-trail/10 text-trail" : "bg-terracotta/10 text-terracotta-dark hover:bg-terracotta/20"
                }`}
              >
                <Icon name={perkApplied ? "check" : "wallet"} size={15} />
                {perkApplied ? "Perk applied" : "Perk offer"}
              </button>
            )}
          </div>

          {open === "options" && (
            <fieldset className="mt-3 rounded-xl bg-cream p-2">
              <legend className="sr-only">Options for {slot.time}</legend>
              {slot.options.map((o, i) => (
                <label
                  key={o.name}
                  className="flex cursor-pointer items-start gap-3 rounded-lg px-2.5 py-2.5 hover:bg-white has-[:checked]:bg-white"
                >
                  <input
                    type="radio"
                    name={slot.id}
                    checked={i === choice}
                    onChange={() => {
                      onChoose(i);
                      setOpen(null);
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#9E411F]"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">
                      {o.name}
                      {i === 0 && <span className="ml-2 text-xs font-medium text-ink/60">Planner&rsquo;s pick</span>}
                    </span>
                    {o.note && <span className="block text-[13px] leading-snug text-ink/70">{o.note}</span>}
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          {open === "perk" && slot.perk && (
            <div className="mt-3 rounded-xl border border-terracotta/25 bg-terracotta/[0.06] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-ink">{slot.perk.title}</p>
                <Tag>Sample offer</Tag>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink/80">{slot.perk.body}</p>
              {!hasWallet && (
                <p className="mt-2 text-[13px] text-ink/70">
                  <Link href="/app/wallet" className="font-semibold text-terracotta-dark underline-offset-4 hover:underline">
                    Add your cards and points
                  </Link>{" "}
                  so offers can be matched to what you actually hold.
                </p>
              )}
              <div className="mt-3">
                <Button variant={perkApplied ? "secondary" : "primary"} onClick={onTogglePerk} className="min-h-[40px] px-4 py-2 text-sm">
                  {perkApplied ? "Remove perk" : "Apply to this slot"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default function TripPage({ params }: { params: { id: string } }) {
  const trip = TRIPS.find((t) => t.id === params.id);
  const destination = DESTINATIONS.find((d) => d.id === (trip ? trip.destinationId : params.id));

  const [saved, setSaved] = useLocal<string[]>(KEYS.saved, []);
  const [choices, setChoices] = useLocal<Record<string, number>>(`sidepath_choices_${params.id}`, {});
  const [applied, setApplied] = useLocal<string[]>(`sidepath_perks_${params.id}`, []);
  const [cards] = useLocal<StoredCard[]>(KEYS.cards, []);
  const [points] = useLocal<StoredPoints[]>(KEYS.points, []);
  const [passports] = useLocal<string[]>(KEYS.passports, []);

  if (!trip || !destination) {
    return (
      <div className="mx-auto max-w-lg py-16">
        <EmptyState
          title="No itinerary here yet"
          body={`${destination ? destination.name : "This place"} doesn't have a planned trip in this preview. The trip planner isn't connected yet, so only the sample Lisbon itinerary can be opened.`}
          action={<Button href="/app/explore">Back to Explore</Button>}
        />
      </div>
    );
  }

  const isSaved = saved.includes(destination.id);
  const perks = trip.days.flatMap((d) => d.slots).filter((s) => s.perk);
  const changed = Object.values(choices).filter((v) => v > 0).length;

  return (
    <div>
      <Link href="/app/explore" className="mb-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-ink/75 hover:text-ink">
        <Icon name="arrow" size={16} className="rotate-180" />
        Explore
      </Link>

      <Photo name={destination.photo} width={1040} eager className="aspect-[4/3] rounded-2xl sm:aspect-[16/7]">
        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
          <div>
            <p className="text-sm font-medium text-white/90">{destination.country}</p>
            <h1 className="font-serif text-4xl font-semibold leading-none tracking-tightish text-white md:text-6xl">{destination.name}</h1>
          </div>
          <button
            type="button"
            aria-label={isSaved ? "Remove from saved" : "Save this trip"}
            aria-pressed={isSaved}
            onClick={() => setSaved((s) => (isSaved ? s.filter((x) => x !== destination.id) : [...s, destination.id]))}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-ink shadow-float transition-transform active:scale-90"
          >
            <Icon name="saved" size={19} filled={isSaved} className={isSaved ? "text-terracotta" : ""} />
          </button>
        </div>
      </Photo>

      {/* On phones the summary card sits below the days, so the three facts
          people check first are repeated here, right under the photo. */}
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm lg:hidden">
        <div>
          <dt className="text-ink/65">Dates</dt>
          <dd className="font-mono font-bold text-ink">{trip.dateRange}</dd>
        </div>
        <div>
          <dt className="text-ink/65">Planned</dt>
          <dd className="font-mono font-bold text-ink">{trip.days.length}+ days</dd>
        </div>
        <div>
          <dt className="text-ink/65">Budget</dt>
          <dd className="font-mono font-bold text-ink">${trip.budget} all in</dd>
        </div>
      </dl>

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">Your days</h2>
            <Tag>Sample itinerary</Tag>
          </div>

          <ol className="space-y-7">
            {trip.days.map((day) => (
              <li key={day.day}>
                <div className="mb-3 flex items-center gap-3.5">
                  <Photo name={day.photo} width={160} className="h-16 w-16 shrink-0 rounded-xl" />
                  <div>
                    <p className="font-mono text-xs font-bold text-terracotta-dark">Day {day.day}</p>
                    <h3 className="font-serif text-xl font-semibold tracking-tightish text-ink">{day.title}</h3>
                  </div>
                </div>
                <Card>
                  <ul>
                    {day.slots.map((slot) => (
                      <Slot
                        key={slot.id}
                        slot={slot}
                        choice={choices[slot.id] ?? 0}
                        onChoose={(i) => setChoices((c) => ({ ...c, [slot.id]: i }))}
                        perkApplied={!!slot.perk && applied.includes(slot.perk.id)}
                        onTogglePerk={() =>
                          slot.perk &&
                          setApplied((a) => (a.includes(slot.perk!.id) ? a.filter((x) => x !== slot.perk!.id) : [...a, slot.perk!.id]))
                        }
                        hasWallet={cards.length + points.length > 0}
                      />
                    ))}
                  </ul>
                </Card>
              </li>
            ))}
          </ol>

          <Notice className="mt-7" title="This is a sample itinerary">
            Live prices, booking links and perk offers matched to your real cards arrive when
            flight, hotel and card data are connected.
          </Notice>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8">
          <Card className="p-5">
            <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">Trip summary</h2>
            <dl className="mt-3 divide-y divide-ink/10 text-sm">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink/70">Dates</dt>
                <dd className="font-mono font-bold text-ink">{trip.dateRange}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink/70">Planned so far</dt>
                <dd className="font-mono font-bold text-ink">{trip.days.length}+ days</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink/70">Budget, all in</dt>
                <dd className="font-mono font-bold text-ink">${trip.budget}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink/70">Your changes</dt>
                <dd className="font-medium text-ink">{changed === 0 ? "Planner's picks" : `${changed} swapped`}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink/70">Perk offers</dt>
                <dd className="font-medium text-ink">
                  {applied.length} of {perks.length} applied
                </dd>
              </div>
            </dl>
            <Button disabled className="mt-4 w-full">
              Booking opens with partners
            </Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">Visa</h2>
              <Tag tone="warn">Not checked</Tag>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              {passports.length === 0
                ? `Add a passport and we'll check entry rules for ${destination.country}.`
                : `Travelling to ${destination.country} on your ${countryName(passports[0])} passport. Visa data isn't connected yet.`}
            </p>
            <Link
              href={passports.length === 0 ? "/app/passports" : `/app/visa?to=${destination.id}`}
              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-terracotta-dark underline-offset-4 hover:underline"
            >
              {passports.length === 0 ? "Add a passport" : "Open visa check"}
              <Icon name="arrow" size={16} />
            </Link>
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">Going with others?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">Add who is coming and keep track of who paid for what.</p>
            <Link href="/app/groups" className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-terracotta-dark underline-offset-4 hover:underline">
              Set up a group
              <Icon name="arrow" size={16} />
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
