"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * On every route change, draws the brand's winding path across a
 * full-screen wash, then fades it out. Skips the animation on first
 * mount so the initial page load isn't delayed by it.
 */
export default function PathTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  // Set once, at mount, from the first render's pathname — not inside the
  // effect — so it survives Strict Mode's dev-only double effect-invocation
  // without re-arming itself and firing the transition on first load.
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) {
      return;
    }
    prevPathname.current = pathname;

    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(overlay, { opacity: 1 });
    overlay.style.pointerEvents = "auto";

    const tl = gsap.timeline({
      onComplete: () => {
        overlay.style.pointerEvents = "none";
      },
    });
    tl.to(path, { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" }).to(
      overlay,
      { opacity: 0, duration: 0.35, ease: "power1.inOut", delay: 0.05 }
    );

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] opacity-0"
        style={{ background: "var(--bone)" }}
      >
        <svg
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            ref={pathRef}
            d="M-20 100 Q 80 20, 160 100 T 340 100 T 500 100"
            fill="none"
            stroke="#C0532E"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {children}
    </>
  );
}
