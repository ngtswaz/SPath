"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { DESTINATIONS, TRIPS, countryName, type ItinerarySlot } from "@/lib/app-data";
import { KEYS, useLocal } from "@/lib/store";
import Button from "@/components/Button";
import Sheet from "@/components/app/Sheet";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/icons";
import { Card, EmptyState, Notice, Tag } from "@/components/ui";
import type { StoredCard, StoredPoints } from "@/components/app/editors";

const ROUND_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-float transition-transform active:scale-90";

const CHIP =
  "inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-transform active:scale-95";

function SlotRow({
  slot,
  choice,
  perkApplied,
  onOpenOptions,
  onOpenPerk,
}: {
  slot: ItinerarySlot;
  choice: number;
  perkApplied: boolean;
  onOpenOptions: () => void;
  onOpenPerk: () => void;
}) {
  const picked = slot.options[choice] ?? slot.options[0];
  const others = slot.options.length - 1;

  return (
    <li className="flex gap-4 border-b border-ink/10 px-4 py-4 last:border-b-0 sm:px-5">
      <span className="w-12 shrink-0 pt-0.5 font-mono text-sm font-bold text-ink/70">{slot.time}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-snug text-ink">{picked.name}</p>
        {picked.note && <p className="mt-0.5 text-sm leading-snug text-ink/70">{picked.note}</p>}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {others > 0 && (
            <button type="button" onClick={onOpenOptions} className={`${CHIP} border border-ink/15 bg-white text-ink`}>
              {others} other {others === 1 ? "option" : "options"}
            </button>
          )}
          {slot.perk && (
            <button
              type="button"
              onClick={onOpenPerk}
              className={`${CHIP} ${perkApplied ? "bg-trail/10 text-trail" : "bg-accent/10 text-accent-dark"}`}
            >
              <Icon name={perkApplied ? "check" : "wallet"} size={15} />
              {perkApplied ? "Perk applied" : "Perk offer"}
            </button>
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

  const pager = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState(0);
  const [sheet, setSheet] = useState<{ kind: "options" | "perk"; slot: ItinerarySlot } | null>(null);

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
  const hasWallet = cards.length + points.length > 0;

  function goToDay(i: number) {
    const el = pager.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  function onPagerScroll() {
    const el = pager.current;
    if (el && el.clientWidth) setDay(Math.round(el.scrollLeft / el.clientWidth));
  }

  const sheetSlot = sheet?.slot;
  const sheetPerk = sheet?.kind === "perk" ? sheet.slot.perk : undefined;
  const sheetPerkApplied = !!sheetPerk && applied.includes(sheetPerk.id);

  return (
    <div>
      {/* On a phone the photo runs edge to edge under the status bar, with
          the back and save buttons floating on it. */}
      <div className="-mx-5 mt-[calc(-1*max(1.75rem,env(safe-area-inset-top)))] md:mx-0 md:mt-0">
        <Photo name={destination.photo} width={1040} eager className="h-[44svh] min-h-[300px] rounded-b-[32px] md:h-auto md:min-h-0 md:aspect-[16/7] md:rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/15 to-night/25" />
          <div className="absolute inset-x-4 top-[max(1rem,env(safe-area-inset-top))] flex items-center justify-between md:inset-x-5 md:top-5">
            <Link href="/app/explore" aria-label="Back to Explore" className={ROUND_BUTTON}>
              <Icon name="arrow" size={19} className="rotate-180" />
            </Link>
            <button
              type="button"
              aria-label={isSaved ? "Remove from saved" : "Save this trip"}
              aria-pressed={isSaved}
              onClick={() => setSaved((s) => (isSaved ? s.filter((x) => x !== destination.id) : [...s, destination.id]))}
              className={ROUND_BUTTON}
            >
              <Icon name="saved" size={19} filled={isSaved} className={isSaved ? "text-accent-dark" : ""} />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
            <p className="text-sm font-medium text-white/90">{destination.country}</p>
            <h1 className="font-serif text-[44px] font-semibold leading-none tracking-tightish text-white md:text-6xl">{destination.name}</h1>
          </div>
        </Photo>
      </div>

      {/* The three facts people check first, as a row you can flick through. */}
      <dl className="no-scrollbar -mx-5 mt-4 flex gap-2.5 overflow-x-auto px-5 lg:hidden">
        {[
          ["Dates", trip.dateRange],
          ["Planned", `${trip.days.length}+ days`],
          ["Budget", `$${trip.budget} all in`],
        ].map(([label, value]) => (
          <div key={label} className="shrink-0 rounded-3xl border border-ink/10 bg-white px-4 py-3">
            <dt className="text-xs text-ink/65">{label}</dt>
            <dd className="font-mono text-sm font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">Your days</h2>
            <Tag>Sample itinerary</Tag>
          </div>

          {/* Day tabs. The highlight is one element that glides to the day in view. */}
          <div role="tablist" aria-label="Days" className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 md:mx-0 md:px-0">
            {trip.days.map((d, i) => (
              <button
                key={d.day}
                type="button"
                role="tab"
                id={`day-tab-${d.day}`}
                aria-selected={day === i}
                aria-controls={`day-panel-${d.day}`}
                onClick={() => goToDay(i)}
                className={`relative min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold transition-colors ${
                  day === i ? "text-bone" : "text-ink/75"
                }`}
              >
                {day === i && (
                  <motion.span
                    layoutId="day-highlight"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", damping: 32, stiffness: 380 }}
                  />
                )}
                <span className="relative">Day {d.day}</span>
              </button>
            ))}
          </div>

          {/* One day per page. Swipe sideways, or tap a day above. */}
          <div
            ref={pager}
            onScroll={onPagerScroll}
            className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory items-start overflow-x-auto md:mx-0"
          >
            {trip.days.map((d, i) => (
              <section
                key={d.day}
                role="tabpanel"
                id={`day-panel-${d.day}`}
                aria-labelledby={`day-tab-${d.day}`}
                // Off-screen days stay out of the tab order until swiped to.
                // (Spread as a string: React 18 drops a boolean `inert`.)
                {...(day === i ? {} : ({ inert: "" } as object))}
                className="w-full shrink-0 snap-center px-5 md:px-0"
              >
                <Photo name={d.photo} width={720} className="aspect-[16/8] rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-night/75 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 right-5 font-serif text-2xl font-semibold tracking-tightish text-white">{d.title}</h3>
                </Photo>
                <Card className="mt-3">
                  <ul>
                    {d.slots.map((slot) => (
                      <SlotRow
                        key={slot.id}
                        slot={slot}
                        choice={choices[slot.id] ?? 0}
                        perkApplied={!!slot.perk && applied.includes(slot.perk.id)}
                        onOpenOptions={() => setSheet({ kind: "options", slot })}
                        onOpenPerk={() => setSheet({ kind: "perk", slot })}
                      />
                    ))}
                  </ul>
                </Card>
              </section>
            ))}
          </div>

          <div aria-hidden="true" className="mt-4 flex justify-center gap-1.5">
            {trip.days.map((d, i) => (
              <span key={d.day} className={`h-1.5 rounded-full transition-all duration-200 ${i === day ? "w-5 bg-ink" : "w-1.5 bg-ink/25"}`} />
            ))}
          </div>

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
              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-accent-dark underline-offset-4 hover:underline"
            >
              {passports.length === 0 ? "Add a passport" : "Open visa check"}
              <Icon name="arrow" size={16} />
            </Link>
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">Going with others?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">Add who is coming and keep track of who paid for what.</p>
            <Link href="/app/groups" className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-accent-dark underline-offset-4 hover:underline">
              Set up a group
              <Icon name="arrow" size={16} />
            </Link>
          </Card>
        </aside>
      </div>

      <Sheet open={sheet?.kind === "options"} onClose={() => setSheet(null)} title={sheetSlot ? `${sheetSlot.time}, pick one` : "Options"}>
        {sheetSlot && (
          <div role="radiogroup" aria-label={`Options for ${sheetSlot.time}`} className="space-y-2 pb-1">
            {sheetSlot.options.map((o, i) => {
              const selected = (choices[sheetSlot.id] ?? 0) === i;
              return (
                <button
                  key={o.name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setChoices((c) => ({ ...c, [sheetSlot.id]: i }));
                    setSheet(null);
                  }}
                  className={`flex w-full items-center gap-3 rounded-3xl border bg-white px-4 py-3.5 text-left transition-transform active:scale-[0.98] ${
                    selected ? "border-ink" : "border-ink/10"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink">
                      {o.name}
                      {i === 0 && <span className="ml-2 whitespace-nowrap text-xs font-medium text-ink/60">Planner&rsquo;s pick</span>}
                    </span>
                    {o.note && <span className="mt-0.5 block text-sm leading-snug text-ink/70">{o.note}</span>}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${selected ? "bg-ink text-bone" : "border border-ink/20"}`}
                  >
                    {selected && <Icon name="check" size={15} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Sheet>

      <Sheet open={sheet?.kind === "perk"} onClose={() => setSheet(null)} title={sheetPerk?.title ?? "Perk offer"}>
        {sheetPerk && (
          <div className="pb-1">
            <Tag>Sample offer</Tag>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{sheetPerk.body}</p>
            {!hasWallet && (
              <p className="mt-3 text-sm text-ink/70">
                <Link href="/app/wallet" className="font-semibold text-accent-dark underline-offset-4 hover:underline">
                  Add your cards and points
                </Link>{" "}
                so offers can be matched to what you actually hold.
              </p>
            )}
            <Button
              variant={sheetPerkApplied ? "secondary" : "primary"}
              className="mt-5 w-full"
              onClick={() => {
                setApplied((a) => (a.includes(sheetPerk.id) ? a.filter((x) => x !== sheetPerk.id) : [...a, sheetPerk.id]));
                setSheet(null);
              }}
            >
              {sheetPerkApplied ? "Remove perk" : "Apply to this slot"}
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
