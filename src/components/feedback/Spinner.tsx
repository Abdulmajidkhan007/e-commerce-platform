import { cn } from "@/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Yuklanmoqda"
      className={cn(
        "animate-spin rounded-full border-brand-200 border-t-brand-500",
        sizeClasses[size],
        className
      )}
    />
  );
}
