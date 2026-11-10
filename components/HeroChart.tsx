import { CompassRoseMarks } from "@/components/paper/CompassRose";

const serif = { fontFamily: "var(--font-serif), serif" };
const mono = { fontFamily: "var(--font-mono), monospace" };

const LAND = [
  // Home island, bottom left.
  "M40 562 C 84 552, 118 580, 124 616 C 130 656, 106 690, 70 700 C 36 708, 8 690, 6 650 C 4 612, 14 572, 40 562 Z",
  // The island with the X.
  "M252 322 C 272 296, 326 290, 352 312 C 370 328, 368 378, 348 400 C 322 426, 264 416, 246 388 C 234 366, 238 340, 252 322 Z",
  // Two stepping stones on the way.
  "M100 546 C 104 530, 140 524, 154 538 C 166 550, 156 568, 134 570 C 114 572, 96 562, 100 546 Z",
  "M188 450 C 192 434, 226 428, 240 442 C 252 456, 240 472, 220 474 C 200 476, 184 466, 188 450 Z",
];

const RHUMBS = Array.from({ length: 16 }, (_, i) => i * 22.5);

/**
 * The home page's treasure chart: a dashed trail from "You are here" past
 * two islets to an X, with the three seeded trips' real prices set where a
 * chart would print its soundings. Hand-composed rather than data-driven
 * (unlike Explore's SeaChart) because this one is the poster, not the tool.
 *
 * Drawn in a 390-wide coordinate space and scaled by its container. The
 * compass lines are left to run past the edges on purpose; the hero clips
 * them at its own frame.
 */
export default function HeroChart({ className = "" }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="A hand drawn sea chart. A dashed trail runs from You are here, past Lisbon and Tbilisi, to an X at Oaxaca."
      viewBox="0 290 390 426"
      className={`block h-auto w-full overflow-visible ${className}`}
    >
      <g stroke="#26201B" strokeWidth=".6" opacity=".13">
        {RHUMBS.map((a) => (
          <line key={a} x1="318" y1="610" x2="318" y2="-1400" transform={`rotate(${a} 318 610)`} />
        ))}
      </g>

      <g fill="none" stroke="#26201B" strokeWidth="8" opacity=".1" strokeLinejoin="round">
        {LAND.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="#E0C9A6" fillOpacity=".6" stroke="#26201B" strokeWidth="1.2" strokeLinejoin="round">
        {LAND.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" stroke="#26201B" strokeWidth="1" strokeLinejoin="round" opacity=".7">
        <path d="M30 596 l6 -10 l6 10 M46 604 l5 -8 l5 8 M28 632 l5 -8 l5 8" />
        <path d="M262 396 l6 -10 l6 10 M278 402 l5 -8 l5 8 M334 392 l5 -8 l5 8" />
      </g>

      {/* The sea serpent every honest chart keeps in its empty corner. */}
      <g fill="none" stroke="#26201B" strokeLinecap="round" opacity=".8">
        <path d="M40 460 C 40 436, 28 428, 34 416 C 39 407, 52 410, 51 419" strokeWidth="3.2" />
        <path d="M58 460 q 11 -24 22 0" strokeWidth="3.2" />
        <path d="M88 460 q 9 -18 18 0" strokeWidth="3.2" />
        <path d="M112 460 q 6 -14 16 -12" strokeWidth="3.2" />
        <path d="M22 465 q 6 -4 12 0 t 12 0 M72 466 q 6 -4 12 0 t 12 0 M112 466 q 6 -4 12 0 t 12 0" strokeWidth="1" />
      </g>
      <path d="M51 419 l 7 2" fill="none" stroke="#C0532E" strokeWidth="1.6" strokeLinecap="round" />
      <text x="28" y="488" style={serif} fontStyle="italic" fontSize="13.5" fill="#26201B" opacity=".8">
        Here be excuses.
      </text>

      <path
        d="M62 668 C 30 620, 130 600, 128 548 C 126 505, 196 500, 214 452 C 228 412, 300 416, 316 356"
        fill="none"
        stroke="#C0532E"
        strokeWidth="2.6"
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <circle cx="62" cy="668" r="10" fill="none" stroke="#C0532E" strokeWidth="1" opacity=".6" />
      <circle cx="62" cy="668" r="5" fill="#C0532E" />
      <circle cx="128" cy="548" r="4.5" fill="#F7F2EA" stroke="#C0532E" strokeWidth="2" />
      <circle cx="214" cy="452" r="4.5" fill="#F7F2EA" stroke="#C0532E" strokeWidth="2" />
      <path d="M307 347 L325 365 M325 347 L307 365" fill="none" stroke="#C0532E" strokeWidth="4.2" strokeLinecap="round" />

      <g style={serif} fontStyle="italic" fill="#26201B">
        <text x="78" y="673" fontSize="13.5">You are here</text>
        <text x="164" y="546" fontSize="16">Lisbon</text>
        <text x="250" y="450" fontSize="16">Tbilisi</text>
        <text x="306" y="323" fontSize="16" textAnchor="middle">Oaxaca</text>
      </g>
      <g style={mono} fontSize="9.5" fill="#26201B" opacity=".85">
        <text x="164" y="560">$640, 5 days</text>
        <text x="250" y="464">$410, 7 days</text>
        <text x="306" y="337" textAnchor="middle">$520, 6 days</text>
      </g>

      <g transform="translate(318 610)">
        <CompassRoseMarks />
      </g>

      <text x="300" y="682" textAnchor="middle" style={serif} fontStyle="italic" fontSize="12" fill="#26201B">
        Closer than you think
      </text>
      <rect x="240" y="688" width="120" height="5" fill="#F7F2EA" stroke="#26201B" strokeWidth="1" />
      <rect x="240" y="688" width="30" height="5" fill="#26201B" />
      <rect x="300" y="688" width="30" height="5" fill="#26201B" />
      <g style={mono} fontSize="8.5" fill="#26201B">
        <text x="240" y="705">0</text>
        <text x="360" y="705" textAnchor="end">1 flight</text>
      </g>
    </svg>
  );
}
