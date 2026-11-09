"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";

const TransitionGlobe = dynamic(() => import("./TransitionGlobe"), { ssr: false });

/**
 * On every route change, the globe itself becomes the connective tissue:
 * a brief night-wash overlay with the globe spinning through, then it
 * fades to reveal wherever you just navigated to. Replaces the old flat
 * winding-line wipe — same ~0.9s budget, so this isn't a slower page swap,
 * just a more thematic one. The globe only mounts while actually
 * transitioning (not kept alive in the background) so it costs nothing on
 * pages that never trigger one.
 */
export default function PathTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  // Set once, at mount, from the first render's pathname — not inside the
  // effect — so it survives Strict Mode's dev-only double effect-invocation
  // without re-arming itself and firing the transition on first load.
  const prevPathname = useRef(pathname);
  const [active, setActive] = useState(false);
  // Holds whichever "start the fade-in now" closure the current transition
  // created, so TransitionGlobe's onReady (fired from a child that doesn't
  // exist yet when the effect below runs) always reaches the right one.
  const startRef = useRef<() => void>(() => {});

  // Warm the globe's chunk on mount, well before any click could need it.
  // Without this, the FIRST transition a visitor ever triggers mounts
  // TransitionGlobe cold: the overlay reaches full opacity (~0.28s) before
  // the lazy-loaded chunk finishes fetching and the <canvas> paints, so the
  // very first transition shows a blank dark box with nothing in it until
  // the chunk catches up. Prefetching here (import, not the dynamic()
  // wrapper) shares the same module cache, so by the time a route actually
  // changes the chunk is already resolved and only the mount itself (React
  // + WebGL context creation) remains — which is what onReady below gates.
  useEffect(() => {
    import("./TransitionGlobe");
  }, []);

  useEffect(() => {
    if (prevPathname.current === pathname) {
      return;
    }
    prevPathname.current = pathname;

    const overlay = overlayRef.current;
    if (!overlay) return;

    setActive(true);
    overlay.style.pointerEvents = "auto";

    let started = false;
    let tl: gsap.core.Timeline | null = null;

    // Gated on TransitionGlobe's actual onReady signal rather than a fixed
    // delay. A first attempt used a flat 0.08s delay tuned from measured
    // mount times on this machine (~65-85ms) — screenshotting the real,
    // unobserved transition (not through a polling loop, which itself
    // competes for the main thread and quietly skews the timing) showed
    // that guess still left a genuine ~100ms window of solid overlay with
    // no globe in it. Waiting on the real signal removes the guesswork, and
    // adapts to whatever a given device actually needs.
    const start = () => {
      if (started) return;
      started = true;
      tl = gsap.timeline({
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          setActive(false);
        },
      });
      tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: "power2.out" }
      )
        .to(overlay, { opacity: 1, duration: 0.3 }) // hold — the route swap happens somewhere in here
        .to(overlay, { opacity: 0, duration: 0.35, ease: "power1.inOut" });
    };

    startRef.current = start;
    // Defensive cap: never leave the overlay stuck invisible if onReady
    // somehow never fires (WebGL unsupported, a dropped frame callback).
    const fallback = setTimeout(start, 450);

    return () => {
      clearTimeout(fallback);
      tl?.kill();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-night opacity-0"
      >
        {active && (
          <div className="h-[42vmin] w-[42vmin] max-h-[300px] max-w-[300px]">
            <TransitionGlobe onReady={() => startRef.current()} />
          </div>
        )}
      </div>
      {children}
    </>
  );
}
