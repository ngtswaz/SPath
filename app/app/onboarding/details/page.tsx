"use client";

import { DEFAULT_PROFILE, KEYS, useLocal, type Profile } from "@/lib/store";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { CardEditor, PassportEditor } from "@/components/app/editors";
import { Field, Section } from "@/components/ui";

/**
 * Second half of onboarding: the three facts the planner needs before it
 * can price or check anything. All optional, all editable later.
 */
export default function OnboardingDetailsPage() {
  const [profile, setProfile] = useLocal<Profile>(KEYS.profile, DEFAULT_PROFILE);

  return (
    <div className="py-2">
      <Logo />
      <h1 className="mt-8 font-serif text-[32px] font-semibold leading-tight tracking-tightish text-ink md:text-5xl">
        Three things that make plans better
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
        Skip any of them. You can add or change all of this later from your profile.
      </p>

      <div className="mt-10 space-y-10">
        <Section title="Where you start from">
          <Field label="Home city" htmlFor="home-city" hint="Flights and travel time are worked out from here.">
            <input
              id="home-city"
              className="field"
              autoComplete="address-level2"
              value={profile.home}
              onChange={(e) => setProfile((p) => ({ ...p, home: e.target.value }))}
              placeholder="City you usually fly from"
            />
          </Field>
        </Section>

        <Section title="Your passports">
          <p className="mb-3 text-sm leading-relaxed text-ink/75">
            Add every passport you hold. For each trip we use the one that makes entry easiest.
          </p>
          <PassportEditor />
        </Section>

        <Section title="Your cards">
          <p className="mb-3 text-sm leading-relaxed text-ink/75">
            Just which cards you have, so we can spot benefits that apply to a trip.
          </p>
          <CardEditor />
        </Section>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Button href="/app/explore">Finish and explore</Button>
        <Button href="/app/plan" variant="secondary">
          Plan a trip now
        </Button>
      </div>
    </div>
  );
}
