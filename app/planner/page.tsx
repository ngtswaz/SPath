import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PlannerDemo from "@/components/PlannerDemo";

export const metadata: Metadata = {
  title: "Planner",
  description: "Try the Sidepath planner on a real trip idea.",
};

export default function PlannerPage() {
  return (
    <PageShell
      eyebrow="Try it on a real trip"
      title="Tell it where. It tells you how."
      lede="This is a small demo of the reasoning underneath the real planner. Ask it for a trip, a budget, a vibe. It writes out loud instead of handing you a locked itinerary."
    >
      <PlannerDemo />
    </PageShell>
  );
}
