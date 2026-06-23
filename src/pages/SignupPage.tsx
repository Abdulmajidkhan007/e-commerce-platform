import { Seo } from "@/components/seo/Seo";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  return (
    <>
      <Seo title="Signup" noIndex />
      <Card>
        <h2 className="text-xl font-bold text-ink dark:text-cream mb-4">Signup</h2>
        <p className="text-ink-light text-sm">Bu sahifa tez orada tayyorlanadi...</p>
      </Card>
    </>
  );
}
