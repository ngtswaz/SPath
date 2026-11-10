import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Photo from "@/components/ui/Photo";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Mission",
  description: "Travel isn't a luxury. It's yours. Why Sidepath exists and who it's for.",
};

const VALUES = [
  "Travel belongs to everyone.",
  "No gatekeeping, by anyone.",
  "Teach, don't talk down.",
  "Untie the knot.",
  "Proof over promises.",
];

export default function MissionPage() {
  return (
    <PageShell
      title="Travel isn’t a luxury. It’s yours."
      lede="We built Sidepath to dismantle the belief that travel is reserved for some people. Not with ads. Not with a booking fee hiding in the fine print. With the planning, the budgets, the visas and the points, untied."
    >
      <Photo name="platform" width={1040} className="aspect-[16/7] rounded-2xl" />

      <section className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">The Told-No Traveller</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-ink/80">
            The hero and the emotional centre of this product. They believe travel is
            out of reach: too expensive, too complicated, too late. They&rsquo;re
            defeated, not anti-travel. Sidepath is the friend who says
            &ldquo;actually, here&rsquo;s how,&rdquo; and means it.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">The Independent Explorer</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-ink/80">
            The engine. Solo, curious, slightly contrarian, juggling five apps to plan
            one trip. They pay, and they seed the community. We serve them well, never
            at the Hero&rsquo;s expense.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">Five things we won&rsquo;t move on</h2>
        <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
          {VALUES.map((v) => (
            <li key={v} className="flex items-center gap-3 border-t border-ink/15 py-4 text-[17px] text-ink">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
              {v}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-2xl bg-night p-7 text-bone md:p-12">
        <h2 className="font-serif text-3xl font-semibold tracking-tightish">The Legacy Flight Foundation</h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-bone/85">
          When community growth hits density, a share of revenue funds the first
          international trip for low-income elderly people who have never held a
          passport. We&rsquo;d rather fund one real first flight than run a hundred
          feel-good ads.
        </p>
        <p className="mt-4 text-sm text-bone/70">
          The commitment stands now. The programme activates as the community grows.
        </p>
      </section>

      <div className="mt-10">
        <Button href="/app/onboarding">Start with the quiz</Button>
      </div>
    </PageShell>
  );
}
