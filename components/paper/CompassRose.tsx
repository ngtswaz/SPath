/**
 * An eight-point compass rose in the half-filled engraving style of old
 * sea charts. Geometry is centred on 0,0 so it can also be dropped inside
 * another SVG with a translate (see `CompassRoseMarks`).
 */
export function CompassRoseMarks({ north = true }: { north?: boolean }) {
  const diagonal = [45, 135, 225, 315];
  const cardinal = [90, 180, 270];
  return (
    <>
      <circle r="44" fill="none" stroke="#26201B" strokeWidth=".8" />
      <circle r="39" fill="none" stroke="#26201B" strokeWidth="3" strokeDasharray="1 5.12" opacity=".7" />
      <circle r="25" fill="none" stroke="#26201B" strokeWidth=".8" />
      <g stroke="#26201B" strokeWidth=".8" strokeLinejoin="round">
        {diagonal.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -29 L4.5 -4.5 L0 0 L-4.5 -4.5 Z" fill="#F7F2EA" />
            <path d="M0 -29 L-4.5 -4.5 L0 0 Z" fill="#26201B" />
          </g>
        ))}
        {cardinal.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -43 L6.5 -6.5 L0 0 L-6.5 -6.5 Z" fill="#F7F2EA" />
            <path d="M0 -43 L-6.5 -6.5 L0 0 Z" fill="#26201B" />
          </g>
        ))}
        <path d="M0 -43 L6.5 -6.5 L0 0 L-6.5 -6.5 Z" fill="#F7F2EA" />
        <path d="M0 -43 L-6.5 -6.5 L0 0 Z" fill="#C0532E" />
      </g>
      <circle r="2.6" fill="#C0532E" />
      {north && (
        <text
          y="-50"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-serif), serif" }}
          fontWeight="600"
          fontSize="13"
          fill="#26201B"
        >
          N
        </text>
      )}
    </>
  );
}

export default function CompassRose({
  size = 96,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="-48 -64 96 112"
      className={`shrink-0 ${className}`}
    >
      <CompassRoseMarks />
    </svg>
  );
}
