import { Skeleton } from "./Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-ink rounded-card border border-cream-dark dark:border-ink-light/20 overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton variant="text" className="w-24 h-5" />
          <Skeleton variant="circle" className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
