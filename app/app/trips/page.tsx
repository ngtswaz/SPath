import Link from "next/link";
import { DESTINATIONS, TRIPS, type Destination, type Trip } from "@/lib/app-data";
import CompassRose from "@/components/paper/CompassRose";
import { InkTag } from "@/components/app/DestinationRow";
import { Pin } from "@/components/paper/WaxSeal";

// A luggage tag: clipped corners on the string side, square on the other.
const TAG_SHAPE = "polygon(34px 0, 100% 0, 100% 100%, 34px 100%, 0 74%, 0 26%)";

function LuggageTag({ trip, d, index }: { trip: Trip; d: Destination; index: number }) {
  return (
    <Link
      href={`/app/trip/${trip.id}`}
      className={`group relative block w-full max-w-[420px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-dark ${
        index % 2 === 0 ? "-rotate-2" : "rotate-[1.5deg]"
      }`}
      style={{ filter: "drop-shadow(2px 3px 0 rgba(38,32,27,.18))" }}
    >
      <span className="block bg-ink p-[1.3px]" style={{ clipPath: TAG_SHAPE }}>
        <span className="flex flex-col gap-5 bg-bone py-5 pl-[58px] pr-5" style={{ clipPath: TAG_SHAPE }}>
          <span className="flex items-start justify-between gap-3">
            <span className="block min-w-0">
              <span className="block truncate font-serif text-[34px] font-medium italic leading-none tracking-[-0.01em] text-ink decoration-terracotta decoration-wavy underline-offset-[6px] group-hover:underline">
                {d.name}
              </span>
              <span className="mt-[5px] block text-[13px] text-ink/80">{d.country}</span>
            </span>
            <InkTag label="Upcoming" tilt={5} className="mt-1 !px-2 !py-[3px] !text-[11px]" />
          </span>
          <span className="flex items-baseline gap-2 border-t border-ink/30 pt-[9px]">
            <span className="shrink-0 font-mono text-[13.5px] font-bold text-ink">{trip.dateRange}</span>
            <span aria-hidden="true" className="leader" style={{ transform: "translateY(-3px)" }} />
            <span className="shrink-0 font-mono text-xs text-ink/85">${trip.budget} all in</span>
          </span>
        </span>
      </span>

      {/* Eyelet and string. */}
      <span aria-hidden="true" className="absolute left-[18px] top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-sandstone">
        <span className="h-[11px] w-[11px] rounded-full border border-ink bg-cream" />
      </span>
      <svg aria-hidden="true" width="1" height="1" className="absolute left-[30px] top-1/2 overflow-visible">
        <path d="M0 0 C -16 -24, -40 -46, -60 -100" fill="none" stroke="#26201B" strokeWidth="1.5" />
        <path d="M0 0 C -22 -14, -60 -36, -74 -96" fill="none" stroke="#26201B" strokeWidth="1.5" />
      </svg>
    </Link>
  );
}

export default function TripsPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-66px)] flex-col overflow-hidden px-6 pb-10 pt-7 md:min-h-screen md:px-10 md:pt-10">
      <CompassRose size={230} className="pointer-events-none absolute -right-8 bottom-4 opacity-[0.14]" />

      <h1 className="relative font-serif text-3xl font-semibold tracking-tightish text-ink md:text-4xl">Your trips</h1>
      <p className="relative mt-1 text-[13.5px] text-ink/80">Upcoming and past, in one log.</p>

      <div className="relative mt-11 flex flex-col gap-9 pl-1">
        {TRIPS.map((trip, i) => {
          const d = DESTINATIONS.find((x) => x.id === trip.destinationId);
          return d ? <LuggageTag key={trip.id} trip={trip} d={d} index={i} /> : null;
        })}
      </div>

      {/* An honest note about what is not here yet, pinned like a slip. */}
      <div className="relative ml-5 mt-12 w-[268px] max-w-[calc(100%-1.25rem)] rotate-[1.6deg] bg-sandstone px-[18px] pb-[18px] pt-4 shadow-card">
        <Pin className="absolute -top-[7px] left-1/2 -ml-[7px]" />
        <p className="font-serif text-[15px] italic leading-[1.45] text-ink">
          Planning a new trip isn&rsquo;t built yet. The trip form and planner are next on
          the build order.
        </p>
      </div>
    </div>
  );
}
