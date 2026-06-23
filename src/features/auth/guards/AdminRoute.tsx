import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store";
import { selectAuth, selectIsAdmin } from "@/features/auth/authSlice";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/feedback/Spinner";

interface Props {
  children: React.ReactNode;
}

export function AdminRoute({ children }: Props) {
  const { user, status } = useAppSelector(selectAuth);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { t } = useTranslation();

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (!isAdmin) {
    toast.error(t("errors.unauthorized"));
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <>{children}</>;
}
