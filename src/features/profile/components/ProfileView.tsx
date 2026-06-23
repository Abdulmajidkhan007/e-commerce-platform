import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PATHS } from "@/routes/paths";
import type { UserDoc } from "@/types";

interface ProfileViewProps {
  profile: UserDoc;
}

export function ProfileView({ profile }: ProfileViewProps) {
  const { t } = useTranslation("profile");

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <Card>
        <div className="flex items-start gap-5">
          <Avatar
            src={profile.avatarUrl}
            firstName={profile.firstName}
            lastName={profile.lastName}
            size="xl"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-ink dark:text-cream">{fullName}</h2>
              {profile.role === "admin" && (
                <Badge variant="warning">Admin</Badge>
              )}
            </div>
            <p className="text-sm text-ink-light mt-0.5">{profile.email}</p>
            {profile.bio && (
              <p className="text-sm text-ink dark:text-cream/80 mt-2">{profile.bio}</p>
            )}
          </div>
          <Link to={PATHS.PROFILE_EDIT}>
            <Button variant="outline" size="sm">
              ✏️ {t("actions.edit")}
            </Button>
          </Link>
        </div>
      </Card>

      {/* Ma'lumotlar */}
      <Card>
        <h3 className="font-semibold text-ink dark:text-cream mb-4">Shaxsiy ma'lumotlar</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.phone && (
            <div>
              <dt className="text-xs text-ink-light uppercase tracking-wide">{t("fields.phone")}</dt>
              <dd className="text-sm text-ink dark:text-cream mt-1">{profile.phone}</dd>
            </div>
          )}
          {profile.birthYear && (
            <div>
              <dt className="text-xs text-ink-light uppercase tracking-wide">{t("fields.birthYear")}</dt>
              <dd className="text-sm text-ink dark:text-cream mt-1">{profile.birthYear}</dd>
            </div>
          )}
          {profile.address && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-light uppercase tracking-wide">{t("fields.address")}</dt>
              <dd className="text-sm text-ink dark:text-cream mt-1">
                {profile.address.line1}, {profile.address.city}, {profile.address.region}
                {profile.address.notes && ` — ${profile.address.notes}`}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      {/* Buyurtmalar havolasi */}
      <Link to={PATHS.PROFILE_ORDERS} className="block">
        <Card hoverable className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-ink dark:text-cream">📦 {t("ordersTitle")}</h3>
            <p className="text-sm text-ink-light mt-0.5">Barcha buyurtmalaringizni ko'ring</p>
          </div>
          <span className="text-brand-500 text-xl">→</span>
        </Card>
      </Link>
    </div>
  );
}
