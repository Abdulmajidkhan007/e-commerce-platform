import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectTheme, toggleTheme } from "@/features/ui/uiSlice";
import { cn } from "@/utils/cn";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const { t } = useTranslation();

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={cn(
        "flex items-center justify-center h-9 w-9 rounded-full",
        "hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors duration-fast",
        "text-ink dark:text-cream text-lg",
        className
      )}
      aria-label={theme === "dark" ? t("theme.light") : t("theme.dark")}
      title={theme === "dark" ? t("theme.light") : t("theme.dark")}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
