import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="text-4xl">⚠️</div>
      <p className="text-error font-medium">{message ?? t("errors.generic")}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-brand-500 text-white rounded-btn text-sm hover:bg-brand-600 transition-colors"
        >
          Qayta urinish
        </button>
      )}
    </div>
  );
}
