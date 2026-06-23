import { cn } from "@/utils/cn";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  onChange?: (v: number) => void;
  className?: string;
}

const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-6 h-6" };

export function StarRating({ value, max = 5, size = "md", onChange, className }: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {stars.map((star) => {
        const filled = value >= star;
        const half = !filled && value >= star - 0.5;
        return (
          <button
            key={star}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(star)}
            className={cn(
              "relative transition-transform",
              onChange && "hover:scale-110 cursor-pointer",
              !onChange && "cursor-default pointer-events-none"
            )}
            aria-label={`${star} yulduz`}
          >
            <svg
              viewBox="0 0 24 24"
              className={cn(sizes[size], filled || half ? "text-amber-400" : "text-gray-300")}
              fill="currentColor"
            >
              {half ? (
                <>
                  <defs>
                    <linearGradient id={`half-${star}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={`url(#half-${star})`}
                    stroke="#fbbf24"
                    strokeWidth="1"
                  />
                </>
              ) : (
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              )}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
