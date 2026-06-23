import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/feedback/Spinner";
import { useAdminProducts } from "@/features/admin/hooks/useAdminProducts";
import { deleteProduct, toggleProductActive } from "@/features/admin/adminService";
import { PATHS } from "@/routes/paths";
import { cn } from "@/utils/cn";

export default function AdminProductsPage() {
  const { products, loading } = useAdminProducts();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" mahsulotini o'chirishni tasdiqlaysizmi?`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success("Mahsulot o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id);
    try {
      await toggleProductActive(id, !current);
    } catch {
      toast.error("Holatni o'zgartirishda xatolik");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <Seo title="Admin — Mahsulotlar" noIndex />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-ink dark:text-cream">Mahsulotlar</h1>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(PATHS.ADMIN_PRODUCT_NEW)}
          >
            + Yangi mahsulot
          </Button>
        </div>

        <input
          type="search"
          placeholder="Nom yoki SKU bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-ink-light py-16">Mahsulotlar topilmadi</p>
        ) : (
          <div className="rounded-card border border-cream-dark dark:border-ink-light/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-dark dark:border-ink-light/20 bg-cream/50 dark:bg-ink-light/5">
                    <th className="text-left px-4 py-3 text-ink-light font-medium">Mahsulot</th>
                    <th className="text-left px-4 py-3 text-ink-light font-medium hidden md:table-cell">SKU</th>
                    <th className="text-right px-4 py-3 text-ink-light font-medium hidden sm:table-cell">Narx</th>
                    <th className="text-right px-4 py-3 text-ink-light font-medium hidden sm:table-cell">Qoldiq</th>
                    <th className="text-center px-4 py-3 text-ink-light font-medium">Holat</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark dark:divide-ink-light/20">
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-cream/30 dark:hover:bg-ink-light/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-12 object-cover rounded-btn bg-cream shrink-0 hidden xs:block"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-ink dark:text-cream line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-ink-light">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-light hidden md:table-cell">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-ink dark:text-cream hidden sm:table-cell">
                        {product.price.toLocaleString()} so'm
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span
                          className={cn(
                            "font-medium",
                            product.stock === 0
                              ? "text-error"
                              : product.stock <= product.lowStockThreshold
                              ? "text-amber-500"
                              : "text-ink dark:text-cream"
                          )}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(product.id, product.isActive)}
                          disabled={togglingId === product.id}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
                            product.isActive
                              ? "bg-success/15 text-success hover:bg-success/25"
                              : "bg-ink-light/15 text-ink-light hover:bg-ink-light/25"
                          )}
                        >
                          {togglingId === product.id ? (
                            <Spinner size="sm" />
                          ) : product.isActive ? (
                            "Faol"
                          ) : (
                            "Nofaol"
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={PATHS.ADMIN_PRODUCT_EDIT(product.id)}
                            className="text-xs text-brand-600 hover:underline"
                          >
                            Tahrir
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deletingId === product.id}
                            className="text-xs text-error hover:underline disabled:opacity-50"
                          >
                            {deletingId === product.id ? "..." : "O'chirish"}
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
