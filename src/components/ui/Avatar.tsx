import { cn } from "@/utils/cn";
import { getInitials } from "@/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function Avatar({ src, firstName = "?", lastName = "", size = "md", className }: AvatarProps) {
  const initials = getInitials(firstName, lastName);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-brand-200 text-brand-700 font-semibold shrink-0",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={`${firstName} ${lastName}`} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
