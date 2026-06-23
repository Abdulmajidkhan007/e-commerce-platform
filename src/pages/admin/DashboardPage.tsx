import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Seo } from "@/components/seo/Seo";
import { Spinner } from "@/components/feedback/Spinner";
import { StatCard } from "@/features/admin/components/StatCard";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { useDashboardStats } from "@/features/admin/hooks/useDashboardStats";
import { ORDER_STATUSES } from "@/constants";
import { PATHS } from "@/routes/paths";

const statusLabel: Record<string, string> = Object.fromEntries(
  ORDER_STATUSES.map((s) => [s.value, s.value])
);

export default function AdminDashboardPage() {
  const { stats, loading } = useDashboardStats();

  return (
    <>
      <Seo title="Admin — Boshqaruv paneli" noIndex />
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !stats ? null : (
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold text-ink dark:text-cream">Boshqaruv paneli</h1>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Jami daromad"
              value={`${stats.totalRevenue.toLocaleString()} so'm`}
              icon={<span className="text-lg">💰</span>}
            />
            <StatCard
              label="Jami buyurtmalar"
              value={stats.totalOrders}
              icon={<span className="text-lg">📦</span>}
            />
            <StatCard
              label="Kutilmoqda"
              value={stats.pendingOrders}
              icon={<span className="text-lg">⏳</span>}
            />
            <StatCard
              label="Faol mahsulotlar"
              value={stats.activeProducts}
              icon={<span className="text-lg">👕</span>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent orders */}
            <div className="rounded-card border border-cream-dark dark:border-ink-light/20 bg-white dark:bg-ink">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-cream-dark dark:border-ink-light/20">
                <h2 className="font-semibold text-ink dark:text-cream">So'nggi buyurtmalar</h2>
                <Link to={PATHS.ADMIN_ORDERS} className="text-xs text-brand-600 hover:underline">
                  Barchasi →
                </Link>
              </div>
              <div className="divide-y divide-cream-dark dark:divide-ink-light/20">
                {stats.recentOrders.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-ink-light">Buyurtmalar yo'q</p>
                ) : (
                  stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between px-5 py-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-ink dark:text-cream">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-ink-light mt-0.5">
                          {dayjs(order.createdAt.toDate()).format("DD.MM.YYYY")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} labelMap={statusLabel} />
                        <span className="font-semibold text-ink dark:text-cream">
                          {order.total.toLocaleString()} so'm
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Low stock */}
            <div className="rounded-card border border-cream-dark dark:border-ink-light/20 bg-white dark:bg-ink">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-cream-dark dark:border-ink-light/20">
                <h2 className="font-semibold text-ink dark:text-cream">Kam qolgan mahsulotlar</h2>
                <Link
                  to={PATHS.ADMIN_PRODUCTS}
                  className="text-xs text-brand-600 hover:underline"
                >
                  Barchasi →
                </Link>
              </div>
              <div className="divide-y divide-cream-dark dark:divide-ink-light/20">
                {stats.lowStockProducts.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-ink-light">
                    Kam qolgan mahsulot yo'q
                  </p>
                ) : (
                  stats.lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-12 object-cover rounded-btn bg-cream shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink dark:text-cream line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-ink-light">SKU: {product.sku}</p>
                      </div>
                      <span
                        className={`text-sm font-bold shrink-0 ${
                          product.stock === 0 ? "text-error" : "text-amber-500"
                        }`}
                      >
                        {product.stock} dona
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
