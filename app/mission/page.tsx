import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import StatCounter from "@/components/StatCounter";
import { MISSION_STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "Travel isn't a luxury. It's yours. Why Sidepath exists and who it's for.",
};

export default function MissionPage() {
  return (
    <PageShell
      eyebrow="Why we exist"
      title={
        <>
          Travel isn&rsquo;t a luxury.{" "}
          <em className="text-terracotta italic">It&rsquo;s yours.</em>
        </>
      }
      lede="We built Sidepath to dismantle the belief that travel is reserved for some people. Not with ads. Not with a booking fee hiding in the fine print. With the planning, the budgets, the visas and the points, untied."
    >
      <section className="grid gap-10 sm:grid-cols-3">
        {MISSION_STATS.map((s) => (
          <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
        ))}
      </section>

      <section className="mt-20 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl text-ink">The Told-No Traveller</h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            The hero and the emotional centre of this product. They believe
            travel is out of reach: too expensive, too complicated, too late.
            They&rsquo;re defeated, not anti-travel. Sidepath is the friend
            who says &ldquo;actually, here&rsquo;s how,&rdquo; and means it.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-ink">The Independent Explorer</h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            The engine. Solo, curious, slightly contrarian, juggling five
            apps to plan one trip. They pay, and they seed the community. We
            serve them well, never at the Hero&rsquo;s expense.
          </p>
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-sandstone bg-cream p-8 md:p-10">
        <h2 className="font-serif text-2xl text-ink">The Legacy Flight Foundation</h2>
        <p className="mt-3 max-w-2xl text-ink/75 leading-relaxed">
          When community growth hits density, a share of revenue funds the
          first international trip for low-income elderly people who have
          never held a passport. We&rsquo;d rather fund one real first flight
          than run a hundred feel-good ads.
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-wide text-ink/70">
          The commitment stands now. The programme activates as the
          community grows.
        </p>
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-2xl text-ink">Five things we won&rsquo;t move on</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            "Travel belongs to everyone.",
            "No gatekeeping, by anyone.",
            "Teach, don't talk down.",
            "Untie the knot.",
            "Proof over promises.",
          ].map((v) => (
            <li
              key={v}
              className="flex items-start gap-3 rounded-xl border border-ink/10 px-4 py-3"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
              />
              <span className="text-sm text-ink/80">{v}</span>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
