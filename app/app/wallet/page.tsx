import { CardEditor, PointsEditor } from "@/components/app/editors";
import { Notice, PageHeader, Section } from "@/components/ui";

export default function WalletPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Cards and points"
        sub="Tell us what you hold and we look for places it makes a trip cheaper or better."
      />

      <Notice title="We never ask for a card number">
        Only which card it is. Points and miles are typed in by you and never linked to a
        real account. Balances are used per trip, not stored against your profile.
      </Notice>

      <Section title="Your cards" className="mt-9">
        <CardEditor />
      </Section>

      <Section title="Points and miles" className="mt-10">
        <PointsEditor />
      </Section>

      <Notice className="mt-10" title="Card benefits aren't matched yet">
        Sidepath is building its own card benefits database. Until it&rsquo;s connected,
        perk offers on itineraries are samples, not matched to the cards above.
      </Notice>
    </div>
  );
}
