import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/feedback/Spinner";
import { useAdminBlog } from "@/features/admin/hooks/useAdminBlog";
import { deleteBlogPost } from "@/features/admin/adminService";
import { PATHS } from "@/routes/paths";

export default function AdminBlogAdminPage() {
  const { posts, loading } = useAdminBlog();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : posts;

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" maqolasini o'chirishni tasdiqlaysizmi?`)) return;
    setDeletingId(id);
    try {
      await deleteBlogPost(id);
      toast.success("Maqola o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Seo title="Admin — Blog" noIndex />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-ink dark:text-cream">Blog maqolalari</h1>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(PATHS.ADMIN_BLOG_NEW)}
          >
            + Yangi maqola
          </Button>
        </div>

        <input
          type="search"
          placeholder="Sarlavha bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-ink-light py-16">Maqolalar topilmadi</p>
        ) : (
          <div className="rounded-card border border-cream-dark dark:border-ink-light/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-dark dark:border-ink-light/20 bg-cream/50 dark:bg-ink-light/5">
                    <th className="text-left px-4 py-3 text-ink-light font-medium">Sarlavha</th>
                    <th className="text-left px-4 py-3 text-ink-light font-medium hidden md:table-cell">
                      Muallif
                    </th>
                    <th className="text-left px-4 py-3 text-ink-light font-medium hidden sm:table-cell">
                      Sana
                    </th>
                    <th className="text-center px-4 py-3 text-ink-light font-medium">Holat</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark dark:divide-ink-light/20">
                  {filtered.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-cream/30 dark:hover:bg-ink-light/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {post.coverImage && (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-14 h-10 object-cover rounded-btn bg-cream shrink-0 hidden sm:block"
                            />
                          )}
                          <p className="font-medium text-ink dark:text-cream line-clamp-2">
                            {post.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-light hidden md:table-cell">
                        {post.authorName}
                      </td>
                      <td className="px-4 py-3 text-ink-light hidden sm:table-cell">
                        {dayjs(post.createdAt.toDate()).format("DD.MM.YYYY")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.isPublished
                              ? "bg-success/15 text-success"
                              : "bg-ink-light/15 text-ink-light"
                          }`}
                        >
                          {post.isPublished ? "Chop etilgan" : "Qoralama"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(PATHS.ADMIN_BLOG_EDIT(post.id))}
                            className="text-xs text-brand-600 hover:underline"
                          >
                            Tahrir
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deletingId === post.id}
                            className="text-xs text-error hover:underline disabled:opacity-50"
                          >
                            {deletingId === post.id ? "..." : "O'chirish"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
