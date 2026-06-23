import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { Spinner } from "@/components/feedback/Spinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ProfileView } from "@/features/profile/components/ProfileView";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useAppSelector } from "@/store";
import { selectUser } from "@/features/auth/authSlice";
import { PATHS } from "@/routes/paths";

export default function ProfilePage() {
  const { t } = useTranslation("profile");
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const { profile, loading } = useProfile(user?.uid);

  const isEditMode = location.pathname === PATHS.PROFILE_EDIT;
  const isOrdersMode = location.pathname === PATHS.PROFILE_ORDERS;

  const pageTitle = isEditMode
    ? t("editTitle")
    : isOrdersMode
    ? t("ordersTitle")
    : t("title");

  if (loading) {
    return (
      <Container className="py-16 flex justify-center">
        <Spinner size="lg" />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="py-16">
        <EmptyState title="Profil topilmadi" />
      </Container>
    );
  }

  return (
    <>
      <Seo title={pageTitle} noIndex />
      <Container className="py-10">
        <h1 className="text-2xl font-bold text-ink dark:text-cream mb-8">{pageTitle}</h1>

        {isEditMode ? (
          <ProfileEditForm profile={profile} />
        ) : isOrdersMode ? (
          <div>
            <EmptyState
              title={t("noOrders")}
              description={t("noOrdersDesc")}
              icon={<span>📦</span>}
            />
          </div>
        ) : (
          <ProfileView profile={profile} />
        )}
      </Container>
    </>
  );
}
