import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink dark:text-cream">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-btn border bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream",
              "placeholder:text-ink-light/60 transition-colors duration-fast",
              "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error ? "border-error focus:ring-error" : "border-cream-dark dark:border-ink-light/40",
              leftIcon ? "pl-9" : undefined,
              rightIcon ? "pr-9" : undefined,
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-ink-light">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
