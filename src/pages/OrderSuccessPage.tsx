import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PATHS } from "@/routes/paths";

export default function OrderSuccessPage() {
  const { orderId = "" } = useParams<{ orderId: string }>();
  const { t } = useTranslation("cart");
  const shortId = orderId.slice(0, 8).toUpperCase();

  return (
    <>
      <Seo title={t("success.title")} noIndex />
      <Container className="py-20 flex justify-center">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
          {/* Success icon */}
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-ink dark:text-cream mb-2">
              {t("success.title")}
            </h1>
            <p className="text-ink-light">{t("success.desc")}</p>
          </div>

          <div className="w-full bg-cream dark:bg-ink-light/10 rounded-card px-6 py-4">
            <p className="text-xs text-ink-light mb-1">{t("success.orderId")}</p>
            <p className="font-mono font-bold text-lg text-brand-600">#{shortId}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link to={PATHS.PROFILE_ORDERS} className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                {t("success.viewOrders")}
              </Button>
            </Link>
            <Link to={PATHS.SHOP} className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                {t("success.continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
