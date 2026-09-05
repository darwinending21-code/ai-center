import { Loader2 } from "lucide-react";

export default function ToolLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-blue-600 dark:text-blue-400" />
        正在加载工具详情…
      </div>
      <div className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
    </div>
  );
}
