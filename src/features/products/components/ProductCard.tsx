import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store";
import { addItem } from "@/features/cart/cartSlice";
import { PATHS } from "@/routes/paths";
import { StarRating } from "./StarRating";
import { cn } from "@/utils/cn";
import type { ProductDoc } from "@/types";

interface ProductCardProps {
  product: ProductDoc;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useTranslation("shop");
  const dispatch = useAppDispatch();

  const image = product.images[0] ?? "/placeholder-product.svg";
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = product.discountPrice ?? product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - displayPrice / product.price) * 100)
    : 0;

  function quickAdd() {
    const firstColor = product.colors[0];
    const firstSize = product.sizes[0];
    if (!firstColor || !firstSize) return;

    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        image,
        sku: product.sku,
        slug: product.slug,
        color: firstColor.name,
        colorHex: firstColor.hex,
        size: firstSize,
        qty: 1,
        unitPrice: displayPrice,
        stock: product.stock,
      })
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-white dark:bg-ink rounded-card border border-cream-dark dark:border-ink-light/20",
        "shadow-card hover:shadow-elevated transition-shadow duration-200 overflow-hidden",
        className
      )}
    >
      {/* Badge */}
      {hasDiscount && (
        <span className="absolute top-2 left-2 z-10 bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -{discountPercent}%
        </span>
      )}
      {product.stock === 0 && (
        <span className="absolute top-2 right-2 z-10 bg-ink-light/70 text-white text-xs px-2 py-0.5 rounded-full">
          {t("product.outOfStock")}
        </span>
      )}

      {/* Image */}
      <Link to={PATHS.PRODUCT(product.slug)} className="block overflow-hidden aspect-[3/4] bg-cream">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <Link
          to={PATHS.PRODUCT(product.slug)}
          className="text-sm font-medium text-ink dark:text-cream line-clamp-2 hover:text-brand-600 transition-colors"
        >
          {product.name}
        </Link>

        {product.ratingCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={product.ratingAvg} size="sm" />
            <span className="text-xs text-ink-light">({product.ratingCount})</span>
          </div>
        )}

        {isLowStock && (
          <p className="text-xs text-error">
            {t("product.lowStock", { count: product.stock })}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-ink dark:text-cream">
              {displayPrice.toLocaleString()} so'm
            </span>
            {hasDiscount && (
              <span className="text-xs text-ink-light line-through">
                {product.price.toLocaleString()}
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={quickAdd}
            aria-label={t("product.addToCart")}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-lg transition-colors",
              product.stock > 0
                ? "bg-brand-500 hover:bg-brand-600"
                : "bg-ink-light/30 cursor-not-allowed"
            )}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
