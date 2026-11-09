"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FACETS,
  FAMILY_COLOR,
  labelFromScores,
  scoreFromAnswers,
} from "@/lib/app-data";

const SCALE = [
  { value: 1, label: "Not me" },
  { value: 2, label: "" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "" },
  { value: 5, label: "Very me" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..FACETS.length-1 = statements, FACETS.length = result
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const isResult = step >= FACETS.length;
  const facet = FACETS[step];

  function answer(value: number) {
    if (!facet) return;
    const next = { ...answers, [facet.key]: value };
    setAnswers(next);
    setStep((s) => s + 1);
  }

  function finish() {
    const scores = scoreFromAnswers(answers);
    try {
      localStorage.setItem("sidepath_facet_scores", JSON.stringify(scores));
      localStorage.setItem("sidepath_label", labelFromScores(scores));
    } catch {
      // localStorage unavailable — proceed without persisting, not fatal
    }
    router.push("/app/explore");
  }

  if (isResult) {
    const scores = scoreFromAnswers(answers);
    const label = labelFromScores(scores);
    const ranked = [...FACETS].sort((a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0));

    return (
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-10">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink/72">
          Your pattern, for now
        </p>
        <h1 className="mt-2 font-serif text-[26px] font-semibold leading-tight tracking-tightish">
          <em className="text-terracotta italic">{label}</em>
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/78">
          Your answers show a pattern most consistent with this &mdash; not a box, just where
          today&rsquo;s answers lean. Retake it any time; it changes as you do.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {ranked.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="w-[150px] shrink-0 text-[12.5px] font-medium text-ink/85">
                {f.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-sandstone/40">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${scores[f.key] ?? 0}%`,
                    background: FAMILY_COLOR[f.family],
                  }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-[11px] text-ink/72">
                {scores[f.key] ?? 0}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={finish}
          className="mt-10 rounded-full bg-terracotta-dark px-6 py-4 text-center text-[15px] font-semibold text-bone"
        >
          Stamp my passport
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-10">
      <div className="mb-4 flex gap-1.5">
        {FACETS.map((f, i) => (
          <span
            key={f.key}
            className="h-1 flex-1 rounded-full"
            style={{ background: i <= step ? "#C0532E" : "#E0C9A6" }}
          />
        ))}
      </div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-ink/72">
        {step + 1} of {FACETS.length}
      </p>

      <h1 className="mt-4 flex-1 font-serif text-2xl font-medium leading-snug tracking-tightish">
        {facet.statement}
      </h1>

      <div className="mt-6 flex flex-col gap-2.5">
        {SCALE.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => answer(s.value)}
            className="flex items-center justify-between rounded-2xl border-2 border-dashed border-sandstone bg-cream px-5 py-4 text-left transition-colors hover:border-terracotta"
          >
            <span className="font-serif text-base">
              {s.label || `—`}
            </span>
            <span className="font-mono text-[11px] text-ink/60">{s.value}/5</span>
          </button>
        ))}
      </div>
    </div>
  );
}
