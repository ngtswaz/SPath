"use client";

import { FormEvent, useState } from "react";
import { COUNTRY_CODES, countryName } from "@/lib/app-data";
import { KEYS, uid, useLocal } from "@/lib/store";
import Button from "@/components/Button";
import Icon from "@/components/ui/icons";
import { Field, Tag } from "@/components/ui";

// The three things a traveller tells us once and every trip then uses:
// passports, cards (the kind of card only, never its number) and points
// balances (typed in, never linked to a real account). Each editor is used
// both in onboarding and on its own screen.

export interface StoredCard {
  id: string;
  name: string;
  network: string;
}

export interface StoredPoints {
  id: string;
  program: string;
  balance: number;
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/60 hover:bg-ink/[0.06] hover:text-burgundy"
    >
      <Icon name="trash" size={18} />
    </button>
  );
}

const sortedCountries = () =>
  COUNTRY_CODES.map((code) => ({ code, name: countryName(code) })).sort((a, b) => a.name.localeCompare(b.name));

export function PassportEditor() {
  const [passports, setPassports, ready] = useLocal<string[]>(KEYS.passports, []);
  const [pick, setPick] = useState("");
  // Country names come from the browser's own locale data, which can differ
  // from the server's, so the list is only built once we're on the client.
  const countries = ready ? sortedCountries() : [];

  return (
    <div>
      {passports.length > 0 && (
        <ul className="mb-4 divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
          {passports.map((code, i) => (
            <li key={code} className="flex items-center gap-3 py-1.5 pl-4 pr-1.5">
              <span className="font-mono text-sm font-bold text-ink/70">{code}</span>
              <span className="flex-1 text-[15px] font-medium text-ink">{countryName(code)}</span>
              {i === 0 && passports.length > 1 && <Tag>Listed first</Tag>}
              <RemoveButton label={`Remove ${countryName(code)} passport`} onClick={() => setPassports((p) => p.filter((c) => c !== code))} />
            </li>
          ))}
        </ul>
      )}
      <form
        className="flex gap-2"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          if (!pick || passports.includes(pick)) return;
          setPassports((p) => [...p, pick]);
          setPick("");
        }}
      >
        <label htmlFor="passport-country" className="sr-only">
          Passport country
        </label>
        <select id="passport-country" value={pick} onChange={(e) => setPick(e.target.value)} className="field flex-1">
          <option value="">Choose a country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code} disabled={passports.includes(c.code)}>
              {c.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary" disabled={!pick}>
          Add
        </Button>
      </form>
    </div>
  );
}

const NETWORKS = ["Visa", "Mastercard", "American Express", "Other"];

export function CardEditor() {
  const [cards, setCards] = useLocal<StoredCard[]>(KEYS.cards, []);
  const [name, setName] = useState("");
  const [network, setNetwork] = useState(NETWORKS[0]);

  return (
    <div>
      {cards.length > 0 && (
        <ul className="mb-4 divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
          {cards.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-1.5 pl-4 pr-1.5">
              <Icon name="wallet" className="text-ink/60" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium text-ink">{c.name}</span>
                <span className="block text-[13px] text-ink/65">{c.network}</span>
              </span>
              <RemoveButton label={`Remove ${c.name}`} onClick={() => setCards((list) => list.filter((x) => x.id !== c.id))} />
            </li>
          ))}
        </ul>
      )}
      <form
        className="grid gap-3 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          if (!name.trim()) return;
          setCards((list) => [...list, { id: uid(), name: name.trim(), network }]);
          setName("");
        }}
      >
        <Field label="Card name" htmlFor="card-name" hint="The product name on the card. Never the number.">
          <input id="card-name" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="The name printed on the front" />
        </Field>
        <Field label="Network" htmlFor="card-network" className="sm:pb-[26px]">
          <select id="card-network" className="field" value={network} onChange={(e) => setNetwork(e.target.value)}>
            {NETWORKS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>
        <Button type="submit" variant="secondary" disabled={!name.trim()} className="sm:mb-[26px]">
          Add card
        </Button>
      </form>
    </div>
  );
}

export function PointsEditor() {
  const [points, setPoints] = useLocal<StoredPoints[]>(KEYS.points, []);
  const [program, setProgram] = useState("");
  const [balance, setBalance] = useState("");

  return (
    <div>
      {points.length > 0 && (
        <ul className="mb-4 divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
          {points.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-1.5 pl-4 pr-1.5">
              <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">{p.program}</span>
              <span className="font-mono text-[15px] font-bold text-ink">{p.balance.toLocaleString("en-US")}</span>
              <RemoveButton label={`Remove ${p.program}`} onClick={() => setPoints((list) => list.filter((x) => x.id !== p.id))} />
            </li>
          ))}
        </ul>
      )}
      <form
        className="grid gap-3 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          const n = Number(balance);
          if (!program.trim() || !Number.isFinite(n) || n < 0) return;
          setPoints((list) => [...list, { id: uid(), program: program.trim(), balance: Math.round(n) }]);
          setProgram("");
          setBalance("");
        }}
      >
        <Field label="Programme" htmlFor="points-program">
          <input id="points-program" className="field" value={program} onChange={(e) => setProgram(e.target.value)} placeholder="Airline, hotel or bank programme" />
        </Field>
        <Field label="Balance" htmlFor="points-balance">
          <input id="points-balance" className="field" type="number" min={0} inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" />
        </Field>
        <Button type="submit" variant="secondary" disabled={!program.trim() || balance === ""}>
          Add balance
        </Button>
      </form>
    </div>
  );
}
