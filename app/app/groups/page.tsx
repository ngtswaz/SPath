"use client";

import { FormEvent, useState } from "react";
import { DESTINATIONS, TRIPS } from "@/lib/app-data";
import { KEYS, uid, useLocal } from "@/lib/store";
import Button from "@/components/Button";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/icons";
import { Card, EmptyState, Field, Notice, PageHeader, Section } from "@/components/ui";

interface Expense {
  id: string;
  what: string;
  amount: number;
  paidBy: string;
}

interface Group {
  members: string[];
  expenses: Expense[];
}

const EMPTY: Group = { members: ["You"], expenses: [] };

const money = (n: number) => `$${n.toFixed(2)}`;

/**
 * Even split. Each person's balance is what they paid minus their share;
 * then the people who are owed are paid off, largest first, by the people
 * who owe, largest first, which settles everything in the fewest transfers
 * a simple greedy pass can find.
 */
function settle(group: Group) {
  const total = group.expenses.reduce((s, e) => s + e.amount, 0);
  const share = group.members.length ? total / group.members.length : 0;
  const balances = group.members.map((name) => ({
    name,
    balance: group.expenses.filter((e) => e.paidBy === name).reduce((s, e) => s + e.amount, 0) - share,
  }));

  const owed = balances.filter((b) => b.balance > 0.005).map((b) => ({ ...b })).sort((a, b) => b.balance - a.balance);
  const owes = balances.filter((b) => b.balance < -0.005).map((b) => ({ ...b, balance: -b.balance })).sort((a, b) => b.balance - a.balance);
  const transfers: { from: string; to: string; amount: number }[] = [];
  let i = 0;
  let j = 0;
  while (i < owes.length && j < owed.length) {
    const amount = Math.min(owes[i].balance, owed[j].balance);
    transfers.push({ from: owes[i].name, to: owed[j].name, amount });
    owes[i].balance -= amount;
    owed[j].balance -= amount;
    if (owes[i].balance < 0.005) i++;
    if (owed[j].balance < 0.005) j++;
  }
  return { total, share, balances, transfers };
}

