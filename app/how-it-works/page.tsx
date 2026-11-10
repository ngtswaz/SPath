import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Button from "@/components/Button";
import Photo from "@/components/ui/Photo";
import { Notice } from "@/components/ui";
import { STEPS } from "@/components/site/Steps";

export const metadata: Metadata = {
  title: "How it works",
  description: "From a quiz to a plan you can book: how Sidepath builds a trip around you.",
};

const DETAIL = [
  [
    "You answer nine statements, from “not me” to “very me”.",
    "We score you across nine ways of travelling in three families: Cultural, Adventure and Restorative.",
    "The label you get is a summary, not a box. Retake it whenever you like.",
  ],
  [
    "Destination, dates, budget and how packed you want the days.",
    "Where you are starting from.",
    "The points and miles you have. You type them in. We never link to your accounts.",
  ],
  [
    "Places are ranked against your nine scores, then fitted to your budget and dates.",
    "Every slot comes with a few alternatives, so you swap one stop without rebuilding the trip.",
    "Each day gets a short write up that only uses the places in your plan.",
  ],
  [
    "Where a card benefit or your points make a slot cheaper or better, you see a perk offer. It is never applied for you.",
    "If you hold more than one passport, we check the visa against the one that makes the trip easiest.",
    "Card numbers are never stored. We only ever ask what kind of card it is.",
  ],
];

export default function HowItWorksPage() {
  return (
    <PageShell
      title="Tell it where. It tells you how."
      lede="Four steps, start to finish. No locked itinerary at the end, just a plan you can change, with the reasoning shown."
    >
      <ol className="space-y-12 md:space-y-16">
        {STEPS.map((s, i) => (
          <li key={s.title} className="grid gap-5 border-t-2 border-ink pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12">
            <div>
              <span className="font-mono text-sm font-bold text-accent-dark">Step {i + 1}</span>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tightish text-ink">{s.title}</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-ink/80">{s.body}</p>
            </div>
            <ul className="space-y-3 text-[15px] leading-relaxed text-ink/85">
              {DETAIL[i].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <Photo name="lisbonRooftops" width={1040} className="mt-16 aspect-[16/7] rounded-3xl" />

      <Notice className="mt-10" title="Where this stands today">
        The quiz, Explore and a sample Lisbon itinerary work now on demo data. Live prices,
        the planner itself and visa data arrive as partners are connected.
      </Notice>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/app/onboarding">Take the quiz</Button>
        <Button href="/features" variant="secondary">
          See the features
        </Button>
      </div>
    </PageShell>
  );
}
