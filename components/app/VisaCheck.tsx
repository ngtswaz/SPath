"use client";

import { useEffect, useState } from "react";
import { DESTINATIONS, VISA_CONCIERGE, countryName } from "@/lib/app-data";
import { KEYS, useLocal } from "@/lib/store";
import Button from "@/components/Button";
import { Card, EmptyState, Field, Notice, Tag } from "@/components/ui";

// The four answers a visa check can give. Shown as a key so the screen
// explains itself before real rules are connected.
const OUTCOMES = [
  { name: "No visa needed", body: "Walk up with your passport, for a set number of days." },
  { name: "Visa on arrival", body: "Issued at the border. Usually a fee and a form." },
  { name: "eVisa or travel authorisation", body: "Applied for online before you fly." },
  { name: "Embassy visa", body: "An application in advance, sometimes with an appointment." },
];

export default function VisaCheck({ initialTo }: { initialTo?: string }) {
  const [passports, , ready] = useLocal<string[]>(KEYS.passports, []);
  const [passport, setPassport] = useState("");
  const [to, setTo] = useState(initialTo ?? DESTINATIONS[0].id);
  const destination = DESTINATIONS.find((d) => d.id === to) ?? DESTINATIONS[0];

  useEffect(() => {
    if (passports.length > 0 && !passports.includes(passport)) setPassport(passports[0]);
  }, [passports, passport]);

  if (ready && passports.length === 0) {
    return (
      <EmptyState
        title="Add a passport first"
        body="A visa check starts from the passport you travel on. Add one, or several, and come back."
        action={<Button href="/app/passports">Add a passport</Button>}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Travelling on" htmlFor="visa-passport">
            <select id="visa-passport" className="field" value={passport} onChange={(e) => setPassport(e.target.value)}>
              {passports.map((code) => (
                <option key={code} value={code}>
                  {countryName(code)} passport
                </option>
              ))}
            </select>
          </Field>
          <Field label="Going to" htmlFor="visa-to">
            <select id="visa-to" className="field" value={to} onChange={(e) => setTo(e.target.value)}>
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}, {d.country}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Card className="mt-6 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">
              {passport ? countryName(passport) : "Your passport"} to {destination.country}
            </h2>
            <Tag tone="warn">Not checked</Tag>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
            We can&rsquo;t tell you the entry rule for this pair yet. Sidepath&rsquo;s visa data
            source isn&rsquo;t connected, and we won&rsquo;t guess at something that can stop you
            at a border.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
            Until then, check {destination.country}&rsquo;s official immigration site or its
            embassy for your passport before you book.
          </p>
        </Card>

        {passports.length > 1 && (
          <Notice className="mt-4">
            You hold {passports.length} passports. Once rules are connected we&rsquo;ll compare
            them and pick the one that makes this trip easiest.
          </Notice>
        )}
      </div>

      <aside className="space-y-4">
        <Card className="p-5">
          <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">What a check will tell you</h2>
          <ul className="mt-3 divide-y divide-ink/10">
            {OUTCOMES.map((o) => (
              <li key={o.name} className="py-3">
                <p className="text-sm font-semibold text-ink">{o.name}</p>
                <p className="text-[13px] leading-snug text-ink/70">{o.body}</p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">{VISA_CONCIERGE.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            Planned: a person who handles the application with you, start to finish.
          </p>
          <p className="mt-3">
            <span className="font-mono text-lg font-bold text-ink">{VISA_CONCIERGE.price}</span>{" "}
            <span className="text-sm text-ink/65">{VISA_CONCIERGE.cadence}</span>
          </p>
        </Card>
      </aside>
    </div>
  );
}
