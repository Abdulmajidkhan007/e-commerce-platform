import { cn } from "@/utils/cn";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
  className?: string;
}

const sizeClasses = { sm: "text-sm", md: "text-base", lg: "text-xl" };

export function Rating({
  value,
  max = 5,
  size = "md",
  showCount = false,
  count,
  className,
}: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className={cn("flex", sizeClasses[size])} aria-label={`${value} yulduz`}>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={i < Math.floor(value) ? "text-yellow-400" : "text-brand-200"}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-ink-light">({count})</span>
      )}
    </div>
  );
}
