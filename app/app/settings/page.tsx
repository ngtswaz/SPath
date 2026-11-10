"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_PROFILE, KEYS, useLocal, type Profile } from "@/lib/store";
import Button from "@/components/Button";
import { Card, Field, LinkRow, PageHeader, Section, Toggle } from "@/components/ui";

interface Settings {
  tripReminders: boolean;
  priceChanges: boolean;
  communityReplies: boolean;
}

const DEFAULT_SETTINGS: Settings = { tripReminders: true, priceChanges: true, communityReplies: false };

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useLocal<Profile>(KEYS.profile, DEFAULT_PROFILE);
  const [settings, setSettings] = useLocal<Settings>(KEYS.settings, DEFAULT_SETTINGS);
  const [confirming, setConfirming] = useState(false);

  function clearEverything() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sidepath_"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // Nothing stored, nothing to clear.
    }
    router.push("/");
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" />

      <Section title="You">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="set-name">
            <input id="set-name" className="field" autoComplete="given-name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          </Field>
          <Field label="Home city" htmlFor="set-home">
            <input id="set-home" className="field" autoComplete="address-level2" value={profile.home} onChange={(e) => setProfile((p) => ({ ...p, home: e.target.value }))} placeholder="City you usually fly from" />
          </Field>
          <Field label="Email" htmlFor="set-email" className="sm:col-span-2">
            <input id="set-email" type="email" className="field" autoComplete="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} placeholder="you@wherever-you-are.com" />
          </Field>
        </div>
        <p className="mt-2 text-[13px] text-ink/65">Changes save as you type, on this device.</p>
      </Section>

      <Section title="Notifications" className="mt-10">
        <Card className="px-5">
          <Toggle id="n-trips" label="Trip reminders" detail="Check in opens, a day is about to start." checked={settings.tripReminders} onChange={(v) => setSettings((s) => ({ ...s, tripReminders: v }))} />
          <Toggle id="n-prices" label="Price changes" detail="A saved trip gets cheaper or dearer." checked={settings.priceChanges} onChange={(v) => setSettings((s) => ({ ...s, priceChanges: v }))} />
          <Toggle id="n-community" label="Community replies" detail="Someone answers you in a room." checked={settings.communityReplies} onChange={(v) => setSettings((s) => ({ ...s, communityReplies: v }))} />
        </Card>
        <p className="mt-2 text-[13px] text-ink/65">Your choices are saved. Nothing is sent yet in the preview.</p>
      </Section>

      <Section title="Travel profile" className="mt-10">
        <Card className="px-4">
          <LinkRow href="/app/onboarding" label="Retake the quiz" detail="Your pattern changes as you do" />
          <LinkRow href="/app/passports" label="Passports" />
          <LinkRow href="/app/wallet" label="Cards and points" />
          <LinkRow href="/app/plans" label="Plan" detail="Base, free" />
        </Card>
      </Section>

      <Section title="This device" className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setProfile((p) => ({ ...p, email: "" }));
              router.push("/");
            }}
          >
            Sign out
          </Button>
          {confirming ? (
            <>
              <Button onClick={clearEverything} className="bg-burgundy hover:bg-burgundy">
                Yes, clear everything
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                Keep it
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setConfirming(true)} className="text-burgundy">
              Clear my data on this device
            </Button>
          )}
        </div>
        {confirming && (
          <p role="alert" className="mt-3 text-sm text-ink/80">
            This removes your quiz result, saved places, passports, cards, points, group and
            messages from this browser. It can&rsquo;t be undone.
          </p>
        )}
      </Section>
    </div>
  );
}
