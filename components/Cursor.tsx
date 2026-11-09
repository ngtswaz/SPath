"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small pin-shaped cursor that trails the pointer on fine-pointer
 * (mouse/trackpad) devices. No-ops on touch devices and respects
 * prefers-reduced-motion by skipping the trailing lag.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (reduceMotion && dotRef.current) {
        dotRef.current.style.transform = `translate(${tx - 6}px, ${ty - 6}px)`;
      }
    };

    const tick = () => {
      if (!reduceMotion) {
        x += (tx - x) * 0.25;
        y += (ty - y) * 0.25;
        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-3 w-3 rounded-full border-2 border-terracotta mix-blend-multiply"
      style={{ transform: "translate(-999px, -999px)" }}
    />
  );
}
