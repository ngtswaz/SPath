import PlanCards from "@/components/site/PlanCards";
import { PageHeader } from "@/components/ui";

export default function PlansPage() {
  return (
    <div>
      <PageHeader title="Plans" sub="You're on Base. Upgrades open when billing is connected." />
      <PlanCards current="base" />
    </div>
  );
}
