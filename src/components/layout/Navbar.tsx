import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectUser, selectIsAdmin } from "@/features/auth/authSlice";
import { toggleMobileNav, selectIsMobileNavOpen, closeMobileNav } from "@/features/ui/uiSlice";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/routes/paths";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CartButton } from "./CartButton";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";

const navLinks = [
  { path: PATHS.HOME, key: "home" },
  { path: PATHS.SHOP, key: "shop" },
  { path: PATHS.BLOG, key: "blog" },
  { path: PATHS.ABOUT, key: "about" },
  { path: PATHS.CONTACT, key: "contact" },
] as const;

export function Navbar() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isMobileNavOpen = useAppSelector(selectIsMobileNavOpen);
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-dark dark:border-ink-light/20 bg-cream/90 dark:bg-ink/90 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to={PATHS.HOME}
            className="flex items-center gap-2 font-bold text-xl text-brand-600 shrink-0"
          >
            <span className="text-2xl" aria-hidden="true">👶</span>
            KidsWear
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Asosiy menyu">
            {navLinks.map(({ path, key }) => (
              <NavLink
                key={path}
                to={path}
                end={path === PATHS.HOME}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors duration-fast",
                    isActive
                      ? "text-brand-600"
                      : "text-ink-light hover:text-ink dark:text-cream/70 dark:hover:text-cream"
                  )
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to={PATHS.ADMIN}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors duration-fast text-brand-600",
                    isActive ? "font-bold" : "hover:text-brand-700"
                  )
                }
              >
                {t("nav.admin")}
              </NavLink>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher className="hidden sm:flex" />
            <ThemeToggle />
            <CartButton asLink />

            {user ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-label={t("nav.profile")}
                  aria-expanded={showUserMenu}
                  className="rounded-full"
                >
                  <Avatar
                    src={user.photoURL}
                    firstName={user.displayName?.split(" ")[0] ?? ""}
                    lastName={user.displayName?.split(" ")[1] ?? ""}
                    size="sm"
                  />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-ink border border-cream-dark dark:border-ink-light/40 rounded-card shadow-elevated z-50 py-1">
                      <Link
                        to={PATHS.PROFILE}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink dark:text-cream hover:bg-brand-50 dark:hover:bg-brand-900/20"
                      >
                        👤 {t("nav.profile")}
                      </Link>
                      <Link
                        to={PATHS.PROFILE_ORDERS}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink dark:text-cream hover:bg-brand-50 dark:hover:bg-brand-900/20"
                      >
                        📦 {t("nav.orders")}
                      </Link>
                      {isAdmin && (
                        <Link
                          to={PATHS.ADMIN}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                        >
                          ⚙️ {t("nav.admin")}
                        </Link>
                      )}
                      <div className="my-1 border-t border-cream-dark dark:border-ink-light/30" />
                      <button
                        onClick={async () => { setShowUserMenu(false); await logout(); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                      >
                        🚪 {t("nav.logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to={PATHS.LOGIN}
                className="hidden sm:inline-flex ml-1 px-3 py-1.5 text-sm font-medium text-brand-600 border border-brand-300 rounded-btn hover:bg-brand-50 transition-colors duration-fast"
              >
                {t("nav.login")}
              </Link>
            )}

            {/* Mobile menu btn */}
            <button
              onClick={() => dispatch(toggleMobileNav())}
              className="md:hidden ml-1 flex flex-col gap-1.5 h-9 w-9 items-center justify-center rounded"
              aria-expanded={isMobileNavOpen}
              aria-label="Menyu"
            >
              <span className={cn("block h-0.5 w-5 bg-ink dark:bg-cream transition-all duration-fast", isMobileNavOpen && "rotate-45 translate-y-2")} />
              <span className={cn("block h-0.5 w-5 bg-ink dark:bg-cream transition-all duration-fast", isMobileNavOpen && "opacity-0")} />
              <span className={cn("block h-0.5 w-5 bg-ink dark:bg-cream transition-all duration-fast", isMobileNavOpen && "-rotate-45 -translate-y-2")} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileNavOpen && (
          <nav
            className="md:hidden py-4 border-t border-cream-dark dark:border-ink-light/20 flex flex-col gap-1"
            aria-label="Mobil menyu"
          >
            {navLinks.map(({ path, key }) => (
              <NavLink
                key={path}
                to={path}
                end={path === PATHS.HOME}
                onClick={() => dispatch(closeMobileNav())}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-sm font-medium rounded-btn transition-colors",
                    isActive
                      ? "bg-brand-100 text-brand-700"
                      : "text-ink-light hover:bg-brand-50 dark:text-cream/70"
                  )
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to={PATHS.ADMIN}
                onClick={() => dispatch(closeMobileNav())}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-sm font-medium rounded-btn text-brand-600",
                    isActive ? "bg-brand-100" : "hover:bg-brand-50"
                  )
                }
              >
                {t("nav.admin")}
              </NavLink>
            )}
            <div className="px-3 pt-2 border-t border-cream-dark dark:border-ink-light/20 mt-2 flex items-center gap-3">
              <LanguageSwitcher />
              {!user && (
                <Link
                  to={PATHS.LOGIN}
                  onClick={() => dispatch(closeMobileNav())}
                  className="text-sm font-medium text-brand-600"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
