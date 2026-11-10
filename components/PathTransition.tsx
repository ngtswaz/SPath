"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Matches globals.css's `.path-line.drawn` animation duration (path-draw,
// 1.1s) so the fade never cuts the line off mid-draw.
const DRAW_MS = 1100;
const FADE_MS = 300;

/**
 * The globe's replacement as connective tissue between routes: the brand's
 * winding-path line draws itself across a warm photo-toned panel, then the
 * whole panel fades to reveal the page underneath — the same motif used in
 * the hero and on Explore's route map, now also carrying the transition.
 * No 3D canvas, so no OrbitControls touch-scroll trap and nothing to keep
 * alive between route changes.
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
          <div
            key={runId}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 70% at 30% 110%, rgba(38,32,27,.55), transparent 60%), linear-gradient(180deg, #E8C79A 0%, #DCA876 35%, #B96B3E 68%, #7A4226 100%)",
            }}
          >
            <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="h-full w-full">
              <path
                d="M 10 250 Q 110 185, 175 155 T 390 55"
                fill="none"
                stroke="#C0532E"
                strokeWidth="2.4"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                className="animate-path-trace"
              />
            </svg>
          </div>
        )}
      </div>
      {children}
    </>
  );
}
