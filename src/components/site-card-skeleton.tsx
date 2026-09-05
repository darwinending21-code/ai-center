import { Skeleton } from "@/components/ui/skeleton";

export function SiteCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none">
      <div className="flex items-start gap-3">
        <Skeleton className="size-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function SiteGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SiteCardSkeleton key={index} />
      ))}
    </div>
  );
}
