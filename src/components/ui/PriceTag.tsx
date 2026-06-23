import { cn } from "@/utils/cn";
import { formatMoney } from "@/utils";
import { calculateDiscountPercent } from "@/utils";

interface PriceTagProps {
  price: number;
  discountPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: { current: "text-sm font-semibold", original: "text-xs", badge: "text-xs" },
  md: { current: "text-base font-semibold", original: "text-sm", badge: "text-xs" },
  lg: { current: "text-2xl font-bold", original: "text-base", badge: "text-sm" },
};

export function PriceTag({ price, discountPrice, size = "md", className }: PriceTagProps) {
  const hasDiscount = discountPrice !== null && discountPrice !== undefined && discountPrice < price;
  const percent = hasDiscount ? calculateDiscountPercent(price, discountPrice) : 0;
  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn(sizes.current, hasDiscount ? "text-error" : "text-ink dark:text-cream")}>
        {formatMoney(hasDiscount && discountPrice !== undefined && discountPrice !== null ? discountPrice : price)}
      </span>
      {hasDiscount && (
        <>
          <span className={cn(sizes.original, "text-ink-light line-through")}>
            {formatMoney(price)}
          </span>
          <span
            className={cn(
              sizes.badge,
              "bg-error text-white px-1.5 py-0.5 rounded font-semibold"
            )}
          >
            -{percent}%
          </span>
        </>
      )}
    </div>
  );
}
