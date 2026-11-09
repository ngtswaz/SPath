type LogoProps = {
  /** "mark" = icon only (favicon, app tile). "full" = icon + wordmark. */
  variant?: "mark" | "full";
  className?: string;
};

/**
 * The archway mark: a threshold, an inner winding path, and a mountain
 * beyond it. Drawn with currentColor so it can sit on any background —
 * set text color on a wrapper to recolor it.
 */
export default function Logo({ variant = "full", className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Archway */}
        <path
          d="M8 40V22a16 16 0 0 1 32 0v18"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Terracotta mountain beyond the arch */}
        <path
          d="M14 40l7-11 5 6 4-7 4 12"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Winding path through the threshold */}
        <path
          d="M12 40c4-3 2-6 6-7s2-5 6-6 2-4 6-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="0.5 5"
          opacity="0.85"
        />
      </svg>
      {variant === "full" && (
        <span className="font-serif text-xl lowercase tracking-tightish">
          sidepath
        </span>
      )}
    </span>
  );
}
