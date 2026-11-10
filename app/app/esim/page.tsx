"use client";

import { DESTINATIONS, TRIPS } from "@/lib/app-data";
import { KEYS, useLocal } from "@/lib/store";
import { Card, Notice, PageHeader, Section, Tag, Toggle } from "@/components/ui";

const STEPS = [
  { title: "Pick a data plan", body: "Sized to the length of your trip and the country you're going to." },
  { title: "Install it before you fly", body: "Scan a code at home, on Wi-Fi. No shop, no plastic SIM." },
  { title: "Land connected", body: "Switch it on when the plane doors open. Your own number keeps working." },
];

export default function EsimPage() {
  const [notify, setNotify] = useLocal<boolean>(KEYS.esimNotify, false);

  return (
    <div className="max-w-2xl">
      <PageHeader title="eSIM" sub="Mobile data for the country you're going to, sorted before you leave." />

      <Notice title="Not available yet">
        The eSIM partner is agreed but not connected, so there are no plans or prices to
        show. Nothing here can be bought today.
      </Notice>

      <Section title="For your trips" className="mt-9">
        <Card className="divide-y divide-ink/10 px-5">
          {TRIPS.map((trip) => {
            const d = DESTINATIONS.find((x) => x.id === trip.destinationId);
            if (!d) return null;
            return (
              <div key={trip.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-[15px] font-semibold text-ink">
                    {d.name}, {d.country}
                  </p>
                  <p className="font-mono text-xs text-ink/65">{trip.dateRange}</p>
                </div>
                <Tag>Plans coming</Tag>
              </div>
            );
          })}
        </Card>
      </Section>

      <Section title="How it will work" className="mt-10">
        <ol className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-3">
              <span className="font-mono text-sm font-bold text-terracotta-dark">{i + 1}</span>
              <h3 className="mt-1 text-[15px] font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Card className="mt-10 px-5">
        <Toggle
          id="esim-notify"
          label="Tell me when eSIMs are available"
          detail="Saved on this device for now. No message is sent in the preview."
          checked={notify}
          onChange={setNotify}
        />
      </Card>
    </div>
  );
}
