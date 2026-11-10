import { useId } from "react";

/**
 * A perforated postage stamp whose face value is the trip's price, with
 * the Sidepath arch as its picture. The scalloped edge is one dotted
 * stroke in the colour of whatever the stamp sits on, biting into it.
 */
export function Stamp({
  value,
  tone = "#C0532E",
  paper = "#FAF8F4",
  className = "",
}: {
  value: string;
  tone?: string;
  paper?: string;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={`Stamp: ${value}`}
      width="56"
      height="68"
      viewBox="0 0 56 68"
      className={`block shrink-0 ${className}`}
    >
      <rect x="2" y="2" width="52" height="64" fill="#E0C9A6" />
      <rect
        x="2"
        y="2"
        width="52"
        height="64"
        fill="none"
        stroke={paper}
        strokeWidth="4.6"
        strokeDasharray="0.1 6.344"
        strokeLinecap="round"
      />
      <rect x="9" y="9" width="38" height="36" fill={tone} />
      <circle cx="28" cy="24" r="7" fill="#E8A23D" />
      <path d="M18 45 V33 a10 10 0 0 1 20 0 V45" fill="none" stroke="#FAF8F4" strokeWidth="2" />
      <path d="M22 45 l6 -8 l6 8" fill="none" stroke="#FAF8F4" strokeWidth="2" strokeLinejoin="round" />
      <text
        x="28"
        y="59"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-mono), monospace" }}
        fontSize="10.5"
        fontWeight="700"
        fill="#26201B"
      >
        {value}
      </text>
    </svg>
  );
}

/**
 * A round ink postmark: the place around the top, one or two short lines
 * in the middle. Purely decorative (the same facts are always in real text
 * nearby), so it is hidden from assistive tech.
 */
export function Postmark({
  city,
  lines,
  waves = false,
  className = "",
}: {
  city: string;
  lines: string[];
  waves?: boolean;
  className?: string;
}) {
  const id = `pm-${useId().replace(/:/g, "")}`;
  const width = waves ? 118 : 70;
  return (
    <svg
      aria-hidden="true"
      width={width}
      height="70"
      viewBox={`0 0 ${width} 70`}
      className={`shrink-0 ${className}`}
    >
      <defs>
        <path id={id} d="M12 35 a23 23 0 0 1 46 0" />
      </defs>
      <g fill="none" stroke="#26201B" opacity=".72">
        <circle cx="35" cy="35" r="32" strokeWidth="1.4" />
        <circle cx="35" cy="35" r="19" strokeWidth="1" />
        {waves && (
          <path
            d="M70 20 q6 -5 12 0 t12 0 t12 0 t12 0 M70 30 q6 -5 12 0 t12 0 t12 0 t12 0 M70 40 q6 -5 12 0 t12 0 t12 0 t12 0 M70 50 q6 -5 12 0 t12 0 t12 0 t12 0"
            strokeWidth="1.3"
          />
        )}
      </g>
      <g fill="#26201B" opacity=".8" style={{ fontFamily: "var(--font-mono), monospace" }} fontWeight="700">
        <text fontSize="7.5" letterSpacing="2">
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
            {city.toUpperCase()}
          </textPath>
        </text>
        {lines.length === 1 ? (
          <text x="35" y="38" textAnchor="middle" fontSize="8">
            {lines[0].toUpperCase()}
          </text>
        ) : (
          <>
            <text x="35" y="34" textAnchor="middle" fontSize="8">
              {lines[0].toUpperCase()}
            </text>
            <text x="35" y="44" textAnchor="middle" fontSize="7.5">
              {lines[1].toUpperCase()}
            </text>
          </>
        )}
        <circle cx="35" cy="60.5" r="1.6" />
      </g>
    </svg>
  );
}
