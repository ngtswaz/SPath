import { PLANS, VISA_CONCIERGE } from "@/lib/app-data";
import { Card, Notice, Tag } from "@/components/ui";

/** Plans and prices, shared by the public pricing page and the in-app plans screen. */
export default function PlanCards({ current }: { current?: string }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card key={p.id} className={`p-6 ${current === p.id ? "ring-2 ring-trail" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">{p.name}</h2>
              {current === p.id && <Tag tone="good">Your plan</Tag>}
            </div>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-ink">{p.price}</span>
              <span className="text-sm text-ink/65">{p.cadence}</span>
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{p.line}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4 flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold tracking-tightish text-ink">{VISA_CONCIERGE.name}</h2>
          <p className="mt-1 max-w-lg text-[15px] leading-relaxed text-ink/75">
            A person handles the application with you. Paid once per application, on any plan.
          </p>
        </div>
        <p className="shrink-0 sm:text-right">
          <span className="block font-mono text-xl font-bold text-ink">{VISA_CONCIERGE.price}</span>
          <span className="block text-sm text-ink/65">{VISA_CONCIERGE.cadence}</span>
        </p>
      </Card>

      <Notice className="mt-6" title="What each plan includes is still being set">
        Prices are in USD and are the current plan. The exact line between Base, Plus and Pro
        isn&rsquo;t final yet, so we&rsquo;re not listing features we might move.
      </Notice>
    </div>
  );
}
