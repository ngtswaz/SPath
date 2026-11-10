"use client";

import { DESTINATIONS, matchPercent, type FacetScores } from "@/lib/app-data";
import { KEYS, useLocal } from "@/lib/store";
import DestinationCard from "@/components/app/DestinationCard";
import Button from "@/components/Button";
import { EmptyState, PageHeader } from "@/components/ui";

export default function SavedPage() {
  const [saved, setSaved, ready] = useLocal<string[]>(KEYS.saved, []);
  const [scores] = useLocal<FacetScores | null>(KEYS.scores, null);
  const places = DESTINATIONS.filter((d) => saved.includes(d.id));

  return (
    <div>
      <PageHeader title="Saved" sub="Places you've kept for later." />
      {ready && places.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          body="Tap the heart on any trip in Explore and it lands here."
          action={<Button href="/app/explore">Go to Explore</Button>}
        />
      ) : (
        <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((d) => (
            <DestinationCard
              key={d.id}
              destination={d}
              match={matchPercent(scores, d.facetScores)}
              saved
              onToggleSave={() => setSaved((s) => s.filter((x) => x !== d.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
