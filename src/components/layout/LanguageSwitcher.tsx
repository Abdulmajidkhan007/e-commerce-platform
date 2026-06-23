import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import type { SupportedLocale } from "@/constants";

const LANGS: SupportedLocale[] = ["uz", "en", "ru"];

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const current = i18n.language as SupportedLocale;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          className={cn(
            "px-2 py-0.5 text-xs font-medium rounded transition-colors duration-fast",
            current === lang
              ? "bg-brand-500 text-white"
              : "text-ink-light hover:text-ink dark:text-cream/60 dark:hover:text-cream"
          )}
          aria-label={t(`lang.${lang}`)}
          aria-current={current === lang}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
