import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";

interface AvatarUploaderProps {
  currentUrl?: string | null;
  firstName: string;
  lastName: string;
  onFileSelect: (file: File) => void;
  uploading?: boolean;
}

export function AvatarUploader({
  currentUrl,
  firstName,
  lastName,
  onFileSelect,
  uploading = false,
}: AvatarUploaderProps) {
  const { t } = useTranslation("profile");
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  }

  const displayUrl = previewUrl ?? currentUrl ?? null;

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <Avatar
          src={displayUrl}
          firstName={firstName}
          lastName={lastName}
          size="xl"
        />
        {uploading && (
          <div className="absolute inset-0 bg-ink/40 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {uploading ? t("avatar.uploading") : t("avatar.change")}
        </button>
        <p className="text-xs text-ink-light">{t("avatar.hint")}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label={t("fields.avatar")}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
