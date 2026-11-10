import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Join",
  description: "Get early access to Sidepath.",
};

export default function JoinPage() {
  return (
    <PageShell
      title="Less “I wish.” More “I’m going.”"
      lede="Leave your email and we'll let you in as seats open up. No spam, no newsletter you didn't ask for, just the one email that matters: it's your turn."
    >
      <div className="max-w-lg">
        <WaitlistForm />
        <p className="mt-8 text-sm leading-relaxed text-ink/70">
          Global pricing in USD. Not a booking platform. No ads, no affiliate
          commissions, no sponsored content. Ever.
        </p>
      </div>
    </PageShell>
  );
}
