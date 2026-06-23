import { Seo } from "@/components/seo/Seo";

export default function AdminDashboardPage() {
  return (
    <>
      <Seo title="Admin — Dashboard" noIndex />
      <div>
        <h2 className="text-xl font-bold text-ink dark:text-cream mb-4">Dashboard</h2>
        <p className="text-ink-light text-sm">Bu sahifa tez orada tayyorlanadi...</p>
      </div>
    </>
  );
}
