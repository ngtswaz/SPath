"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FACETS, FAMILY_COLOR, labelFromScores, scoreFromAnswers } from "@/lib/app-data";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

const SCALE = [1, 2, 3, 4, 5];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..FACETS.length-1 = statements, FACETS.length = result
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // +1 when moving on, -1 when going back: decides which way cards slide.
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();

  const isResult = step >= FACETS.length;
  const facet = FACETS[step];

  function answer(value: number) {
    if (!facet) return;
    setAnswers({ ...answers, [facet.key]: value });
    setDirection(1);
    setStep((s) => s + 1);
  }

  function back() {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
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
      <div className="flex min-h-[calc(100svh-5rem)] flex-col justify-center py-6">
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
    <div className="flex min-h-[calc(100svh-5rem)] flex-col py-2">
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
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(step / FACETS.length) * 100}%` }} />
      </div>

      {/* Each statement is a card: answering sends it off to the left and
          brings the next in from the right. Dragging the card to the right
          goes back one, the way you would flick back through a stack. */}
      <div className="relative flex flex-1 flex-col justify-center overflow-x-clip py-8">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={facet.key}
            custom={direction}
            variants={{
              enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 70 }),
              centre: { opacity: 1, x: 0 },
              exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -70 }),
            }}
            initial="enter"
            animate="centre"
            exit="exit"
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            drag={step > 0 && !reduce ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.35 }}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              if (info.offset.x > 90 || info.velocity.x > 500) back();
            }}
            className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-float md:p-9"
          >
            <p className="text-sm font-semibold text-ink/65">How true is this for you?</p>
            <h1 className="mt-3 font-serif text-[28px] font-medium leading-[1.22] tracking-tightish text-ink md:text-[38px]">
              {facet.statement}
            </h1>

            <div role="group" aria-label="Your answer, from 1 not me to 5 very me" className="mt-9">
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {SCALE.map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={chosen === v}
                    aria-label={v === 1 ? "1, not me" : v === 5 ? "5, very me" : String(v)}
                    onClick={() => answer(v)}
                    // Stops a tap on a number from starting a card drag.
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    className={`flex aspect-square max-h-[72px] w-full items-center justify-center rounded-full border text-xl font-semibold transition-[background-color,border-color,transform] duration-150 active:scale-90 ${
                      chosen === v
                        ? "border-ink bg-ink text-bone"
                        : "border-ink/20 bg-white text-ink hover:border-accent-dark hover:bg-accent/10"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-sm font-medium text-ink/70" aria-hidden="true">
                <span>Not me</span>
                <span>Very me</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex min-h-[48px] items-center justify-between">
        {step > 0 ? (
          <Button variant="ghost" onClick={back} className="-ml-3">
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
