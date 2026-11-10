import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Button from "@/components/Button";
import PlanCards from "@/components/site/PlanCards";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Sidepath plans and prices, in USD.",
};

export default function PricingPage() {
  return (
    <PageShell
      title="Start free. Pay when it earns it."
      lede="Global pricing in USD. No ads on any plan, and we never take a cut for ranking one place above another."
    >
      <PlanCards />
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/signup">Create a free account</Button>
        <Button href="/join" variant="secondary">
          Join the waitlist
        </Button>
      </div>
    </PageShell>
  );
}
