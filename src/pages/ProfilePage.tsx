import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { Spinner } from "@/components/feedback/Spinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ProfileView } from "@/features/profile/components/ProfileView";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useAppSelector } from "@/store";
import { selectUser } from "@/features/auth/authSlice";
import { ORDER_STATUSES } from "@/constants";
import { PATHS } from "@/routes/paths";

function OrderStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const meta = ORDER_STATUSES.find((s) => s.value === status);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        color: meta?.color ?? "#6b7280",
        backgroundColor: meta?.bgColor ?? "#f3f4f6",
      }}
    >
      {t(`order.status.${status}`)}
    </span>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation(["profile", "cart", "common"]);
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const { profile, loading } = useProfile(user?.uid);
  const { orders, loading: ordersLoading } = useOrders(
    location.pathname === PATHS.PROFILE_ORDERS ? user?.uid : undefined
  );

  const isEditMode = location.pathname === PATHS.PROFILE_EDIT;
  const isOrdersMode = location.pathname === PATHS.PROFILE_ORDERS;

  const pageTitle = isEditMode
    ? t("profile:editTitle")
    : isOrdersMode
    ? t("cart:orders.title")
    : t("profile:title");

  if (loading) {
    return (
      <Container className="py-16 flex justify-center">
        <Spinner size="lg" />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="py-16">
        <EmptyState title="Profil topilmadi" />
      </Container>
    );
  }

  return (
    <>
      <Seo title={pageTitle} noIndex />
      <Container className="py-10">
        <h1 className="text-2xl font-bold text-ink dark:text-cream mb-8">{pageTitle}</h1>

        {isEditMode ? (
          <ProfileEditForm profile={profile} />
        ) : isOrdersMode ? (
          ordersLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              title={t("cart:orders.empty")}
              description={t("cart:orders.emptyDesc")}
              icon={<span className="text-4xl">📦</span>}
              action={
                <Link to={PATHS.SHOP}>
                  <button className="px-4 py-2 bg-brand-500 text-white rounded-btn text-sm font-medium hover:bg-brand-600 transition-colors">
                    {t("common:btn.viewAll")}
                  </button>
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5"
                >
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <p className="font-semibold text-ink dark:text-cream">
                        {t("cart:orders.orderNum", {
                          id: order.id.slice(0, 8).toUpperCase(),
                        })}
                      </p>
                      <p className="text-xs text-ink-light mt-0.5">
                        {dayjs(order.createdAt.toDate()).format("DD.MM.YYYY HH:mm")}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="relative shrink-0 w-14 h-16 rounded-btn overflow-hidden bg-cream"
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

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-light">
                      {t("cart:orders.items", { count: order.items.length })}
                    </span>
                    <span className="font-bold text-ink dark:text-cream">
                      {order.total.toLocaleString()} so'm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <ProfileView profile={profile} />
        )}
      </Container>
    </>
  );
}
