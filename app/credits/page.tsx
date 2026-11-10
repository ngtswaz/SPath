import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PHOTOS } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Who took the photos used on Sidepath.",
};

export default function CreditsPage() {
  return (
    <PageShell
      title="Photo credits"
      lede="Every photo on Sidepath right now is free stock from Unsplash. These are the people who took them."
    >
      <ul className="max-w-2xl">
        {Object.values(PHOTOS).map((p) => (
          <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-ink/15 py-4">
            <span className="text-[15px] text-ink">{p.alt}</span>
            <a href={p.page} target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent-dark underline-offset-4 hover:underline">
              {p.by} on Unsplash
            </a>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
