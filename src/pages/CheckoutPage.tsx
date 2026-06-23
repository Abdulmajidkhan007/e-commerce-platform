import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/feedback/Spinner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from "@/features/cart/cartSlice";
import { selectUser } from "@/features/auth/authSlice";
import { useProfile } from "@/features/profile/hooks/useProfile";
import {
  createOrder,
  calcShippingFee,
} from "@/features/orders/orderService";
import { checkoutFormSchema, type CheckoutFormValues } from "@/services/schemas";
import { PATHS } from "@/routes/paths";
import { PAYMENT_METHODS } from "@/constants";
import { cn } from "@/utils/cn";

export default function CheckoutPage() {
  const { t } = useTranslation(["cart", "common"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = calcShippingFee(subtotal);
  const total = subtotal + shipping;

  const { profile, loading: profileLoading } = useProfile(user?.uid);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      notes: "",
      paymentMethod: "cash",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? "",
        address: profile.address
          ? [profile.address.line1, profile.address.city, profile.address.region]
              .filter(Boolean)
              .join(", ")
          : "",
        notes: "",
        paymentMethod: "cash",
      });
    }
  }, [profile, reset]);

  const paymentMethod = watch("paymentMethod");
  const depositAmount =
    paymentMethod === "partial_online" ? Math.ceil(total * 0.5) : 0;
  const dueOnDelivery = total - depositAmount;

  if (items.length === 0) {
    navigate(PATHS.CART, { replace: true });
    return null;
  }

  async function onSubmit(values: CheckoutFormValues) {
    if (!user) {
      navigate(PATHS.LOGIN + `?redirect=${PATHS.CHECKOUT}`);
      return;
    }
    try {
      const orderId = await createOrder(user.uid, items, values);
      dispatch(clearCart());
      navigate(PATHS.ORDER_SUCCESS(orderId), { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common:errors.generic"));
    }
  }

  return (
    <>
      <Seo title={t("cart:checkout_page.title")} noIndex />
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink-light flex items-center gap-2 mb-6">
          <Link to={PATHS.CART} className="hover:text-brand-600">{t("cart:title")}</Link>
          <span>→</span>
          <span className="text-ink dark:text-cream font-medium">{t("cart:checkout_page.title")}</span>
        </nav>

        <h1 className="text-2xl font-bold text-ink dark:text-cream mb-8">
          {t("cart:checkout_page.title")}
        </h1>

        {profileLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
              {/* Form fields */}
              <div className="flex flex-col gap-6">
                {/* Personal info */}
                <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4">
                  <h2 className="font-semibold text-ink dark:text-cream">
                    {t("cart:checkout_page.personalInfo")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={t("cart:checkout_page.fields.firstName")}
                      autoComplete="given-name"
                      error={errors.firstName?.message}
                      {...register("firstName")}
                    />
                    <Input
                      label={t("cart:checkout_page.fields.lastName")}
                      autoComplete="family-name"
                      error={errors.lastName?.message}
                      {...register("lastName")}
                    />
                  </div>
                  <Input
                    label={t("cart:checkout_page.fields.phone")}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+998901234567"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </section>

                {/* Delivery info */}
                <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4">
                  <h2 className="font-semibold text-ink dark:text-cream">
                    {t("cart:checkout_page.deliveryInfo")}
                  </h2>
                  <div>
                    <label className="text-sm font-medium text-ink dark:text-cream block mb-1">
                      {t("cart:checkout_page.fields.address")}
                    </label>
                    <textarea
                      rows={3}
                      autoComplete="street-address"
                      className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-xs text-error mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink dark:text-cream block mb-1">
                      {t("cart:checkout_page.fields.notes")}
                    </label>
                    <textarea
                      rows={2}
                      className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                      {...register("notes")}
                    />
                  </div>
                </section>

                {/* Payment method */}
                <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-3">
                  <h2 className="font-semibold text-ink dark:text-cream">
                    {t("cart:checkout_page.paymentMethod")}
                  </h2>
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = paymentMethod === method.value;
                    return (
                      <label
                        key={method.value}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-btn border-2 cursor-pointer transition-colors",
                          isSelected
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : "border-cream-dark dark:border-ink-light/30 hover:border-brand-300"
                        )}
                      >
                        <input
                          type="radio"
                          value={method.value}
                          className="mt-0.5 accent-brand-500"
                          {...register("paymentMethod")}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-ink dark:text-cream">
                            {t(`cart:checkout_page.${method.value}`)}
                          </span>
                          <span className="text-xs text-ink-light">
                            {t(`cart:checkout_page.${method.value}Desc`)}
                          </span>
                          {isSelected && method.value === "partial_online" && (
                            <div className="mt-2 text-xs space-y-1">
                              <p className="text-brand-600 font-medium">
                                {t("cart:checkout_page.depositAmount", {
                                  amount: depositAmount.toLocaleString(),
                                })}
                              </p>
                              <p className="text-ink-light">
                                {t("cart:checkout_page.dueOnDelivery", {
                                  amount: dueOnDelivery.toLocaleString(),
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </section>
              </div>

              {/* Order summary */}
              <div className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4 sticky top-24">
                <h2 className="font-semibold text-ink dark:text-cream">{t("cart:summary")}</h2>

                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-14 object-cover rounded-btn bg-cream"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ink-light text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {item.qty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-1 text-ink dark:text-cream font-medium">{item.name}</p>
                        <p className="text-xs text-ink-light">{item.size} · {item.color}</p>
                      </div>
                      <span className="text-ink dark:text-cream font-medium shrink-0">
                        {(item.unitPrice * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cream-dark dark:border-ink-light/20 pt-3 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-ink-light">
                    <span>{t("cart:subtotal")}</span>
                    <span>{subtotal.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex justify-between text-ink-light">
                    <span>{t("cart:shipping")}</span>
                    <span className={cn(shipping === 0 && "text-success")}>
                      {shipping === 0 ? t("cart:shippingFree") : `${shipping.toLocaleString()} so'm`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-ink dark:text-cream text-base pt-1 border-t border-cream-dark dark:border-ink-light/20">
                    <span>{t("cart:total")}</span>
                    <span>{total.toLocaleString()} so'm</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  {t("cart:checkout_page.submit")}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </>
  );
}
