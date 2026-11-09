import dynamic from "next/dynamic";
import Link from "next/link";
import { SPOKES } from "@/lib/constants";

const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse rounded-full bg-ink/10"
    />
  ),
});

function orbitPosition(angleDeg: number) {
  // 0deg = top, clockwise. Radius as a percentage of the orbit box.
  const rad = (angleDeg * Math.PI) / 180;
  const radius = 46;
  const x = 50 + radius * Math.sin(rad);
  const y = 50 - radius * Math.cos(rad);
  return { left: `${x}%`, top: `${y}%` };
}

export default function HomePage() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-night">
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="font-serif text-5xl italic text-bone md:text-7xl">
          Why not?
        </p>
      </div>

      <div className="relative aspect-square w-[88vw] max-w-[640px]">
        <Globe />

        <nav aria-label="Primary" className="absolute inset-0">
          {SPOKES.map((s) => {
            const pos = orbitPosition(s.angle);
            return (
              <Link
                key={s.key}
                href={s.href}
                style={pos}
                className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone/20 bg-night/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-bone/80 backdrop-blur-sm transition-colors hover:border-amber/60 hover:text-amber"
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <p className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-wide text-bone/40">
        Pick a direction
      </p>
    </main>
  );
}
