import { Outlet, Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-[#1a1410] px-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <Link to={PATHS.HOME} className="flex items-center gap-2 font-bold text-2xl text-brand-600 mb-8">
        <span>👶</span> KidsWear
      </Link>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
