"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FACETS, FAMILY_COLOR, labelFromScores, scoreFromAnswers } from "@/lib/app-data";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

const SCALE = [1, 2, 3, 4, 5];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..FACETS.length-1 = statements, FACETS.length = result
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const isResult = step >= FACETS.length;
  const facet = FACETS[step];

  function answer(value: number) {
    if (!facet) return;
    setAnswers({ ...answers, [facet.key]: value });
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
    router.push("/app/onboarding/details");
  }

  if (isResult) {
    const scores = scoreFromAnswers(answers);
    const label = labelFromScores(scores);
    const ranked = [...FACETS].sort((a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0));

    return (
      <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-center py-6">
        <p className="text-sm font-semibold text-ink/65">Your pattern, for now</p>
        <h1 className="mt-2 font-serif text-[32px] font-semibold leading-[1.12] tracking-tightish text-ink md:text-5xl">{label}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
          Your answers show a pattern most consistent with this, not a box, just where
          today&rsquo;s answers lean. Retake it any time; it changes as you do.
        </p>

        <ul className="mt-8 space-y-3">
          {ranked.map((f) => (
            <li key={f.key} className="grid grid-cols-[minmax(0,172px)_1fr_auto] items-center gap-3">
              <span className="truncate text-sm font-medium text-ink">{f.label}</span>
              <span className="h-2 overflow-hidden rounded-full bg-ink/10">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${Math.max(scores[f.key] ?? 0, 2)}%`, background: FAMILY_COLOR[f.family] }}
                />
              </span>
              <span className="w-8 text-right font-mono text-xs font-bold text-ink">{scores[f.key] ?? 0}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button onClick={finish}>Save and continue</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setAnswers({});
              setStep(0);
            }}
          >
            Start again
          </Button>
        </div>
      </div>
    );
  }

  const chosen = answers[facet.key];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col py-2">
      <div className="flex items-center justify-between">
        <Logo />
        <p className="font-mono text-xs font-bold text-ink/70">
          {step + 1} of {FACETS.length}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={FACETS.length}
        aria-valuenow={step}
        className="mt-5 h-1.5 overflow-hidden rounded-full bg-ink/10"
      >
        <div className="h-full rounded-full bg-terracotta transition-[width] duration-300" style={{ width: `${(step / FACETS.length) * 100}%` }} />
      </div>

      <div className="flex flex-1 flex-col justify-center py-10">
        <p className="text-sm font-semibold text-ink/65">How true is this for you?</p>
        <h1 className="mt-3 font-serif text-[30px] font-medium leading-[1.22] tracking-tightish text-ink md:text-[40px]">
          {facet.statement}
        </h1>

        <div role="group" aria-label="Your answer, from 1 not me to 5 very me" className="mt-10">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {SCALE.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={chosen === v}
                aria-label={v === 1 ? "1, not me" : v === 5 ? "5, very me" : String(v)}
                onClick={() => answer(v)}
                className={`flex h-16 items-center justify-center rounded-xl border text-xl font-semibold transition-colors ${
                  chosen === v
                    ? "border-ink bg-ink text-bone"
                    : "border-ink/20 bg-white text-ink hover:border-terracotta-dark hover:bg-terracotta/10"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="mt-2.5 flex justify-between text-sm font-medium text-ink/70" aria-hidden="true">
            <span>Not me</span>
            <span>Very me</span>
          </div>
        </div>
      </div>

      <div className="flex min-h-[46px] items-center justify-between">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="-ml-3">
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button variant="ghost" href="/app/explore" className="-mr-3 text-ink/70">
          Skip the quiz
        </Button>
      </div>
    </div>
  );
}
