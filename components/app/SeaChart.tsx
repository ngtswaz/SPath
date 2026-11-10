"use client";

import Link from "next/link";
import { useId } from "react";
import { type Destination, tripHref } from "@/lib/app-data";
import Neatline from "@/components/paper/Neatline";
import { CompassRoseMarks } from "@/components/paper/CompassRose";

/**
 * Explore's map: a small sea chart drawn from the destination data. Each
 * place is an islet, the brand's dashed trail runs from "You are here"
 * through all of them, and the last one gets the X. Nothing here is
 * geographically true, and it does not pretend to be; it is a chart of
 * what is open, not of the world.
 *
 * The drawing is one SVG; the place names are real links laid over it, so
 * they stay a fixed, readable size however wide the chart gets and are
 * reachable by keyboard.
 */
const W = 400;
const H = 300;
const START = { x: 30, y: 272 };
const ISLET = "M-28 -2 C -24 -18, 12 -24, 26 -10 C 38 2, 28 20, 6 22 C -14 24, -32 14, -28 -2 Z";

// Keeps every islet inside a band that leaves the bottom left for the start
// point and the bottom right for the compass, whatever 0-1 position the data
// gives.
const place = (d: Destination) => ({
  x: 40 + d.pos.x * 300,
  y: (0.27 + d.pos.y * 0.53) * H,
});

const r = (n: number) => Math.round(n * 10) / 10;

function trail(points: { x: number; y: number }[]): string {
  let d = `M ${START.x} ${START.y}`;
  let prev = START;
  points.forEach((p, i) => {
    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    // A gentle S between stops: swing one way, then back.
    const amp = Math.min(24, len * 0.24) * (i % 2 === 0 ? 1 : -1);
    const nx = (-dy / len) * amp;
    const ny = (dx / len) * amp;
    d += ` C ${r(prev.x + dx * 0.33 + nx)} ${r(prev.y + dy * 0.33 + ny)}, ${r(prev.x + dx * 0.66 - nx)} ${r(
      prev.y + dy * 0.66 - ny
    )}, ${r(p.x)} ${r(p.y)}`;
    prev = p;
  });
  return d;
}

export default function SeaChart({ destinations }: { destinations: Destination[] }) {
  const clipId = `chart-${useId().replace(/:/g, "")}`;
  const points = destinations.map(place);
  const last = destinations.length - 1;

  return (
    <div className="relative aspect-[4/3] w-full bg-bone/40 [container-type:inline-size]">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <rect x="7" y="7" width={W - 14} height={H - 14} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <g stroke="#26201B" strokeWidth=".6" opacity=".13">
            {[0, 30, 60, 90, 180, 240, 270, 300, 330].map((a) => (
              <line key={a} x1="350" y1="246" x2="350" y2="-300" transform={`rotate(${a} 350 246)`} />
            ))}
          </g>

          {/* Home shore, bottom left, where the trail starts. */}
          <path
            d="M7 250 C 28 244, 54 256, 58 293 H7 Z"
            fill="#E0C9A6"
            fillOpacity=".6"
            stroke="#26201B"
            strokeWidth="1.2"
          />

          {points.map((p, i) => (
            <g key={destinations[i].id} transform={`translate(${r(p.x)} ${r(p.y)}) scale(${i === last ? 1.55 : 1})`}>
              <path d={ISLET} fill="none" stroke="#26201B" strokeWidth="7" opacity=".1" strokeLinejoin="round" />
              <path
                d={ISLET}
                fill="#E0C9A6"
                fillOpacity=".6"
                stroke="#26201B"
                strokeWidth={i === last ? 0.8 : 1.2}
                strokeLinejoin="round"
              />
            </g>
          ))}

          <path
            d={trail(points)}
            fill="none"
            stroke="#C0532E"
            strokeWidth="2.4"
            strokeDasharray="2 8"
            strokeLinecap="round"
          />
          <circle cx={START.x} cy={START.y} r="4.5" fill="#C0532E" />

          {points.map((p, i) =>
            i === last ? (
              <path
                key={destinations[i].id}
                d={`M${r(p.x - 8)} ${r(p.y - 8)} L${r(p.x + 8)} ${r(p.y + 8)} M${r(p.x + 8)} ${r(p.y - 8)} L${r(p.x - 8)} ${r(p.y + 8)}`}
                fill="none"
                stroke="#C0532E"
                strokeWidth="3.8"
                strokeLinecap="round"
              />
            ) : (
              <circle
                key={destinations[i].id}
                cx={r(p.x)}
                cy={r(p.y)}
                r="4.2"
                fill="#F7F2EA"
                stroke="#C0532E"
                strokeWidth="2"
              />
            )
          )}

          <g transform="translate(350 246) scale(.62)">
            <CompassRoseMarks north={false} />
          </g>
        </g>
      </svg>

      <Neatline className="inset-0" />

      <p className="absolute left-4 top-3.5 font-serif text-base italic text-ink">
        {destinations.length} {destinations.length === 1 ? "route" : "routes"} open this week
      </p>

      <span
        className="absolute -translate-y-1/2 pl-3 font-mono text-[9.5px] text-ink/85"
        style={{ left: `${(START.x / W) * 100}%`, top: `${(START.y / H) * 100}%` }}
      >
        You are here
      </span>

      {destinations.map((d, i) => {
        const p = points[i];
        return (
          <Link
            key={d.id}
            href={tripHref(d.id)}
            className="group absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
          >
            <span
              className={
                i === last
                  ? "absolute bottom-[calc(50%+9.6cqw)] left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                  : "absolute left-[calc(50%+9.8cqw)] top-1/2 -translate-y-1/2 whitespace-nowrap"
              }
            >
              <span className="block font-serif text-[15.5px] italic leading-tight text-ink decoration-terracotta decoration-wavy underline-offset-4 group-hover:underline">
                {d.name}
              </span>
              <span className="block font-mono text-[9.5px] leading-tight text-ink/85">${d.price}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
