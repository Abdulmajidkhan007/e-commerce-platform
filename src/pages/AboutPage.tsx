import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { PATHS } from "@/routes/paths";

const TEAM = [
  { name: "Aziz Karimov", role: "Asoschisi va bosh direktor", emoji: "👨‍💼" },
  { name: "Malika Yusupova", role: "Dizayner", emoji: "👩‍🎨" },
  { name: "Jasur Toshmatov", role: "Texnologiya direktori", emoji: "👨‍💻" },
];

const TIMELINE = [
  { year: "2019", text: "KidsWear kichik online do'kon sifatida boshladi" },
  { year: "2021", text: "1000+ mahsulot va 5000+ mamnun mijozga erishdik" },
  { year: "2023", text: "Toshkent bo'ylab tez yetkazish tarmog'ini kengaytirdik" },
  { year: "2025", text: "Yangi platforma va bolalar kiyimi markasi sifatida tanildik" },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title="Biz haqimizda" description="KidsWear — bolalar kiyimi uchun eng yaxshi tanlov" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-cream dark:from-[#1a1410] dark:to-ink py-20">
        <Container>
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-5xl mb-4 block">👶</span>
              <h1 className="text-4xl font-bold text-ink dark:text-cream mb-4">
                Biz haqimizda
              </h1>
              <p className="text-lg text-ink-light dark:text-cream/70">
                KidsWear — 2019-yildan buyon bolalar kiyimida sifat va qulaylikni birlashtirib
                kelayotgan o'zbek brendi
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="text-2xl font-bold text-ink dark:text-cream mb-4">
                  Bizning missiyamiz
                </h2>
                <p className="text-ink-light dark:text-cream/70 mb-4 leading-relaxed">
                  Har bir bola o'zini qulay va chiroyli his etishga haqli. Biz ota-onalarga bolalari
                  uchun sifatli, xavfsiz va arzon narxdagi kiyimlarni taklif qilamiz.
                </p>
                <p className="text-ink-light dark:text-cream/70 leading-relaxed">
                  Materiallarimiz bolalar terisi uchun xavfsiz sertifikatga ega va barcha mahsulotlar
                  maxsus nazoratdan o'tgan. Bolalar kiyimi — bu shunchaki kiyim emas, bu sevgi.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🌿", label: "Ekologik toza materiallar" },
                  { icon: "🏅", label: "Sifat sertifikati" },
                  { icon: "💚", label: "Bolalarga xavfsiz" },
                  { icon: "🤝", label: "Ishonchli brendlar" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-card border border-cream-dark dark:border-ink-light/20 p-4 flex flex-col items-center text-center gap-2 bg-white dark:bg-ink"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <p className="text-xs font-medium text-ink dark:text-cream">{item.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-brand-50 dark:bg-[#1a1410]">
        <Container>
          <FadeIn>
            <h2 className="text-2xl font-bold text-ink dark:text-cream text-center mb-10">
              Bizning yo'limiz
            </h2>
          </FadeIn>
          <div className="max-w-xl mx-auto flex flex-col gap-0">
            {TIMELINE.map((item, i) => (
              <FadeIn key={item.year} delay={i * 0.1}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {item.year.slice(2)}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="flex-1 w-0.5 bg-brand-200 dark:bg-brand-800 mt-1 mb-1 min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold text-brand-600 text-sm">{item.year}</p>
                    <p className="text-ink-light dark:text-cream/70 text-sm mt-0.5">{item.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-16">
        <Container>
          <FadeIn>
            <h2 className="text-2xl font-bold text-ink dark:text-cream text-center mb-10">
              Bizning jamoa
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center gap-3 p-6 rounded-card border border-cream-dark dark:border-ink-light/20 bg-white dark:bg-ink">
                  <span className="text-5xl">{member.emoji}</span>
                  <div>
                    <p className="font-semibold text-ink dark:text-cream">{member.name}</p>
                    <p className="text-xs text-ink-light mt-0.5">{member.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <FadeIn>
        <section className="py-14 bg-brand-500">
          <Container>
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-3">Biz bilan xarid qiling!</h2>
              <p className="opacity-90 mb-6">500 000 so'mdan yuqori buyurtmada yetkazish bepul</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  to={PATHS.SHOP}
                  className="px-6 py-3 bg-white text-brand-600 rounded-btn font-bold hover:bg-cream transition-colors"
                >
                  {t("btn.viewAll")}
                </Link>
                <Link
                  to={PATHS.CONTACT}
                  className="px-6 py-3 border-2 border-white text-white rounded-btn font-semibold hover:bg-white/10 transition-colors"
                >
                  Bog'laning
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </FadeIn>
    </>
  );
}
