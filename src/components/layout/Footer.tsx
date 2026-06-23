import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "./Container";
import { PATHS } from "@/routes/paths";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink dark:bg-black text-cream/80 mt-auto">
      <Container>
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to={PATHS.HOME} className="flex items-center gap-2 font-bold text-lg text-cream mb-3">
              <span>👶</span> KidsWear
            </Link>
            <p className="text-sm text-cream/60">{t("app.tagline")}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wide">
              {t("nav.shop")}
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to={PATHS.SHOP} className="hover:text-cream transition-colors">{t("nav.shop")}</Link></li>
              <li><Link to={PATHS.BLOG} className="hover:text-cream transition-colors">{t("nav.blog")}</Link></li>
              <li><Link to={PATHS.ABOUT} className="hover:text-cream transition-colors">{t("nav.about")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wide">
              Akkaunt
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to={PATHS.PROFILE} className="hover:text-cream transition-colors">{t("nav.profile")}</Link></li>
              <li><Link to={PATHS.PROFILE_ORDERS} className="hover:text-cream transition-colors">{t("nav.orders")}</Link></li>
              <li><Link to={PATHS.CART} className="hover:text-cream transition-colors">{t("nav.cart")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wide">
              {t("nav.contact")}
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to={PATHS.CONTACT} className="hover:text-cream transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/40">
          <p>© {year} KidsWear. Barcha huquqlar himoyalangan.</p>
          <p>Bolalar kiyimlari do'koni 🇺🇿</p>
        </div>
      </Container>
    </footer>
  );
}
