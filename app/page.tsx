import StartButton from "@/components/StartButton";
import WaitlistForm from "@/components/WaitlistForm";

// The hero's four waypoints, in viewBox coordinates (0 0 400 800) — purely
// decorative here (unlike Explore's RouteMap, nothing is clickable), so
// they're kept local to the page rather than reusing that component.
// y stays clear of the top ~10% of the viewport so the topmost label
// never sits under the fixed navbar.
const WAYPOINTS = [
  { x: 70, y: 700, label: "You" },
  { x: 150, y: 540, label: "Lisbon" },
  { x: 260, y: 370, label: "Tbilisi" },
  { x: 330, y: 190, label: "Oaxaca" },
];

const PATH_D = WAYPOINTS.reduce((acc, p, i) => {
  if (i === 0) return `M ${p.x} ${p.y}`;
  const prev = WAYPOINTS[i - 1];
  const cx = (prev.x + p.x) / 2 + 30;
  const cy = prev.y - 60;
  return `${acc} Q ${cx} ${cy}, ${p.x} ${p.y}`;
}, "");

export default function HomePage() {
  return (
    <>
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Globe's replacement: the brand's winding-path motif, drawn
            across a warm photo-toned field instead of orbiting a 3D object. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #15110E 0%, #3B2A21 28%, #B96B3E 62%, #7A4226 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 90% 60% at 50% 35%, rgba(21,17,14,0) 0%, rgba(21,17,14,.55) 100%)" }}
        />
        <svg viewBox="0 0 400 800" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-80" aria-hidden="true">
          <path
            d={PATH_D}
            fill="none"
            stroke="#C0532E"
            strokeWidth="2.4"
            strokeDasharray="1 8"
            strokeLinecap="round"
          />
        </svg>
        {WAYPOINTS.slice(1).map((p) => (
          <div
            key={p.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 800) * 100}%` }}
          >
            <span className="block h-[10px] w-[10px] rounded-full border-2 border-terracotta bg-bone/90" />
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[150%] whitespace-nowrap rounded-[2px] bg-ink/70 px-[6px] py-[2px] font-mono text-[10px] tracking-wide text-bone">
              {p.label}
            </span>
          </div>
        ))}

        <div className="pointer-events-none relative z-10 w-full max-w-lg px-6 text-center">
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
