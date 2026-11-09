import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { FEATURES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Features",
  description: "What's in the Sidepath toolkit, and why each piece exists.",
};

const rotations = ["-1.5deg", "1deg", "-0.5deg", "1.5deg", "-1deg", "0.5deg", "-0.75deg"];

export default function FeaturesPage() {
  return (
    <PageShell
      eyebrow="What's in the toolkit"
      title="Everything that untangles the knot."
      lede="No feature here exists to look impressive in a pitch deck. Each one removes a specific reason someone didn't book."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <article
            key={f.title}
            style={{ transform: `rotate(${rotations[i % rotations.length]})` }}
            className="rounded-xl border border-sandstone bg-cream p-6 shadow-sm transition-transform hover:rotate-0"
          >
            <h2 className="font-serif text-xl text-ink">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{f.body}</p>
            {f.stat && (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-terracotta-dark">
                {f.stat}
              </p>
            )}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