export default function GroupsPage() {
  const [group, setGroup] = useLocal<Group>(KEYS.group, EMPTY);
  const [member, setMember] = useState("");
  const [what, setWhat] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("You");

  const trip = TRIPS[0];
  const destination = DESTINATIONS.find((d) => d.id === trip.destinationId);
  const { total, share, balances, transfers } = settle(group);

  function addMember(e: FormEvent) {
    e.preventDefault();
    const name = member.trim();
    if (!name || group.members.some((m) => m.toLowerCase() === name.toLowerCase())) return;
    setGroup((g) => ({ ...g, members: [...g.members, name] }));
    setMember("");
  }

  function removeMember(name: string) {
    setGroup((g) => ({ members: g.members.filter((m) => m !== name), expenses: g.expenses.filter((e) => e.paidBy !== name) }));
    if (paidBy === name) setPaidBy("You");
  }

  function addExpense(e: FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!what.trim() || !Number.isFinite(n) || n <= 0) return;
    setGroup((g) => ({ ...g, expenses: [...g.expenses, { id: uid(), what: what.trim(), amount: Math.round(n * 100) / 100, paidBy }] }));
    setWhat("");
    setAmount("");
  }

  return (
    <div>
      <PageHeader title="Group trips" sub="Add who is coming, log what each person paid, and see who owes whom." />

      {destination && (
        <div className="mb-8 flex items-center gap-4 rounded-3xl border border-ink/10 bg-white p-3">
          <Photo name={destination.photo} width={200} className="h-16 w-20 shrink-0 rounded-2xl" />
          <div className="min-w-0">
            <p className="text-[13px] text-ink/65">Splitting costs for</p>
            <p className="truncate font-serif text-xl font-semibold tracking-tightish text-ink">
              {destination.name}
              <span className="ml-2 font-mono text-xs font-bold text-ink/65">{trip.dateRange}</span>
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-10">
          <Section title="Who is coming">
            <ul className="mb-3 flex flex-wrap gap-2">
              {group.members.map((m) => (
                <li key={m} className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white py-1 pl-3.5 pr-1 text-sm font-medium text-ink">
                  {m}
                  {m === "You" ? (
                    <span className="w-2.5" />
                  ) : (
                    <button
                      type="button"
                      aria-label={`Remove ${m}`}
                      onClick={() => removeMember(m)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink/55 hover:bg-ink/[0.07] hover:text-burgundy"
                    >
                      <Icon name="close" size={15} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <form onSubmit={addMember} className="flex gap-2">
              <label htmlFor="member-name" className="sr-only">
                Traveller&rsquo;s name
              </label>
              <input id="member-name" className="field flex-1" value={member} onChange={(e) => setMember(e.target.value)} placeholder="Add a traveller by name" />
              <Button type="submit" variant="secondary" disabled={!member.trim()}>
                Add
              </Button>
            </form>
          </Section>

          <Section title="Expenses">
            <form onSubmit={addExpense} className="grid gap-3 sm:grid-cols-[1.5fr_0.8fr_1fr_auto] sm:items-end">
              <Field label="What was it" htmlFor="exp-what">
                <input id="exp-what" className="field" value={what} onChange={(e) => setWhat(e.target.value)} placeholder="Dinner, taxi, tickets" />
              </Field>
              <Field label="Amount" htmlFor="exp-amount">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[15px] text-ink/60">$</span>
                  <input id="exp-amount" type="number" min={0} step="0.01" inputMode="decimal" className="field pl-8 font-mono" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                </div>
              </Field>
              <Field label="Paid by" htmlFor="exp-paid">
                <select id="exp-paid" className="field" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                  {group.members.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Button type="submit" disabled={!what.trim() || !amount}>
                Add
              </Button>
            </form>

            <div className="mt-5">
              {group.expenses.length === 0 ? (
                <EmptyState title="No expenses yet" body="Add the first thing someone paid for and the split appears on the right." />
              ) : (
                <ul className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
                  {group.expenses.map((e) => (
                    <li key={e.id} className="flex items-center gap-3 py-2 pl-4 pr-1.5">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium text-ink">{e.what}</span>
                        <span className="block text-[13px] text-ink/65">Paid by {e.paidBy}</span>
                      </span>
                      <span className="font-mono text-[15px] font-bold text-ink">{money(e.amount)}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${e.what}`}
                        onClick={() => setGroup((g) => ({ ...g, expenses: g.expenses.filter((x) => x.id !== e.id) }))}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/60 hover:bg-ink/[0.06] hover:text-burgundy"
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8">
          <Card className="p-5">
            <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">The split</h2>
            <dl className="mt-3 divide-y divide-ink/10 text-sm">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink/70">Spent so far</dt>
                <dd className="font-mono font-bold text-ink">{money(total)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink/70">Each person&rsquo;s share</dt>
                <dd className="font-mono font-bold text-ink">{money(share)}</dd>
              </div>
              {balances.map((b) => (
                <div key={b.name} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ink/70">{b.name}</dt>
                  <dd className={`font-mono font-bold ${b.balance > 0.005 ? "text-trail" : b.balance < -0.005 ? "text-burgundy" : "text-ink"}`}>
                    {b.balance > 0.005 ? `is owed ${money(b.balance)}` : b.balance < -0.005 ? `owes ${money(-b.balance)}` : "settled"}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">To settle up</h2>
            {transfers.length === 0 ? (
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                {group.expenses.length === 0 ? "Nothing to settle yet." : "Everyone is square."}
              </p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {transfers.map((t) => (
                  <li key={`${t.from}-${t.to}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink">
                      <span className="font-semibold">{t.from}</span> pays <span className="font-semibold">{t.to}</span>
                    </span>
                    <span className="font-mono font-bold text-ink">{money(t.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Notice>
            Split evenly, in US dollars, and kept on this device. Inviting people and other
            currencies come after the first release.
          </Notice>
        </aside>
      </div>
    </div>
  );
}
