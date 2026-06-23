import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "./GoogleButton";
import { loginSchema, signupSchema, type LoginValues, type SignupValues } from "@/services/schemas";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/routes/paths";

interface AuthFormProps {
  mode: "login" | "signup";
}

function getFirebaseErrorMessage(error: FirebaseError, t: (key: string) => string): string {
  switch (error.code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return t("login.errors.invalidCredentials");
    case "auth/too-many-requests":
      return t("login.errors.tooManyRequests");
    case "auth/email-already-in-use":
      return t("signup.errors.emailInUse");
    case "auth/weak-password":
      return t("signup.errors.weakPassword");
    default:
      return t("login.errors.generic");
  }
}

export function AuthForm({ mode }: AuthFormProps) {
  const { t } = useTranslation("auth");
  const { login, loginGoogle, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirect") ?? (mode === "login" ? PATHS.HOME : PATHS.HOME);

  /* Login formi */
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  /* Signup formi */
  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  async function handleLogin(data: LoginValues) {
    setGlobalError(null);
    try {
      await login(data.email, data.password);
      toast.success(t("login.success"));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof FirebaseError) {
        setGlobalError(getFirebaseErrorMessage(err, t));
      } else {
        setGlobalError(t("login.errors.generic"));
      }
    }
  }

  async function handleSignup(data: SignupValues) {
    setGlobalError(null);
    try {
      await register(data.email, data.password, data.firstName, data.lastName);
      toast.success(t("signup.success"));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof FirebaseError) {
        setGlobalError(getFirebaseErrorMessage(err, t));
      } else {
        setGlobalError(t("signup.errors.generic"));
      }
    }
  }

  async function handleGoogleAuth() {
    setGlobalError(null);
    try {
      await loginGoogle();
      toast.success(t("login.success"));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof FirebaseError) {
        setGlobalError(getFirebaseErrorMessage(err, t));
      } else {
        setGlobalError(t("login.errors.generic"));
      }
    }
  }

  if (mode === "login") {
    return (
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink dark:text-cream">{t("login.title")}</h1>
          <p className="text-sm text-ink-light mt-1">{t("login.subtitle")}</p>
        </div>

        <GoogleButton
          label={t("login.google")}
          onClick={handleGoogleAuth}
        />

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-cream-dark dark:bg-ink-light/30" />
          <span className="text-xs text-ink-light">{t("login.orContinueWith")}</span>
          <div className="flex-1 h-px bg-cream-dark dark:bg-ink-light/30" />
        </div>

        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
          <Input
            label={t("login.email")}
            type="email"
            autoComplete="email"
            placeholder="email@example.com"
            error={loginForm.formState.errors.email?.message}
            {...loginForm.register("email")}
          />
          <Input
            label={t("login.password")}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={loginForm.formState.errors.password?.message}
            {...loginForm.register("password")}
          />

          {globalError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-error/30 rounded-btn text-sm text-error">
              {globalError}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loginForm.formState.isSubmitting}
          >
            {t("login.submit")}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-light">
          {t("login.noAccount")}{" "}
          <Link
            to={PATHS.SIGNUP}
            className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            {t("login.signupLink")}
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink dark:text-cream">{t("signup.title")}</h1>
        <p className="text-sm text-ink-light mt-1">{t("signup.subtitle")}</p>
      </div>

      <GoogleButton
        label={t("signup.google")}
        onClick={handleGoogleAuth}
      />

      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-cream-dark dark:bg-ink-light/30" />
        <span className="text-xs text-ink-light">{t("signup.orContinueWith")}</span>
        <div className="flex-1 h-px bg-cream-dark dark:bg-ink-light/30" />
      </div>

      <form onSubmit={signupForm.handleSubmit(handleSignup)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("signup.firstName")}
            autoComplete="given-name"
            placeholder="Ali"
            error={signupForm.formState.errors.firstName?.message}
            {...signupForm.register("firstName")}
          />
          <Input
            label={t("signup.lastName")}
            autoComplete="family-name"
            placeholder="Valiyev"
            error={signupForm.formState.errors.lastName?.message}
            {...signupForm.register("lastName")}
          />
        </div>
        <Input
          label={t("signup.email")}
          type="email"
          autoComplete="email"
          placeholder="email@example.com"
          error={signupForm.formState.errors.email?.message}
          {...signupForm.register("email")}
        />
        <Input
          label={t("signup.password")}
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={signupForm.formState.errors.password?.message}
          {...signupForm.register("password")}
        />
        <Input
          label={t("signup.confirmPassword")}
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={signupForm.formState.errors.confirmPassword?.message}
          {...signupForm.register("confirmPassword")}
        />

        {globalError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-error/30 rounded-btn text-sm text-error">
            {globalError}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={signupForm.formState.isSubmitting}
        >
          {t("signup.submit")}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-light">
        {t("signup.hasAccount")}{" "}
        <Link
          to={PATHS.LOGIN}
          className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          {t("signup.loginLink")}
        </Link>
      </p>
    </Card>
  );
}
