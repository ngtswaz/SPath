"use client";

import Link from "next/link";
import type { Destination } from "@/lib/app-data";

/**
 * The globe's replacement: a dashed terracotta path traced across a warm
 * photo-toned panel, connecting waypoint markers — one bold line doing the
 * work a 3D object used to do, at a fraction of the cost and without the
 * touch-scroll trap OrbitControls caused on mobile.
 *
 * The background is a layered gradient standing in for a real destination
 * photograph; swapping in licensed photography later is a drop-in change
 * to this one background rule.
 */
// Keeps every waypoint (and its label, which floats above the dot) inside
// a safe interior band so the topmost point's pill never clips against the
// panel's top edge, whatever raw 0-1 fraction the destination data gives it.
const safeY = (t: number) => 0.2 + t * 0.7;

export default function RouteMap({
  destinations,
  tripFor,
}: {
  destinations: Destination[];
  tripFor: Record<string, string>;
}) {
  const points = destinations.map((d) => ({ x: d.pos.x * 400, y: safeY(d.pos.y) * 280 }));

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    const cy = prev.y - 40;
    return `${acc} Q ${cx} ${cy}, ${p.x} ${p.y}`;
  }, "");

  return (
    <div className="relative h-[260px] overflow-hidden rounded-[3px]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 70% at 30% 110%, rgba(38,32,27,.55), transparent 60%), linear-gradient(180deg, #E8C79A 0%, #DCA876 35%, #B96B3E 68%, #7A4226 100%)",
        }}
      />
      <svg viewBox="0 0 400 280" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={pathD} fill="none" stroke="#C0532E" strokeWidth="2.2" strokeDasharray="1 7" strokeLinecap="round" />
      </svg>

      {destinations.map((d, i) => (
        <Link
          key={d.id}
          href={`/app/trip/${tripFor[d.id] ?? d.id}`}
          aria-label={`View ${d.name}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${d.pos.x * 100}%`, top: `${safeY(d.pos.y) * 100}%` }}
        >
          <span
            className={`block h-[11px] w-[11px] rounded-full border-[2.5px] border-terracotta ${
              i === destinations.length - 1 ? "bg-terracotta" : "bg-bone"
            }`}
          />
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-[2px] bg-ink/80 px-[7px] py-[3px] font-mono text-[10.5px] tracking-wide text-bone">
            {d.name}
          </span>
        </Link>
      ))}

      <p className="absolute bottom-4 left-[18px] font-serif text-lg italic text-bone [text-shadow:0_1px_6px_rgba(0,0,0,.35)]">
        {destinations.length} routes open this week
      </p>
    </div>
  );
}
