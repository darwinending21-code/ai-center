import { Skeleton } from "@/components/ui/skeleton";

export function ToolListItemSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl p-3">
      <Skeleton className="size-8 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export function ToolGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ToolListItemSkeleton key={index} />
      ))}
    </div>
  );
}

/** @deprecated use ToolGridSkeleton */
export function SiteCardSkeleton() {
  return <ToolListItemSkeleton />;
}

/** @deprecated use ToolGridSkeleton */
export function SiteGridSkeleton({ count = 6 }: { count?: number }) {
  return <ToolGridSkeleton count={count} />;
}
