import { ORDER_STATUSES } from "@/constants";

interface StatusBadgeProps {
  status: string;
  labelMap?: Record<string, string>;
}

export function StatusBadge({ status, labelMap }: StatusBadgeProps) {
  const meta = ORDER_STATUSES.find((s) => s.value === status);
  const label = labelMap?.[status] ?? status;

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{
        color: meta?.color ?? "#6b7280",
        backgroundColor: meta?.bgColor ?? "#f3f4f6",
      }}
    >
      {label}
    </span>
  );
}
