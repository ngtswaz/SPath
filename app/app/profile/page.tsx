"use client";

import Link from "next/link";
import { FACETS, FAMILY_COLOR, PROFILE_STAMPS, TRIPS, DESTINATIONS, type FacetScores } from "@/lib/app-data";
import { DEFAULT_PROFILE, KEYS, useLocal, useStoredString, type Profile } from "@/lib/store";
import { NAV_GROUPS } from "@/components/app/nav";
import Button from "@/components/Button";
import Icon from "@/components/ui/icons";
import { Card, LinkRow, Section } from "@/components/ui";

export default function ProfilePage() {
  const [profile, , profileReady] = useLocal<Profile>(KEYS.profile, DEFAULT_PROFILE);
  const name = profileReady && profile.name ? profile.name : "Your profile";
  const [scores, , ready] = useLocal<FacetScores | null>(KEYS.scores, null);
  const label = useStoredString(KEYS.label);

  const ranked = scores ? [...FACETS].sort((a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0)) : [];
  // Everything not already in the phone's tab bar, so it is reachable from here.
  const more = NAV_GROUPS.flatMap((g) => g.items).filter(
    (i) => !["/app/explore", "/app/trips", "/app/plan", "/app/community", "/app/profile"].includes(i.href)
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="space-y-10">
        <header className="flex items-center gap-4">
          <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-accent-dark font-serif text-3xl font-semibold text-white">
            {profileReady && profile.name ? profile.name.charAt(0).toUpperCase() : ""}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-tightish text-ink md:text-4xl">{name}</h1>
            <p className="mt-0.5 text-[15px] text-ink/75">{label ?? "No travel pattern yet"}</p>
            {profile.home && <p className="text-sm text-ink/65">Based in {profile.home}</p>}
          </div>
          <Link
            href="/app/settings"
            aria-label="Settings"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink hover:border-ink/40"
          >
            <Icon name="settings" size={20} />
          </Link>
        </header>

        {ready && !scores ? (
          <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-lg font-semibold tracking-tightish text-ink">Find your travel pattern</p>
              <p className="mt-0.5 text-sm text-ink/75">Nine statements. It shapes every plan and match score.</p>
            </div>
            <Button href="/app/onboarding" className="shrink-0">
              Take the quiz
            </Button>
          </Card>
        ) : (
          scores && (
            <Section
              title="How you travel"
              action={
                <Link href="/app/onboarding" className="text-sm font-semibold text-accent-dark underline-offset-4 hover:underline">
                  Retake the quiz
                </Link>
              }
            >
              <Card className="p-5">
                <ul className="space-y-3">
                  {ranked.map((f) => (
                    <li key={f.key} className="grid grid-cols-[minmax(0,172px)_1fr_auto] items-center gap-3">
                      <span className="truncate text-sm font-medium text-ink">{f.label}</span>
                      <span className="h-2 overflow-hidden rounded-full bg-ink/10">
                        <span className="block h-full rounded-full" style={{ width: `${Math.max(scores[f.key] ?? 0, 2)}%`, background: FAMILY_COLOR[f.family] }} />
                      </span>
                      <span className="w-8 text-right font-mono text-xs font-bold text-ink">{scores[f.key] ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Section>
          )
        )}

        <Section title="Places you've been">
          <p className="-mt-1 mb-3 text-sm text-ink/70">{PROFILE_STAMPS.length} places, 0 regrets</p>
          <ul className="flex flex-wrap gap-2">
            {PROFILE_STAMPS.map((s) => (
              <li key={s.code} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white py-1.5 pl-2 pr-3.5 text-sm font-medium text-ink">
                <span className="rounded-full bg-ink/[0.07] px-2 py-0.5 font-mono text-xs font-bold text-ink/75">{s.code}</span>
                {s.name}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Your trips" action={<Link href="/app/trips" className="text-sm font-semibold text-accent-dark underline-offset-4 hover:underline">See all</Link>}>
          <Card className="px-4">
            {TRIPS.map((trip) => {
              const d = DESTINATIONS.find((x) => x.id === trip.destinationId);
              return d ? <LinkRow key={trip.id} href={`/app/trip/${trip.id}`} label={`${d.name}, ${d.country}`} detail={`${trip.dateRange}, $${trip.budget} all in`} /> : null;
            })}
          </Card>
        </Section>
      </div>

      <Section title="More">
        <Card className="px-4">
          {more.map((item) => (
            <LinkRow key={item.href} href={item.href} label={item.label} icon={<Icon name={item.icon} size={18} />} />
          ))}
        </Card>
      </Section>
    </div>
  );
}
