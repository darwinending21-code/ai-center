import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-[0.18em] text-blue-600 uppercase dark:text-blue-400">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        找不到这个工具
      </h1>
      <p className="mt-3 text-muted-foreground">
        链接可能已失效，或该工具已被下架。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-xl bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        返回首页
      </Link>
    </div>
  );
}
