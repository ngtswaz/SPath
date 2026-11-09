"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !ref.current) return;
    const counter = { n: 0 };
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.1,
      ease: "power1.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(counter.n).toString();
      },
    });
    return () => {
      tween.kill();
    };
  }, [started, value]);

  return (
    <div ref={wrapperRef} className="flex flex-col gap-1">
      <p className="font-mono text-4xl text-terracotta-dark md:text-5xl">
        <span ref={ref}>0</span>
        {suffix}
      </p>
      <p className="max-w-[18ch] text-sm text-ink/70">{label}</p>
    </div>
  );
}
