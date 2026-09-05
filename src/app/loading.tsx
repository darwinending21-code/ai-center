import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24">
      <Loader2 className="size-8 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-sm text-muted-foreground">页面加载中…</p>
    </div>
  );
}
