"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const TransitionGlobe = dynamic(() => import("./TransitionGlobe"), { ssr: false });

/**
 * On every route change, the globe itself is the connective tissue: the
 * same globe as the hero swings across the screen (camera orbiting around
 * it, left or right) on a fully transparent background — no solid overlay,
 * no "curtain" blocking the page. The destination content is already there
 * underneath the whole time; the globe is just what visibly moves. Mounts
 * only for the duration of the swing (not kept alive in the background), so
 * it costs nothing on pages that never trigger a transition.
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
  const reverseRef = useRef(false);

  // Warm the globe's chunk on mount, well before any click could need it,
  // so the first-ever transition in a session doesn't lag behind the rest.
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

    // Alternate the swing direction per-transition so it doesn't feel like
    // the same mechanical animation firing every single time.
    reverseRef.current = Math.random() < 0.5;
    setActive(true);
    overlay.style.pointerEvents = "auto";

    // Independent backstop: SwingCamera calls onDone itself once its own
    // wall-clock timer completes, but that depends on R3F's render loop
    // actually ticking. Testing surfaced a run where a busy main thread
    // during the route change starved rAF badly enough that the swing never
    // reached completion within several seconds — a real, if rare, failure
    // mode that would otherwise leave the globe (and its pointer-events
    // lock) stuck on screen indefinitely. This timer isn't tied to the
    // render loop at all, so it always fires and cleans up regardless.
    const backstop = setTimeout(() => {
      overlay.style.pointerEvents = "none";
      setActive(false);
    }, 1400);

    return () => clearTimeout(backstop);
  }, [pathname]);

  function handleSwingDone() {
    const overlay = overlayRef.current;
    if (overlay) overlay.style.pointerEvents = "none";
    setActive(false);
  }

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center"
      >
        {active && (
          <div className="h-[42vmin] w-[42vmin] max-h-[300px] max-w-[300px]">
            <TransitionGlobe reverse={reverseRef.current} onDone={handleSwingDone} />
          </div>
        )}
      </div>
      {children}
    </>
  );
}
