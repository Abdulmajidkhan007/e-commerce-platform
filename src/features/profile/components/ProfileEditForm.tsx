import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AvatarUploader } from "./AvatarUploader";
import { profileFormSchema, type ProfileFormValues } from "@/services/schemas";
import { updateProfile, updateAvatar, getUserLocation } from "@/features/profile/profileService";
import { PATHS } from "@/routes/paths";
import type { UserDoc } from "@/types";

interface ProfileEditFormProps {
  profile: UserDoc;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const { t } = useTranslation("profile");
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(
    profile.address?.location ?? null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
      birthYear: profile.birthYear ?? undefined,
      address: profile.address ?? undefined,
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      /* Avatar yuklash */
      if (avatarFile) {
        setUploadingAvatar(true);
        await updateAvatar(profile.uid, avatarFile);
        setUploadingAvatar(false);
      }

      /* Profil yangilash */
      await updateProfile(profile.uid, values, gpsLocation);
      toast.success(t("success"));
      navigate(PATHS.PROFILE);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xatolik yuz berdi");
      setUploadingAvatar(false);
    }
  }

  async function handleUseLocation() {
    setGettingLocation(true);
    try {
      const location = await getUserLocation();
      if (location) {
        setGpsLocation(location);
        toast.success(t("location.success"));
      } else {
        toast.error(t("location.denied"));
      }
    } finally {
      setGettingLocation(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      {/* Avatar */}
      <Card>
        <h3 className="font-semibold text-ink dark:text-cream mb-4">{t("fields.avatar")}</h3>
        <AvatarUploader
          currentUrl={profile.avatarUrl}
          firstName={profile.firstName}
          lastName={profile.lastName}
          onFileSelect={setAvatarFile}
          uploading={uploadingAvatar}
        />
      </Card>

      {/* Shaxsiy ma'lumotlar */}
      <Card>
        <h3 className="font-semibold text-ink dark:text-cream mb-4">Shaxsiy ma'lumotlar</h3>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("fields.firstName")}
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label={t("fields.lastName")}
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <Input
            label={t("fields.phone")}
            type="tel"
            autoComplete="tel"
            placeholder="+998901234567"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <div>
            <label className="text-sm font-medium text-ink dark:text-cream block mb-1">
              {t("fields.bio")}
            </label>
            <textarea
              rows={3}
              placeholder="O'zingiz haqingizda qisqacha..."
              className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              {...register("bio")}
            />
            {errors.bio && <p className="text-xs text-error mt-1">{errors.bio.message}</p>}
          </div>
          <Input
            label={t("fields.birthYear")}
            type="number"
            placeholder="1995"
            error={errors.birthYear?.message}
            {...register("birthYear", {
              setValueAs: (v: string) => (v === "" ? null : parseInt(v, 10)),
            })}
          />
        </div>
      </Card>

      {/* Manzil */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink dark:text-cream">{t("fields.address")}</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUseLocation}
            isLoading={gettingLocation}
            leftIcon={<span>📍</span>}
          >
            {gettingLocation ? t("location.using") : t("location.use")}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            label={t("fields.addressLine1")}
            autoComplete="street-address"
            placeholder="Navoiy ko'chasi, 15-uy"
            error={errors.address?.line1?.message}
            {...register("address.line1")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("fields.city")}
              autoComplete="address-level2"
              placeholder="Toshkent"
              error={errors.address?.city?.message}
              {...register("address.city")}
            />
            <Input
              label={t("fields.region")}
              autoComplete="address-level1"
              placeholder="Toshkent viloyati"
              error={errors.address?.region?.message}
              {...register("address.region")}
            />
          </div>
          <Input
            label={t("fields.addressNotes")}
            placeholder="3-qavat, 12-xona"
            {...register("address.notes")}
          />
          {gpsLocation && (
            <p className="text-xs text-success flex items-center gap-1">
              ✅ GPS joylashuv saqlangan ({gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)})
            </p>
          )}
        </div>
      </Card>

      {/* Tugmalar */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting || uploadingAvatar}
        >
          {t("actions.save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => navigate(PATHS.PROFILE)}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    </form>
  );
}
