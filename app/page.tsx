import HeroChart from "@/components/HeroChart";
import Neatline from "@/components/paper/Neatline";
import SealStart from "@/components/SealStart";
import WaitlistForm from "@/components/WaitlistForm";

export default function HomePage() {
  return (
    <>
      {/* The whole first screen is one sea chart: headline where a chart
          prints its title, the trail and the X below it, a wax seal to
          start. The neatline sits just under the fixed navbar. */}
      <section className="paper paper-edge relative min-h-[100svh] px-[17px] pb-[17px] pt-[83px]">
        <Neatline className="inset-x-2.5 bottom-2.5 top-[76px]" />

        <div className="relative flex min-h-[calc(100svh-100px)] items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-6xl md:grid-cols-[1fr_1.05fr] md:items-center md:gap-x-10 md:px-10 lg:gap-x-16">
            <div className="px-[15px] pt-5 md:col-start-1 md:row-start-1 md:self-end md:px-0 md:pt-0">
              <h1 className="font-serif text-[39px] font-semibold leading-[1.04] tracking-tightish text-ink md:text-6xl lg:text-7xl">
                The world&rsquo;s not
                <br />
                as far as
                <br />
                they told you.
              </h1>
              <p className="mt-3.5 max-w-[26rem] font-serif [text-wrap:balance] text-base italic leading-[1.45] text-ink/85 md:mt-6 md:text-xl">
                A chart for the trip you keep talking yourself out of.
              </p>
            </div>

            <div
              className="mx-auto w-full md:col-start-2 md:row-span-2 md:row-start-1"
              style={{ maxWidth: "min(560px, calc((100svh - 150px) * 0.915))" }}
            >
              <HeroChart />
            </div>

            <div className="px-[13px] pb-4 pt-2 md:col-start-1 md:row-start-2 md:self-start md:px-0 md:pt-10">
              <SealStart />
            </div>
          </div>
        </div>
      </section>

      <section className="paper border-t-[1.5px] border-dashed border-ink/50 px-6 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <h2 className="font-serif text-2xl italic text-ink">Not ready to dive in?</h2>
          <p className="max-w-sm text-sm text-ink/80">
            Leave your email and we&rsquo;ll let you know as real trips,
            prices and bookings go live.
          </p>
          <div className="mt-2 w-full max-w-md">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </>
  );
}
