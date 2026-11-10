"use client";

import { Children, useRef, useState } from "react";

/**
 * A row you swipe through on a phone, one item snapping into place at a
 * time, with dots showing where you are. From md up the same items lay out
 * as a grid instead, since a mouse has nothing to swipe with.
 */
export default function Carousel({
  children,
  label,
  itemClassName = "w-[84%]",
  gridClassName = "md:grid-cols-3",
}: {
  children: React.ReactNode;
  label: string;
  /** Width of one item on phones. Less than 100% so the next one peeks in. */
  itemClassName?: string;
  gridClassName?: string;
}) {
  const items = Children.toArray(children);
  const row = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = row.current;
    if (!el) return;
    const centre = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const distance = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centre);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    setActive(nearest);
  }

  return (
    <div>
      <ul
        ref={row}
        onScroll={onScroll}
        aria-label={label}
        className={`no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-5 px-5 pb-1 md:mx-0 md:grid md:snap-none md:gap-6 md:overflow-visible md:px-0 ${gridClassName}`}
      >
        {items.map((child, i) => (
          <li key={i} className={`shrink-0 snap-center md:w-auto ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>
      {items.length > 1 && (
        <div aria-hidden="true" className="mt-4 flex justify-center gap-1.5 md:hidden">
          {items.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-200 ${i === active ? "w-5 bg-ink" : "w-1.5 bg-ink/25"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
