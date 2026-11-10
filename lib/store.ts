"use client";

import { useCallback, useEffect, useState } from "react";

// There is no backend yet, so everything a traveller enters in this
// preview (saved places, passports, cards, expenses, chat messages) lives
// in localStorage on their own device. One hook covers all of it. When
// Supabase tables exist, this file is the seam to replace.

const EVENT = "sidepath:store";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/**
 * State mirrored to localStorage. `ready` is false until the stored value
 * has been read on the client, so pages can avoid flashing an empty state
 * during hydration.
 */
export function useLocal<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(read(key, initial));
    setReady(true);
    const sync = (e: Event) => {
      if ((e as CustomEvent<string>).detail === key) setValue(read(key, initial));
    };
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
    // `initial` is a literal at every call site; re-running on its identity would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(read(key, initial)) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Storage unavailable (private window, quota): keep it in memory for this visit.
      }
      setValue(resolved);
      window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, set, ready];
}

/** A value stored as a plain string rather than JSON (the quiz label), read after mount. */
export function useStoredString(key: string): string | null {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => setValue(readString(key)), [key]);
  return value;
}

/** Plain-string values written by the quiz (kept as raw strings for compatibility). */
export function readString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export const KEYS = {
  saved: "sidepath_saved_destinations",
  label: "sidepath_label",
  scores: "sidepath_facet_scores",
  profile: "sidepath_profile",
  passports: "sidepath_passports",
  cards: "sidepath_cards",
  points: "sidepath_points",
  group: "sidepath_group",
  settings: "sidepath_settings",
  plan: "sidepath_last_plan",
  esimNotify: "sidepath_esim_notify",
} as const;

export interface Profile {
  name: string;
  email: string;
  home: string;
}

export const DEFAULT_PROFILE: Profile = { name: "Jashan", email: "", home: "" };

export const uid = () => Math.random().toString(36).slice(2, 10);
