import { useTranslation } from "react-i18next";
import { Seo } from "@/components/seo/Seo";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function LoginPage() {
  const { t } = useTranslation("auth");

  return (
    <>
      <Seo title={t("login.title")} noIndex />
      <AuthForm mode="login" />
    </>
  );
}
