"use client";

import Link from "next/link";
import { type Destination, tripHref } from "@/lib/app-data";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/icons";

/**
 * A destination as a photo-led card: picture, name, one line, and what the
 * whole trip costs. The save button sits on the photo and is a separate
 * control from the card's link, so both work by keyboard and touch.
 */
export default function DestinationCard({
  destination: d,
  match,
  saved,
  onToggleSave,
  href,
}: {
  destination: Destination;
  match?: number | null;
  saved?: boolean;
  onToggleSave?: () => void;
  href?: string;
}) {
  return (
    <article className="group relative">
      <Link href={href ?? tripHref(d.id)} className="block rounded-2xl">
        <Photo name={d.photo} width={640} className="aspect-[4/3] rounded-2xl">
          {match != null && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-trail">
              {match}% match
            </span>
          )}
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
      {onToggleSave && (
        <button
          type="button"
          aria-label={saved ? `Remove ${d.name} from saved` : `Save ${d.name}`}
          aria-pressed={saved}
          onClick={onToggleSave}
          className="absolute right-2.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-float transition-transform active:scale-90"
        >
          <Icon name="saved" size={19} filled={saved} className={saved ? "text-terracotta" : ""} />
        </button>
      )}
    </article>
  );
}
