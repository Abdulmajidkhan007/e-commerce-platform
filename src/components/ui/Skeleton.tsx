import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-brand-100 dark:bg-brand-900/30",
        variant === "circle" && "rounded-full",
        variant === "text" && "rounded h-4",
        variant === "rect" && "rounded-card",
        className
      )}
    />
  );
}
