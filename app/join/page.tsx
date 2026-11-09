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
      eyebrow="Get early access"
      title={
        <>
          Less &ldquo;I wish.&rdquo;{" "}
          <em className="text-terracotta italic">More &ldquo;I&rsquo;m going.&rdquo;</em>
        </>
      }
      lede="Leave your email and we'll let you in as seats open up. No spam, no newsletter you didn't ask for, just the one email that matters: it's your turn."
    >
      <WaitlistForm />

      <p className="mt-10 max-w-md text-sm text-ink/70">
        Global pricing in USD. Not a booking platform. No ads, no affiliate
        commissions, no sponsored content. Ever.
      </p>
    </PageShell>
  );
}
