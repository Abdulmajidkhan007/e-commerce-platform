import { Seo } from "@/components/seo/Seo";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <>
      <Seo title="Login" noIndex />
      <Card>
        <h2 className="text-xl font-bold text-ink dark:text-cream mb-4">Login</h2>
        <p className="text-ink-light text-sm">Bu sahifa tez orada tayyorlanadi...</p>
      </Card>
    </>
  );
}
