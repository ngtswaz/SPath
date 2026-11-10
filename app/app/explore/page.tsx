"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DESTINATIONS, FACETS, matchPercent, type Destination, type FacetFamily, type FacetScores } from "@/lib/app-data";
import { DEFAULT_PROFILE, KEYS, useLocal, type Profile } from "@/lib/store";
import DestinationCard from "@/components/app/DestinationCard";
import Button from "@/components/Button";
import Icon from "@/components/ui/icons";
import { Card, EmptyState } from "@/components/ui";

const FAMILIES: FacetFamily[] = ["Cultural", "Adventure", "Restorative"];

/** The family a place scores highest in on average. */
function leadFamily(d: Destination): FacetFamily {
  const avg = (family: FacetFamily) => {
    const keys = FACETS.filter((f) => f.family === family).map((f) => f.key);
    return keys.reduce((sum, k) => sum + (d.facetScores[k] ?? 0), 0) / keys.length;
  };
  return [...FAMILIES].sort((a, b) => avg(b) - avg(a))[0];
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<FacetFamily | "All">("All");
  const [saved, setSaved] = useLocal<string[]>(KEYS.saved, []);
  const [scores, , ready] = useLocal<FacetScores | null>(KEYS.scores, null);
  const [profile, , profileReady] = useLocal<Profile>(KEYS.profile, DEFAULT_PROFILE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DESTINATIONS.filter((d) => !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q))
      .filter((d) => family === "All" || leadFamily(d) === family)
      .map((d) => ({ d, match: matchPercent(scores, d.facetScores) }))
      .sort((a, b) => (b.match ?? 0) - (a.match ?? 0));
  }, [query, family, scores]);

  const toggle = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink/65">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="mt-1 font-serif text-[32px] font-semibold leading-tight tracking-tightish text-ink md:text-5xl">
            {/* Neutral until the stored name has been read, so nobody is greeted by the wrong one. */}
            {profileReady && profile.name ? `Where to, ${profile.name}?` : "Where to next?"}
          </h1>
        </div>
        <Link
          href="/app/saved"
          aria-label={`Saved places, ${saved.length}`}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink hover:border-ink/40"
        >
          <Icon name="saved" size={20} />
          {saved.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-dark px-1 text-[11px] font-bold text-white">
              {saved.length}
            </span>
          )}
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Icon name="search" size={19} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/55" />
          <label htmlFor="explore-search" className="sr-only">
            Search a destination
          </label>
          <input
            id="explore-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="A city or a country"
            className="field pl-11"
          />
        </div>
        <div role="group" aria-label="Filter by travel style" className="-mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          {(["All", ...FAMILIES] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={family === f}
              onClick={() => setFamily(f)}
              className={`min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                family === f ? "border-ink bg-ink text-bone" : "border-ink/20 bg-white text-ink hover:border-ink/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {ready && !scores && (
        <Card className="mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg font-semibold tracking-tightish text-ink">See how well each place fits you</p>
            <p className="mt-0.5 text-sm text-ink/75">Nine quick statements. Then every trip here gets a match score.</p>
          </div>
          <Button href="/app/onboarding" className="shrink-0">
            Take the quiz
          </Button>
        </Card>
      )}

      <div className="mt-8">
        {results.length === 0 ? (
          <EmptyState
            title="Nothing matches that yet"
            body="More destinations are on the way. Try a different search or clear the filter."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setFamily("All");
                }}
              >
                Clear search
              </Button>
            }
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-ink/65">
              {results.length} {results.length === 1 ? "trip" : "trips"} open
              {scores ? ", best match first" : ""}
            </p>
            <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ d, match }) => (
                <DestinationCard key={d.id} destination={d} match={match} saved={saved.includes(d.id)} onToggleSave={() => toggle(d.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
