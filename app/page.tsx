import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Button from "@/components/Button";
import WaitlistForm from "@/components/WaitlistForm";
import HeroPlanner from "@/components/site/HeroPlanner";
import Destinations from "@/components/site/Destinations";
import Steps from "@/components/site/Steps";
import { PLANS } from "@/lib/app-data";

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[92svh] items-end pt-16 md:items-center">
        <Photo name="hero" width={1600} eager className="!absolute inset-0">
          {/* Darkens the side the words sit on so they hold against any photo. */}
          <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/45 to-night/10 md:bg-gradient-to-r md:from-night/80 md:via-night/45 md:to-transparent" />
        </Photo>

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-24 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <h1 className="font-serif text-[42px] font-semibold leading-[1.04] tracking-tightish text-white md:text-7xl">
              The world&rsquo;s not as far as they told you.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
              Sidepath plans the whole trip around how you travel, what you can spend
              and the points you already have. Real prices, no ads.
            </p>
            <div className="mt-8 max-w-xl">
              <HeroPlanner />
              <p className="mt-3 text-sm text-white/85">
                Or{" "}
                <Link href="/app/onboarding" className="font-semibold text-white underline underline-offset-4">
                  take the quiz first
                </Link>{" "}
                and let it suggest where.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tightish text-ink md:text-4xl">Open right now</h2>
            <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink/75">
              Whole trips with the price of the whole trip. Flights in.
            </p>
          </div>
          <Link href="/app/explore" className="hidden shrink-0 text-sm font-semibold text-terracotta-dark underline-offset-4 hover:underline sm:block">
            See all in Explore
          </Link>
        </div>
        <Destinations />
      </section>

      <section className="border-y border-ink/10 bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tightish text-ink md:text-4xl">
            From &ldquo;I wish&rdquo; to a plan you can book
          </h2>
          <Steps className="mt-10" />
          <div className="mt-10">
            <Button href="/how-it-works" variant="secondary">
              How it works, in detail
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
        <Photo name="trainWindow" width={720} className="aspect-[4/3] rounded-2xl md:aspect-[5/4]" />
        <div>
          <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tightish text-ink md:text-4xl">
            Travel isn&rsquo;t a luxury. It&rsquo;s yours.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-ink/80">
            First big trip? Good. Everyone&rsquo;s first one feels impossible right up until
            it isn&rsquo;t. We built Sidepath for the people who were told it was too
            expensive, too complicated or too late.
          </p>
          <ul className="mt-6 space-y-2.5 text-[15px] text-ink/85">
            {["No ads, no sponsored placements.", "Real prices, even the ugly ones.", "Notes from people who have actually been there."].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <Button href="/mission" variant="secondary">
              Why we exist
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-tightish text-ink md:text-4xl">Start free</h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/75">
                Three plans, priced in USD wherever you are.
              </p>
            </div>
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {PLANS.map((p) => (
                <div key={p.id}>
                  <dt className="text-sm font-semibold text-ink/70">{p.name}</dt>
                  <dd className="mt-0.5">
                    <span className="font-mono text-2xl font-bold text-ink">{p.price}</span>{" "}
                    <span className="text-sm text-ink/65">{p.cadence}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <Button href="/pricing" variant="secondary" className="self-start md:self-auto">
              See pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-night text-bone">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8 md:py-20">
          <div className="max-w-md">
            <h2 className="font-serif text-3xl font-semibold tracking-tightish md:text-4xl">Not ready to dive in?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-bone/80">
              Leave your email and we&rsquo;ll let you know as real trips, prices and
              bookings go live.
            </p>
          </div>
          <div className="w-full max-w-md">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </>
  );
}
