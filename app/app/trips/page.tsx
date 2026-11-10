import Link from "next/link";
import { DESTINATIONS, TRIPS } from "@/lib/app-data";
import Button from "@/components/Button";
import Photo from "@/components/ui/Photo";
import { Notice, PageHeader, Tag } from "@/components/ui";

export default function TripsPage() {
  return (
    <div>
      <PageHeader title="Your trips" sub="Upcoming and past, in one place." action={<Button href="/app/plan">Plan a trip</Button>} />

      <ul className="space-y-4">
        {TRIPS.map((trip) => {
          const d = DESTINATIONS.find((x) => x.id === trip.destinationId);
          if (!d) return null;
          return (
            <li key={trip.id}>
              <Link href={`/app/trip/${trip.id}`} className="group flex overflow-hidden rounded-2xl border border-ink/10 bg-white hover:border-ink/30">
                <Photo name={d.photo} width={420} className="w-[38%] max-w-[280px] shrink-0 self-stretch" />
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-4 sm:p-6">
                  <div>
                    <Tag tone="good">Upcoming</Tag>
                    <h2 className="mt-2.5 font-serif text-2xl font-semibold tracking-tightish text-ink group-hover:underline sm:text-3xl">{d.name}</h2>
                    <p className="text-sm text-ink/70">{d.country}</p>
                  </div>
                  <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div>
                      <dt className="text-ink/65">Dates</dt>
                      <dd className="font-mono font-bold text-ink">{trip.dateRange}</dd>
                    </div>
                    <div>
                      <dt className="text-ink/65">Budget</dt>
                      <dd className="font-mono font-bold text-ink">${trip.budget} all in</dd>
                    </div>
                  </dl>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <Notice className="mt-6" title="New trips don't save here yet">
        The trip form works, but the planner behind it isn&rsquo;t connected, so this list
        only holds the sample Lisbon trip for now.
      </Notice>
    </div>
  );
}
