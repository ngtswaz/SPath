import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Button from "@/components/Button";
import { Tag } from "@/components/ui";
import Icon, { type IconName } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Features",
  description: "What's in Sidepath, and why each piece exists.",
};

// "preview" means you can open it today on demo data; "planned" means the
// screen exists but the service behind it isn't connected yet.
const FEATURES: { icon: IconName; title: string; body: string; href: string; state: "preview" | "planned" }[] = [
  {
    icon: "explore",
    title: "A plan built around you",
    body: "Nine scores from a short quiz decide what goes in your itinerary. Every slot comes with alternatives.",
    href: "/app/plan",
    state: "preview",
  },
  {
    icon: "wallet",
    title: "Points that actually work",
    body: "Tell us your cards and balances and we show where they make this trip cheaper. Offers are opt in, never automatic.",
    href: "/app/wallet",
    state: "preview",
  },
  {
    icon: "visa",
    title: "Visas, untied",
    body: "Your passport, their rules, laid out before you book, not after you land.",
    href: "/app/visa",
    state: "planned",
  },
  {
    icon: "community",
    title: "People who've actually been there",
    body: "Notes from travellers who took the trip, and rooms for people who travel the way you do.",
    href: "/app/community",
    state: "preview",
  },
  {
    icon: "groups",
    title: "Group trips without the spreadsheet",
    body: "Add who is coming, log what each person paid, and see who owes whom.",
    href: "/app/groups",
    state: "preview",
  },
  {
    icon: "esim",
    title: "Data when you land",
    body: "An eSIM for the country you are going to, set up before you leave.",
    href: "/app/esim",
    state: "planned",
  },
];

export default function FeaturesPage() {
  return (
    <PageShell
      title="Everything that untangles the knot."
      lede="No feature here exists to look impressive in a pitch deck. Each one removes a specific reason someone didn't book."
    >
      <ul className="grid gap-x-10 md:grid-cols-2">
        {FEATURES.map((f) => (
          <li key={f.title} className="border-t border-ink/15 py-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta-dark">
                <Icon name={f.icon} size={22} />
              </span>
              <Tag tone={f.state === "preview" ? "good" : "neutral"}>
                {f.state === "preview" ? "In the preview" : "Coming"}
              </Tag>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tightish text-ink">{f.title}</h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/75">{f.body}</p>
            <Link href={f.href} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-terracotta-dark underline-offset-4 hover:underline">
              Open it
              <Icon name="arrow" size={16} />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl bg-cream p-7 md:p-10">
        <h2 className="font-serif text-2xl font-semibold tracking-tightish text-ink">Proof over promises</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/80">
          The Legacy Flight Foundation funds a first international flight for someone
          who&rsquo;s never held a passport. That&rsquo;s the standard we hold ourselves to.
        </p>
        <div className="mt-5">
          <Button href="/mission" variant="secondary">
            Read the mission
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
