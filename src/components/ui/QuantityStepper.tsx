import { cn } from "@/utils/cn";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
  size?: "sm" | "md";
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
  size = "md",
}: QuantityStepperProps) {
  const btnClass = cn(
    "flex items-center justify-center rounded font-bold transition-colors",
    "hover:bg-brand-100 active:bg-brand-200 disabled:opacity-40 disabled:cursor-not-allowed",
    size === "sm" ? "h-7 w-7 text-sm" : "h-9 w-9 text-base"
  );

  return (
    <div
      className={cn(
        "inline-flex items-center border border-cream-dark dark:border-ink-light/40 rounded-btn overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className={btnClass}
        aria-label="Kamayish"
      >
        −
      </button>
      <span
        className={cn(
          "flex items-center justify-center font-medium text-ink dark:text-cream border-x border-cream-dark dark:border-ink-light/40",
          size === "sm" ? "w-8 text-sm" : "w-10 text-base"
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={btnClass}
        aria-label="Ko'paytirish"
      >
        +
      </button>
    </div>
  );
}
