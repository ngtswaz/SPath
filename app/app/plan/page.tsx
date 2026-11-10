import { DESTINATIONS } from "@/lib/app-data";
import PlanForm from "@/components/app/PlanForm";
import { PageHeader } from "@/components/ui";

export default function PlanPage({ searchParams }: { searchParams: { to?: string; days?: string } }) {
  const to = DESTINATIONS.some((d) => d.id === searchParams.to) ? searchParams.to : undefined;
  const days = Number(searchParams.days);
  return (
    <div>
      <PageHeader title="Plan a trip" sub="Tell us the trip. We build the days around how you travel and what you can spend." />
      <PlanForm initialTo={to} initialDays={Number.isInteger(days) && days > 0 && days <= 30 ? days : undefined} />
    </div>
  );
}
