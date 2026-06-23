import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { submitContactForm } from "@/features/blog/blogService";

const contactSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgi"),
  email: z.string().email("Email noto'g'ri"),
  phone: z.string().optional(),
  message: z.string().min(10, "Xabar kamida 10 ta belgi").max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const INFO_ITEMS = [
  { icon: "📍", labelKey: "contact.info.address", valueKey: "contact.info.addressValue" },
  { icon: "📞", labelKey: "contact.info.phone", valueKey: "contact.info.phoneValue" },
  { icon: "✉️", labelKey: "contact.info.email", valueKey: "contact.info.emailValue" },
  { icon: "🕐", labelKey: "contact.info.hours", valueKey: "contact.info.hoursValue" },
] as const;

export default function ContactPage() {
  const { t } = useTranslation("blog");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      await submitContactForm({
        name: values.name,
        email: values.email,
        message: values.message,
        ...(values.phone ? { phone: values.phone } : {}),
      });
      setSubmitted(true);
      reset();
      toast.success(t("contact.success"));
    } catch {
      toast.error(t("contact.error"));
    }
  }

  return (
    <>
      <Seo title={t("contact.title")} description={t("contact.subtitle")} />
      <Container className="py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-ink dark:text-cream mb-2">
            {t("contact.title")}
          </h1>
          <p className="text-ink-light">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start max-w-5xl mx-auto">
          {/* Form */}
          <div className="rounded-card border border-cream-dark dark:border-ink-light/20 bg-white dark:bg-ink p-6">
            {submitted ? (
              <div className="text-center py-10 flex flex-col items-center gap-4">
                <span className="text-5xl">✅</span>
                <p className="font-semibold text-ink dark:text-cream text-lg">
                  {t("contact.success")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                >
                  Yangi xabar yuborish
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t("contact.name")}
                    autoComplete="name"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label={t("contact.email")}
                    type="email"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <Input
                  label={t("contact.phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+998 90 123 45 67"
                  {...register("phone")}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-ink dark:text-cream">
                    {t("contact.message")}
                  </label>
                  <textarea
                    rows={6}
                    placeholder={t("contact.messagePlaceholder")}
                    className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-error">{errors.message.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {t("contact.submit")}
                </Button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold text-ink dark:text-cream">
              {t("contact.info.title")}
            </h2>
            <div className="flex flex-col gap-4">
              {INFO_ITEMS.map((item) => (
                <div key={item.labelKey} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-cream">
                      {t(item.labelKey)}
                    </p>
                    <p className="text-sm text-ink-light">{t(item.valueKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-card border border-cream-dark dark:border-ink-light/20 overflow-hidden bg-cream dark:bg-ink-light/5 h-48 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl block mb-2">🗺️</span>
                <p className="text-sm text-ink-light">Toshkent, Chilonzor tumani</p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/kidswearuz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-btn border border-cream-dark dark:border-ink-light/30 text-sm text-ink dark:text-cream hover:border-brand-400 hover:text-brand-600 transition-colors"
              >
                <span>✈️</span> Telegram
              </a>
              <a
                href="https://instagram.com/kidswearuz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-btn border border-cream-dark dark:border-ink-light/30 text-sm text-ink dark:text-cream hover:border-brand-400 hover:text-brand-600 transition-colors"
              >
                <span>📸</span> Instagram
              </a>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
