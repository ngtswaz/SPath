import { DESTINATIONS, TRIPS } from "@/lib/app-data";
import { ListRow, RowBoard } from "@/components/app/DestinationRow";

export default function TripsPage() {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-7">
      <h1 className="font-serif text-2xl font-semibold tracking-tightish">Your trips</h1>
      <p className="mt-1 text-[13px] text-ink/70">Upcoming and past, in one trail.</p>

      <div className="mt-6">
        <RowBoard>
          {TRIPS.map((trip) => {
            const d = DESTINATIONS.find((x) => x.id === trip.destinationId);
            if (!d) return null;
            return (
              <ListRow
                key={trip.id}
                href={`/app/trip/${trip.id}`}
                title={d.name}
                subtitle={d.country}
                tagLabel="Upcoming"
                primary={trip.dateRange}
                secondary={`$${trip.budget} all in`}
              />
            );
          })}
        </RowBoard>

        <p className="mt-5 text-center text-[13px] text-ink/60">
          Planning a new trip isn&rsquo;t built yet, the trip form and planner are next on
          the build order.
        </p>
      </div>
    </div>
  );
}
