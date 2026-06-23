import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-cream-dark dark:border-ink-light/20 bg-white dark:bg-ink p-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-light">{label}</span>
        {icon && (
          <div className="w-9 h-9 rounded-btn bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-ink dark:text-cream">{value}</p>
      {trend !== undefined && (
        <p className={cn("text-xs font-medium", trend.positive ? "text-success" : "text-error")}>
          {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </p>
      )}
    </div>
  );
}
