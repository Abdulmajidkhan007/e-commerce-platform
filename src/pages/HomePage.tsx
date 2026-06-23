import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import { useProducts } from "@/features/products/hooks/useProducts";
import { PATHS } from "@/routes/paths";
import { CATEGORIES } from "@/constants";

const CATEGORY_EMOJI: Record<string, string> = {
  tops: "👕",
  bottoms: "👖",
  dresses: "👗",
  outerwear: "🧥",
  sleepwear: "🌙",
  underwear: "🩲",
  swimwear: "🩱",
  accessories: "🎀",
  shoes: "👟",
  sets: "🎁",
};

export default function HomePage() {
  const { t } = useTranslation();
  const { items: newProducts, loading } = useProducts({ sort: "new" });
  const { items: popularProducts, loading: loadingPopular } = useProducts({ sort: "popular" });

  return (
    <>
      <Seo title={t("app.name")} description={t("app.tagline")} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-cream to-brand-100 dark:from-[#1a1410] dark:via-ink dark:to-[#2b1f18] py-20 md:py-28">
        {/* Decorative blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-200/40 dark:bg-brand-900/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-brand-300/30 dark:bg-brand-800/20 blur-3xl" />

        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-medium mb-4">
                  <span>✨</span> Yangi kolleksiya
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink dark:text-cream leading-tight mb-5">
                  {t("app.tagline")}
                  <span className="text-brand-500"> 👶</span>
                </h1>
                <p className="text-lg text-ink-light dark:text-cream/70 mb-8 leading-relaxed">
                  Bolalar uchun qulay, chiroyli va sifatli kiyimlar — har bir o'lcham va yosh uchun
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    to={PATHS.SHOP}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-btn font-semibold hover:bg-brand-600 active:bg-brand-700 transition-colors shadow-card"
                  >
                    {t("btn.viewAll")} →
                  </Link>
                  <Link
                    to={PATHS.BLOG}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-brand-300 text-brand-600 rounded-btn font-semibold hover:bg-brand-50 transition-colors"
                  >
                    Blog
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: "👕", label: "Mahsulotlar", value: "500+" },
                { icon: "🚀", label: "Tez yetkazish", value: "24 soat" },
                { icon: "⭐", label: "Mijozlar", value: "2000+" },
                { icon: "🔄", label: "Qaytarish", value: "30 kun" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-card border border-cream-dark dark:border-ink-light/20 bg-white/70 dark:bg-ink/50 backdrop-blur-sm p-5 text-center"
                >
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="font-bold text-2xl text-ink dark:text-cream">{stat.value}</div>
                  <div className="text-xs text-ink-light mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Kategoriyalar ────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-ink">
        <Container>
          <FadeIn>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-ink dark:text-cream">Kategoriyalar</h2>
              <Link to={PATHS.SHOP} className="text-sm text-brand-600 hover:underline">
                Barchasi →
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => (
              <FadeIn key={cat.value} delay={i * 0.04}>
                <Link
                  to={`${PATHS.SHOP}?category=${cat.value}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-card border border-cream-dark dark:border-ink-light/20 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-center"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {CATEGORY_EMOJI[cat.value] ?? "🛍"}
                  </span>
                  <span className="text-xs font-medium text-ink dark:text-cream">
                    {t(`categories.${cat.value}`)}
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Yangi mahsulotlar ─────────────────────────────── */}
      <section className="py-14">
        <Container>
          <FadeIn>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-ink dark:text-cream">Yangi keldi</h2>
              <Link to={`${PATHS.SHOP}?sort=new`} className="text-sm text-brand-600 hover:underline">
                Ko'proq →
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : newProducts.slice(0, 8).map((product, i) => (
                  <FadeIn key={product.id} delay={i * 0.05}>
                    <ProductCard product={product} />
                  </FadeIn>
                ))}
          </div>
        </Container>
      </section>

      {/* ── Promo banner ──────────────────────────────────── */}
      <FadeIn>
        <section className="py-6">
          <Container>
            <div className="rounded-card bg-gradient-to-r from-brand-500 to-brand-600 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
              <div>
                <p className="text-sm font-medium opacity-80 mb-1">Maxsus taklif</p>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  500 000 so'mdan yuqori buyurtmada
                </h2>
                <p className="text-lg opacity-90">🚚 Yetkazib berish bepul!</p>
              </div>
              <Link
                to={PATHS.SHOP}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-btn font-bold hover:bg-cream transition-colors"
              >
                Xarid qilish →
              </Link>
            </div>
          </Container>
        </section>
      </FadeIn>

      {/* ── Mashhur mahsulotlar ───────────────────────────── */}
      <section className="py-14">
        <Container>
          <FadeIn>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-ink dark:text-cream">Eng mashhurlar</h2>
              <Link to={`${PATHS.SHOP}?sort=popular`} className="text-sm text-brand-600 hover:underline">
                Ko'proq →
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loadingPopular
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : popularProducts.slice(0, 8).map((product, i) => (
                  <FadeIn key={product.id} delay={i * 0.05}>
                    <ProductCard product={product} />
                  </FadeIn>
                ))}
          </div>
        </Container>
      </section>

      {/* ── Nima uchun biz? ───────────────────────────────── */}
      <section className="py-14 bg-brand-50 dark:bg-[#1a1410]">
        <Container>
          <FadeIn>
            <h2 className="text-2xl font-bold text-ink dark:text-cream text-center mb-10">
              Nima uchun KidsWear?
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🏅",
                title: "Sifat kafolati",
                desc: "Barcha mahsulotlar bolalar uchun xavfsizlik standartlaridan o'tgan",
              },
              {
                icon: "🚀",
                title: "Tez yetkazish",
                desc: "Buyurtmangiz 24 soat ichida yetkazib beriladi",
              },
              {
                icon: "💰",
                title: "Arzon narxlar",
                desc: "Ishlab chiqaruvchidan to'g'ridan-to'g'ri — oraliq qo'shimchasisiz",
              },
              {
                icon: "🔄",
                title: "Oson qaytarish",
                desc: "30 kun ichida sabab ko'rsatmasdan qaytarish mumkin",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center gap-3 p-5 rounded-card bg-white dark:bg-ink border border-cream-dark dark:border-ink-light/20">
                  <span className="text-4xl">{item.icon}</span>
                  <h3 className="font-semibold text-ink dark:text-cream">{item.title}</h3>
                  <p className="text-sm text-ink-light">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
