import Link from "next/link";
import { Hexagon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/#categories", label: "分类探索" },
  { href: "/#tools", label: "在线工具" },
  { href: "/news", label: "每日资讯" },
  { href: "/#featured", label: "热门榜单" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-4 px-4 lg:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
            <Hexagon className="size-3.5 fill-current" />
          </span>
          <span className="text-[15px]">
            AI<span className="text-blue-600 dark:text-blue-400">Center</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/#tools"
            className="hidden h-8 items-center rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            登录
          </Link>
          <Link
            href="/#tools"
            className="inline-flex h-8 items-center rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            注册
          </Link>
        </div>
      </div>
    </header>
  );
}
