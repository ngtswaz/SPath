"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FACETS,
  FAMILY_COLOR,
  labelFromScores,
  scoreFromAnswers,
} from "@/lib/app-data";
import WaxSeal from "@/components/paper/WaxSeal";

// The five answers sit on a half dial, left ("not me") to right ("very me").
// Coordinates are in the dial's own 340 x 270 box; the pivot is at 170,200.
const STOPS = [
  { value: 1, x: 30, y: 200, label: "Not me" },
  { value: 2, x: 71, y: 101, label: "" },
  { value: 3, x: 170, y: 60, label: "Neutral" },
  { value: 4, x: 269, y: 101, label: "" },
  { value: 5, x: 310, y: 200, label: "Very me" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..FACETS.length-1 = statements, FACETS.length = result
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // Which stop the needle is being pointed at right now (hover or focus).
  const [aim, setAim] = useState<number | null>(null);

  const isResult = step >= FACETS.length;
  const facet = FACETS[step];

  function answer(value: number) {
    if (!facet) return;
    setAnswers({ ...answers, [facet.key]: value });
    setAim(null);
    setStep((s) => s + 1);
  }

  function finish() {
    const scores = scoreFromAnswers(answers);
    try {
      localStorage.setItem("sidepath_facet_scores", JSON.stringify(scores));
      localStorage.setItem("sidepath_label", labelFromScores(scores));
    } catch {
      // localStorage unavailable: proceed without persisting, not fatal
    }
    router.push("/app/explore");
  }

  if (isResult) {
    const scores = scoreFromAnswers(answers);
    const label = labelFromScores(scores);
    const ranked = [...FACETS].sort((a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0));

    return (
      <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-6 pb-10 pt-10 md:justify-center">
        <p className="font-serif text-base italic text-ink/85">Your pattern, for now</p>
        <h1 className="mt-1.5 font-serif text-[29px] font-semibold italic leading-[1.15] tracking-tightish text-terracotta-dark md:text-4xl">
          {label}
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/85">
          Your answers show a pattern most consistent with this, not a box, just where
          today&rsquo;s answers lean. Retake it any time; it changes as you do.
        </p>

        <div className="mt-8 border-t-[1.5px] border-ink">
          {ranked.map((f) => (
            <div key={f.key} className="flex items-center gap-3 border-b border-ink/20 py-[9px]">
              <span className="w-[150px] shrink-0 text-[12.5px] font-medium text-ink">{f.label}</span>
              <div className="h-[9px] flex-1 border border-ink/60 bg-bone/60">
                <div
                  className="h-full"
                  style={{ width: `${scores[f.key] ?? 0}%`, background: FAMILY_COLOR[f.family] }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-[11.5px] text-ink">
                {scores[f.key] ?? 0}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={finish}
          className="group mt-9 flex items-center gap-3.5 self-start rounded-[3px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-dark"
        >
          <WaxSeal size={64} className="transition-transform duration-150 group-hover:-rotate-6 group-active:scale-95" />
          <span className="font-serif text-2xl font-semibold tracking-tightish text-ink decoration-terracotta decoration-wavy underline-offset-[6px] group-hover:underline">
            Stamp my passport
          </span>
        </button>
      </div>
    );
  }

  const pointed = aim ?? answers[facet.key] ?? 3;

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col px-6 pb-8 pt-10 md:justify-center md:gap-6">
      {/* A knotted line: one knot per statement, tied off as you go. */}
      <div className="flex items-center justify-between">
        <div className="relative flex w-[156px] items-center justify-between" aria-hidden="true">
          <span className="absolute inset-x-1 top-1/2 border-t-[1.2px] border-dashed border-ink/70" />
          {FACETS.map((f, i) => (
            <span
              key={f.key}
              className={`relative rounded-full border-[1.2px] ${
                i === step
                  ? "h-[11px] w-[11px] border-terracotta-dark bg-terracotta"
                  : i < step
                    ? "h-2 w-2 border-ink bg-ink"
                    : "h-2 w-2 border-ink bg-cream"
              }`}
            />
          ))}
        </div>
        <p className="font-mono text-[11.5px] text-ink/85">
          {step + 1} of {FACETS.length}
        </p>
      </div>

      <h1 className="mt-9 flex-1 font-serif text-[29px] font-medium leading-[1.27] tracking-[-0.01em] text-ink md:mt-4 md:flex-none md:text-4xl md:leading-[1.2]">
        {facet.statement}
      </h1>

      <div
        role="group"
        aria-label="How true is this for you?"
        className="relative mx-auto h-[270px] w-[340px] shrink-0 max-[380px]:-mx-3 max-[380px]:scale-90"
      >
        <svg viewBox="0 0 340 270" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M54 200 A116 116 0 0 1 286 200" fill="none" stroke="#26201B" strokeWidth="8" strokeDasharray="1.2 8" opacity=".55" />
          <path d="M62 200 A108 108 0 0 1 278 200" fill="none" stroke="#26201B" strokeWidth=".9" />
          <path d="M6 200 H334" fill="none" stroke="#26201B" strokeWidth=".9" />
          <path d="M30 200 A140 140 0 0 1 310 200" fill="none" stroke="#C0532E" strokeWidth="2.6" strokeDasharray="2 9" strokeLinecap="round" />
          <g
            style={{
              transform: `translate(170px, 200px) rotate(${(pointed - 3) * 45}deg)`,
              transition: "transform .32s cubic-bezier(.3,1.35,.5,1)",
            }}
          >
            <path d="M0 -102 L6.5 -6 L0 8 L-6.5 -6 Z" fill="#C0532E" stroke="#9E411F" strokeWidth=".8" strokeLinejoin="round" />
            <path d="M0 8 L4 20 L0 34 L-4 20 Z" fill="#26201B" />
          </g>
          <circle cx="170" cy="200" r="8" fill="#26201B" />
          <circle cx="170" cy="200" r="2.4" fill="#F7F2EA" />
        </svg>

        {STOPS.map((s) => {
          const chosen = answers[facet.key] === s.value;
          const lit = pointed === s.value && (aim !== null || chosen);
          return (
            <button
              key={s.value}
              type="button"
              aria-label={s.label ? `${s.value} of 5, ${s.label.toLowerCase()}` : `${s.value} of 5`}
              aria-pressed={chosen}
              onClick={() => answer(s.value)}
              onMouseEnter={() => setAim(s.value)}
              onMouseLeave={() => setAim(null)}
              onFocus={() => setAim(s.value)}
              onBlur={() => setAim(null)}
              className={`absolute flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] font-mono text-[15px] font-bold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-terracotta-dark ${
                lit ? "border-terracotta-dark bg-terracotta-dark text-bone" : "border-ink bg-cream text-ink"
              }`}
              style={{ left: s.x, top: s.y }}
            >
              {s.value}
            </button>
          );
        })}

        {STOPS.filter((s) => s.label).map((s) => (
          <span
            key={s.label}
            aria-hidden="true"
            className="absolute w-[90px] -translate-x-1/2 text-center font-serif text-[15px] italic text-ink"
            style={{ left: s.x, top: s.value === 3 ? 4 : 232 }}
          >
            {s.label}
          </span>
        ))}
      </div>

      <p className="mt-1 text-center text-[13.5px] text-ink/80">Point the needle at how true this is for you.</p>

      <div className="mt-4 flex min-h-[44px] items-center">
        {step > 0 && (
          <button
            type="button"
            onClick={() => {
              setAim(null);
              setStep((s) => s - 1);
            }}
            className="-ml-2.5 min-h-[44px] px-2.5 text-sm font-semibold text-ink underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
