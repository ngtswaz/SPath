"use client";

import Link from "next/link";
import { type Destination, tripHref } from "@/lib/app-data";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/icons";

/**
 * A destination as a card. Two looks from one component:
 *
 * - "cover" (the app): the photo is the card, with the name and price set
 *   over it. Tall, rounded, made to be swiped through.
 * - "listing" (the public site): photo on top, details underneath.
 *
 * The save button is a separate control from the card's link, so both
 * work by keyboard and touch.
 */
export default function DestinationCard({
  destination: d,
  match,
  saved,
  onToggleSave,
  href,
  variant = "listing",
}: {
  destination: Destination;
  match?: number | null;
  saved?: boolean;
  onToggleSave?: () => void;
  href?: string;
  variant?: "cover" | "listing";
}) {
  const badge = match != null && (
    <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-ink">
      {match}% match
    </span>
  );

  const save = onToggleSave && (
    <button
      type="button"
      aria-label={saved ? `Remove ${d.name} from saved` : `Save ${d.name}`}
      aria-pressed={saved}
      onClick={onToggleSave}
      className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-float transition-transform active:scale-90"
    >
      <Icon name="saved" size={19} filled={saved} className={saved ? "text-accent-dark" : ""} />
    </button>
  );

  if (variant === "cover") {
    return (
      <article className="relative">
        <Link href={href ?? tripHref(d.id)} className="block rounded-[28px] transition-transform duration-150 active:scale-[0.98]">
          <Photo name={d.photo} width={640} className="aspect-[4/5] rounded-[28px] md:aspect-[4/5]">
            <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/15 to-transparent" />
            {badge}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-sm font-medium text-white/85">{d.country}</p>
              <h3 className="font-serif text-[34px] font-semibold leading-none tracking-tightish text-white">{d.name}</h3>
              <p className="mt-2 text-sm leading-snug text-white/85">{d.blurb}</p>
              <p className="mt-3.5 inline-flex items-baseline gap-2 rounded-full bg-white/95 px-3.5 py-2 text-ink">
                <span className="font-mono text-[15px] font-bold">${d.price}</span>
                <span className="text-xs text-ink/70">{d.days} days, all in</span>
              </p>
            </div>
          </Photo>
        </Link>
        {save}
      </article>
    );
  }

  return (
    <article className="group relative">
      <Link href={href ?? tripHref(d.id)} className="block rounded-3xl">
        <Photo name={d.photo} width={640} className="aspect-[4/3] rounded-3xl">
          {badge}
        </Photo>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-xl font-semibold leading-tight tracking-tightish text-ink group-hover:underline">
              {d.name}
              <span className="ml-2 font-sans text-sm font-normal text-ink/65">{d.country}</span>
            </h3>
            <p className="mt-1 text-sm leading-snug text-ink/75">{d.blurb}</p>
          </div>
          <p className="shrink-0 text-right">
            <span className="block font-mono text-[15px] font-bold text-ink">${d.price}</span>
            <span className="block text-xs text-ink/65">{d.days} days, all in</span>
          </p>
        </div>
      </Link>
      {save}
    </article>
  );
}
