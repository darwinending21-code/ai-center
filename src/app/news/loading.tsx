import { Loader2 } from "lucide-react";

export default function NewsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] items-center gap-2 px-4 py-16 text-sm text-muted-foreground lg:px-6">
      <Loader2 className="size-4 animate-spin text-blue-600" />
      正在加载 AI 每日资讯…
    </div>
  );
}
