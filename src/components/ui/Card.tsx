import { cn } from "@/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hoverable?: boolean;
}

export function Card({ children, className, padding = true, hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-brand-900/20 rounded-card shadow-card",
        padding && "p-6",
        hoverable && "transition-shadow duration-base hover:shadow-elevated cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
