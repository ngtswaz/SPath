"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Matches globals.css's `.path-line.drawn` animation duration (path-draw,
// 1.1s) so the fade never cuts the line off mid-draw.
const DRAW_MS = 1100;
const FADE_MS = 300;

/**
 * The connective tissue between routes: a blank sheet of chart paper, the
 * brand's winding trail inked across it to an X, then the sheet fades to
 * reveal the page underneath. Same motif as the home chart and Explore's
 * map, so moving between screens reads as following the trail.
 */
export default function PathTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Set once, at mount, from the first render's pathname — not inside the
  // effect — so it survives Strict Mode's dev-only double effect-invocation
  // without re-arming itself and firing the transition on first load.
  const prevPathname = useRef(pathname);
  const [phase, setPhase] = useState<"idle" | "drawing" | "fading">("idle");
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    setRunId((n) => n + 1);
    setPhase("drawing");

    const toFade = setTimeout(() => setPhase("fading"), DRAW_MS);
    const toIdle = setTimeout(() => setPhase("idle"), DRAW_MS + FADE_MS);
    return () => {
      clearTimeout(toFade);
      clearTimeout(toIdle);
    };
  }, [pathname]);

  const active = phase !== "idle";

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[70] overflow-hidden transition-opacity duration-300 ${
          active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {active && (
          <div key={runId} className="paper paper-edge absolute inset-0">
            <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="h-full w-full">
              {/* The trail as it will be, faint and dashed, then inked in. */}
              <path
                d="M 10 250 Q 110 185, 175 155 T 372 62"
                fill="none"
                stroke="#26201B"
                strokeWidth="1.2"
                strokeDasharray="1 7"
                strokeLinecap="round"
                opacity=".45"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 10 250 Q 110 185, 175 155 T 372 62"
                fill="none"
                stroke="#C0532E"
                strokeWidth="2.6"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                className="animate-path-trace"
              />
            </svg>
            {/* X marks where the trail lands. */}
            <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "93%", top: "20.67%" }}>
              <svg
                aria-hidden="true"
                width="34"
                height="34"
                viewBox="0 0 26 26"
                className="animate-fade-up opacity-0 [animation-delay:.85s] [animation-duration:.25s]"
              >
                <path d="M5 5 L21 21 M21 5 L5 21" fill="none" stroke="#C0532E" strokeWidth="4.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {children}
    </>
  );
}
