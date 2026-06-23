import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectCartItems,
  selectCartSubtotal,
  removeItem,
  incrementQty,
  decrementQty,
  clearCart,
} from "@/features/cart/cartSlice";
import { calcShippingFee, FREE_SHIPPING_THRESHOLD } from "@/features/orders/orderService";
import { PATHS } from "@/routes/paths";
import { cn } from "@/utils/cn";

export default function CartPage() {
  const { t } = useTranslation("cart");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = calcShippingFee(subtotal);
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <>
        <Seo title={t("title")} noIndex />
        <Container className="py-20">
          <EmptyState
            title={t("empty")}
            description={t("emptyDesc")}
            icon={<span className="text-5xl">🛒</span>}
            action={
              <Link to={PATHS.SHOP}>
                <Button variant="primary">{t("continueShopping")}</Button>
              </Link>
            }
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <Seo title={t("title")} noIndex />
      <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ink dark:text-cream">
            {t("title")}{" "}
            <span className="text-base font-normal text-ink-light">
              ({t("item", { count: items.reduce((s, i) => s + i.qty, 0) })})
            </span>
          </h1>
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="text-sm text-error hover:underline"
          >
            {t("clear")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Items list */}
          <div className="flex flex-col divide-y divide-cream-dark dark:divide-ink-light/20 rounded-card border border-cream-dark dark:border-ink-light/20">
            {items.map((item) => {
              const key = `${item.productId}-${item.color}-${item.size}`;
              return (
                <div key={key} className="flex gap-4 p-4">
                  <Link
                    to={PATHS.PRODUCT(item.slug)}
                    className="shrink-0 w-20 h-24 rounded-btn overflow-hidden bg-cream"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <Link
                      to={PATHS.PRODUCT(item.slug)}
                      className="text-sm font-medium text-ink dark:text-cream hover:text-brand-600 line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-ink-light">
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-cream-dark"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span>{item.color}</span>
                      <span>·</span>
                      <span>{item.size}</span>
                    </div>
                    <span className="text-sm font-semibold text-ink dark:text-cream mt-auto">
                      {item.unitPrice.toLocaleString()} so'm
                    </span>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2">
                    {/* Qty controls */}
                    <div className="flex items-center border border-cream-dark dark:border-ink-light/30 rounded-btn overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            decrementQty({
                              productId: item.productId,
                              color: item.color,
                              size: item.size,
                            })
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-ink dark:text-cream hover:bg-brand-50 dark:hover:bg-brand-900/20 text-lg"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-ink dark:text-cream">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            incrementQty({
                              productId: item.productId,
                              color: item.color,
                              size: item.size,
                            })
                          )
                        }
                        disabled={item.qty >= item.stock}
                        className="w-8 h-8 flex items-center justify-center text-ink dark:text-cream hover:bg-brand-50 dark:hover:bg-brand-900/20 text-lg disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-sm font-bold text-ink dark:text-cream">
                      {(item.unitPrice * item.qty).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          removeItem({
                            productId: item.productId,
                            color: item.color,
                            size: item.size,
                          })
                        )
                      }
                      className="text-xs text-error hover:underline"
                    >
                      {t("removeItem")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4 sticky top-24">
            <h2 className="font-semibold text-ink dark:text-cream">{t("summary")}</h2>

            {remaining > 0 && (
              <p className="text-xs text-ink-light bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-btn">
                {t("freeShippingHint", {
                  threshold: remaining.toLocaleString(),
                })}
              </p>
            )}

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-ink-light">
                <span>{t("subtotal")}</span>
                <span>{subtotal.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-ink-light">
                <span>{t("shipping")}</span>
                <span className={cn(shipping === 0 && "text-success font-medium")}>
                  {shipping === 0
                    ? t("shippingFree")
                    : `${shipping.toLocaleString()} so'm`}
                </span>
              </div>
              <div className="border-t border-cream-dark dark:border-ink-light/20 pt-2 flex justify-between font-bold text-ink dark:text-cream text-base">
                <span>{t("total")}</span>
                <span>{total.toLocaleString()} so'm</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate(PATHS.CHECKOUT)}
            >
              {t("checkout")}
            </Button>

            <Link
              to={PATHS.SHOP}
              className="text-center text-sm text-brand-600 hover:underline"
            >
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
