import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-medium tracking-[0.18em] text-teal-800 uppercase">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        找不到这个工具
      </h1>
      <p className="text-muted-foreground mt-3">
        链接可能已失效，或该工具已被下架。
      </p>
      <Button className="mt-6" render={<Link href="/" />}>
        返回首页
      </Button>
    </div>
  );
}
