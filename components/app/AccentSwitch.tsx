"use client";

import { useEffect, useState } from "react";
import { ACCENTS, ACCENT_KEY, type AccentId } from "@/lib/accent";
import Icon from "@/components/ui/icons";

/**
 * Temporary: lets the team flip between the accent candidates on the real
 * product. Remove this (and the data-accent blocks in globals.css) once a
 * colour is chosen.
 */
export default function AccentSwitch() {
  const [current, setCurrent] = useState<AccentId>("green");

  useEffect(() => {
    const a = document.documentElement.getAttribute("data-accent") as AccentId | null;
    if (a) setCurrent(a);
  }, []);

  function choose(id: AccentId) {
    document.documentElement.setAttribute("data-accent", id);
    try {
      localStorage.setItem(ACCENT_KEY, id);
    } catch {
      // Not stored: the choice still applies until the page reloads.
    }
    setCurrent(id);
  }

  return (
    <div role="radiogroup" aria-label="Accent colour" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          type="button"
          role="radio"
          aria-checked={current === a.id}
          onClick={() => choose(a.id)}
          className={`flex min-h-[56px] items-center gap-3 rounded-2xl border bg-white px-3.5 text-left text-sm font-semibold text-ink transition-transform active:scale-[0.97] ${
            current === a.id ? "border-ink" : "border-ink/15"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ background: a.swatch }}>
            {current === a.id && <Icon name="check" size={16} />}
          </span>
          {a.name}
        </button>
      ))}
    </div>
  );
}
