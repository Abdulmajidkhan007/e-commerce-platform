import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Seo } from "@/components/seo/Seo";
import { Spinner } from "@/components/feedback/Spinner";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { useAdminOrders } from "@/features/admin/hooks/useAdminOrders";
import { updateOrderStatus } from "@/features/admin/adminService";
import { ORDER_STATUSES } from "@/constants";
import type { OrderStatusValue } from "@/constants";
import { useAppSelector } from "@/store";
import { selectUser } from "@/features/auth/authSlice";

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  ORDER_STATUSES.map((s) => [s.value, s.value])
);

export default function AdminOrdersPage() {
  const { orders, loading } = useAdminOrders();
  const user = useAppSelector(selectUser);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered =
    statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  async function handleStatusChange(orderId: string, status: OrderStatusValue) {
    if (!user) return;
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status, user.uid);
      toast.success("Buyurtma holati yangilandi");
    } catch {
      toast.error("Holatni yangilashda xatolik");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <Seo title="Admin — Buyurtmalar" noIndex />
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-ink dark:text-cream">Buyurtmalar</h1>

        {/* Status filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-brand-500 text-white"
                : "border border-cream-dark dark:border-ink-light/30 text-ink-light hover:border-brand-300"
            }`}
          >
            Barchasi ({orders.length})
          </button>
          {ORDER_STATUSES.map((s) => {
            const count = orders.filter((o) => o.status === s.value).length;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatusFilter(s.value)}
                className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-colors ${
                  statusFilter === s.value
                    ? "bg-brand-500 text-white"
                    : "border border-cream-dark dark:border-ink-light/30 text-ink-light hover:border-brand-300"
                }`}
              >
                {s.value} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-ink-light py-16">Buyurtmalar topilmadi</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="rounded-card border border-cream-dark dark:border-ink-light/20 bg-white dark:bg-ink p-5"
              >
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <p className="font-semibold text-ink dark:text-cream">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-ink-light mt-0.5">
                      {dayjs(order.createdAt.toDate()).format("DD.MM.YYYY HH:mm")}
                    </p>
                  </div>
                  <StatusBadge status={order.status} labelMap={STATUS_LABEL} />
                </div>

                {/* Customer info */}
                <div className="text-sm text-ink-light mb-3 flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    👤 {order.customer.firstName} {order.customer.lastName}
                  </span>
                  <span>📞 {order.customer.phone}</span>
                  <span>📍 {order.customer.address}</span>
                </div>

                {/* Items preview */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 w-12 h-14 rounded-btn overflow-hidden bg-cream"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.qty > 1 && (
                        <span className="absolute bottom-0 right-0 bg-ink/70 text-white text-xs px-1 rounded-tl">
                          ×{item.qty}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="font-bold text-ink dark:text-cream">
                    {order.total.toLocaleString()} so'm
                  </span>

                  {/* Status changer */}
                  <div className="flex items-center gap-2">
                    {updatingId === order.id ? (
                      <Spinner size="sm" />
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatusValue)
                        }
                        className="rounded-btn border border-cream-dark dark:border-ink-light/30 bg-white dark:bg-ink px-2 py-1.5 text-xs text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-brand-400"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.value}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
