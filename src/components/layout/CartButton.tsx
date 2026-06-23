import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCartCount } from "@/features/cart/cartSlice";
import { toggleCart } from "@/features/ui/uiSlice";
import { PATHS } from "@/routes/paths";
import { cn } from "@/utils/cn";

interface CartButtonProps {
  className?: string;
  asLink?: boolean;
}

export function CartButton({ className, asLink = false }: CartButtonProps) {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCartCount);
  const { t } = useTranslation();

  const content = (
    <>
      <span className="text-xl" aria-hidden="true">🛒</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </>
  );

  const baseClass = cn(
    "relative flex items-center justify-center h-9 w-9 rounded-full",
    "hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors duration-fast",
    className
  );

  if (asLink) {
    return (
      <Link to={PATHS.CART} className={baseClass} aria-label={t("nav.cart")}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={() => dispatch(toggleCart())}
      className={baseClass}
      aria-label={t("nav.cart")}
    >
      {content}
    </button>
  );
}
