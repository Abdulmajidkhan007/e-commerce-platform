import { Outlet, NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/routes/paths";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Avatar } from "@/components/ui/Avatar";
import { useAppSelector } from "@/store";
import { selectUser } from "@/features/auth/authSlice";
import { cn } from "@/utils/cn";

interface AdminNavItem {
  path: string;
  label: string;
  icon: string;
  end?: boolean;
}

const adminNav: AdminNavItem[] = [
  { path: PATHS.ADMIN, label: "Dashboard", icon: "📊", end: true },
  { path: PATHS.ADMIN_PRODUCTS, label: "Mahsulotlar", icon: "👕" },
  { path: PATHS.ADMIN_ORDERS, label: "Buyurtmalar", icon: "📦" },
  { path: PATHS.ADMIN_BLOG, label: "Blog", icon: "✏️" },
];

export function AdminLayout() {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);

  return (
    <div className="flex min-h-screen bg-cream dark:bg-[#1a1410]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-cream-dark dark:border-ink-light/20 bg-white dark:bg-ink shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-cream-dark dark:border-ink-light/20">
          <Link to={PATHS.HOME} className="flex items-center gap-2 font-bold text-brand-600">
            <span>👶</span> KidsWear
          </Link>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1" aria-label="Admin panel">
          {adminNav.map(({ path, label, icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end === true}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-btn text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-100 text-brand-700"
                    : "text-ink-light hover:bg-brand-50 dark:text-cream/70 dark:hover:bg-brand-900/20"
                )
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-cream-dark dark:border-ink-light/20">
          <Link to={PATHS.HOME} className="text-xs text-ink-light hover:text-brand-600 transition-colors">
            ← {t("nav.home")}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-cream-dark dark:border-ink-light/20 bg-white dark:bg-ink">
          <h1 className="font-semibold text-ink dark:text-cream">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {user && (
              <Avatar
                src={user.photoURL}
                firstName={user.displayName?.split(" ")[0] ?? "A"}
                size="sm"
              />
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
