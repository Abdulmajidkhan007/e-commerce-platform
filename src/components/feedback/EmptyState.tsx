import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const { t } = useTranslation();
  void t;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      {icon && (
        <div className="text-brand-300 text-5xl">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-ink dark:text-cream">{title}</h3>
      {description && (
        <p className="text-sm text-ink-light dark:text-cream/60 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
