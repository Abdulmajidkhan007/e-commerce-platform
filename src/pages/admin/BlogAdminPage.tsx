import { Seo } from "@/components/seo/Seo";

export default function AdminBlogAdminPage() {
  return (
    <>
      <Seo title="Admin — BlogAdmin" noIndex />
      <div>
        <h2 className="text-xl font-bold text-ink dark:text-cream mb-4">BlogAdmin</h2>
        <p className="text-ink-light text-sm">Bu sahifa tez orada tayyorlanadi...</p>
      </div>
    </>
  );
}
