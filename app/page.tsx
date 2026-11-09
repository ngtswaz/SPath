import dynamic from "next/dynamic";
import StartButton from "@/components/StartButton";
import WaitlistForm from "@/components/WaitlistForm";

const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse rounded-full bg-ink/10"
    />
  ),
});

export default function HomePage() {
  return (
    <>
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-night">
        <div className="relative aspect-square w-[88vw] max-w-[640px]">
          <Globe />
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-6 text-center">
          <p className="font-serif text-5xl italic text-bone md:text-7xl">
            Why not?
          </p>
          <p className="mt-4 font-serif text-lg italic text-bone/80 md:text-xl">
            Travel isn&rsquo;t a luxury. It&rsquo;s yours.
          </p>
        </div>

        <div className="pointer-events-auto absolute bottom-14 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center gap-4 px-6 text-center">
          <StartButton className="shadow-[0_8px_24px_rgba(0,0,0,0.35)]" />
          <p className="font-mono text-[11px] uppercase tracking-wide text-bone/45">
            No ads. No booking fees. Ever.
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-cream px-6 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <p className="font-serif text-2xl italic text-ink">
            Not ready to dive in?
          </p>
          <p className="max-w-sm text-sm text-ink/70">
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
