import { useId } from "react";

/**
 * A burgundy wax seal. Used wherever the app asks for a commitment (start,
 * finish the quiz) and as the profile's monogram, so the primary action
 * always looks like the same physical object.
 *
 * The lighter and darker burgundies are tints of the brand burgundy, there
 * only to make the wax look pressed; they are not new palette colours.
 */
export default function WaxSeal({
  size = 72,
  glyph = "arch",
  letter,
  className = "",
}: {
  size?: number;
  glyph?: "arch" | "arrow" | "letter";
  letter?: string;
  className?: string;
}) {
  const id = `wax-${useId().replace(/:/g, "")}`;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 76 76"
      className={`shrink-0 ${className}`}
      style={{ filter: "drop-shadow(1.5px 2.5px 0 rgba(38,32,27,.28))" }}
    >
      <defs>
        <radialGradient id={id} cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor="#9C434B" />
          <stop offset=".55" stopColor="#7A2E33" />
          <stop offset="1" stopColor="#5C2025" />
        </radialGradient>
      </defs>
      <g fill={`url(#${id}) #7A2E33`}>
        <path d="M38 5 C50 3 60 9 66 18 C73 26 74 38 70 48 C67 60 58 69 46 71 C36 74 24 71 15 63 C6 55 2 43 5 32 C7 20 16 10 27 7 C31 5 34 5 38 5 Z" />
        <circle cx="65" cy="55" r="7" />
        <circle cx="12" cy="23" r="6" />
        <circle cx="24" cy="68" r="5" />
      </g>
      <circle cx="38" cy="38" r="23.5" fill="none" stroke="#5C2025" strokeWidth="2.2" opacity=".75" />
      <circle cx="37.3" cy="37.3" r="23.5" fill="none" stroke="#C98089" strokeWidth=".8" opacity=".6" />
      {glyph === "arch" && (
        <g fill="none" stroke="#EBC4C7" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" opacity=".9">
          <path d="M28 50 V36 a10 10 0 0 1 20 0 V50" />
          <path d="M32 50 l6 -9 l6 9" />
        </g>
      )}
      {glyph === "arrow" && (
        <path
          d="M27 38 H47 M39 29 L48 38 L39 47"
          fill="none"
          stroke="#EBC4C7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".92"
        />
      )}
      {glyph === "letter" && (
        <text
          x="38"
          y="48"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-serif), serif" }}
          fontStyle="italic"
          fontWeight="600"
          fontSize="29"
          fill="#F2D5D7"
        >
          {letter}
        </text>
      )}
    </svg>
  );
}

/** The small wax dot that pins a postcard or marks the current tab. */
export function Pin({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[15px] w-[15px] rounded-full shadow-[1px_2px_0_rgba(38,32,27,0.3)] ${className}`}
      style={{ background: "radial-gradient(circle at 35% 30%, #9C434B, #7A2E33 55%, #5C2025)" }}
    />
  );
}
