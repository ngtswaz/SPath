import { DESTINATIONS } from "@/lib/app-data";
import DestinationCard from "@/components/app/DestinationCard";

export default function Destinations() {
  return (
    <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      {DESTINATIONS.map((d) => (
        <DestinationCard key={d.id} destination={d} />
      ))}
    </div>
  );
}
