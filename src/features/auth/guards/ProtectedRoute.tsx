import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store";
import { selectAuth } from "@/features/auth/authSlice";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/feedback/Spinner";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user, status } = useAppSelector(selectAuth);
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={`${PATHS.LOGIN}?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
