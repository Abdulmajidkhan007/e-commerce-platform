import { Seo } from "@/components/seo/Seo";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/layout/Container";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t("app.name")} description={t("app.tagline")} />
      <section className="bg-gradient-to-b from-brand-50 to-cream dark:from-ink dark:to-[#1a1410] py-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-ink dark:text-cream mb-6">
              {t("app.tagline")} 🧒
            </h1>
            <p className="text-lg text-ink-light dark:text-cream/70 mb-8">
              Bolalar uchun qulay, chiroyli va sifatli kiyimlar yig'indisi
            </p>
            <Link
              to={PATHS.SHOP}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-btn font-medium hover:bg-brand-600 transition-colors"
            >
              {t("btn.viewAll")} →
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
