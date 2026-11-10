import { PassportEditor } from "@/components/app/editors";
import Button from "@/components/Button";
import { PageHeader } from "@/components/ui";

export default function PassportsPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Passports"
        sub="Add every passport you hold. For each trip we use the one that makes entry easiest, show you which, and let you change it."
      />
      <PassportEditor />
      <div className="mt-8">
        <Button href="/app/visa" variant="secondary">
          Open visa check
        </Button>
      </div>
    </div>
  );
}
