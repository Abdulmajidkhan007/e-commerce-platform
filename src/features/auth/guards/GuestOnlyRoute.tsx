import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { selectAuth, selectIsAdmin } from "@/features/auth/authSlice";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/feedback/Spinner";

interface Props {
  children: React.ReactNode;
}

export function GuestOnlyRoute({ children }: Props) {
  const { user, status } = useAppSelector(selectAuth);
  const isAdmin = useAppSelector(selectIsAdmin);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={isAdmin ? PATHS.ADMIN : PATHS.HOME} replace />;
  }

  return <>{children}</>;
}
