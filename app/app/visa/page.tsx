import { DESTINATIONS } from "@/lib/app-data";
import VisaCheck from "@/components/app/VisaCheck";
import { PageHeader } from "@/components/ui";

export default function VisaPage({ searchParams }: { searchParams: { to?: string } }) {
  const to = DESTINATIONS.some((d) => d.id === searchParams.to) ? searchParams.to : undefined;
  return (
    <div>
      <PageHeader title="Visa check" sub="Your passport, their rules, laid out before you book, not after you land." />
      <VisaCheck initialTo={to} />
    </div>
  );
}
