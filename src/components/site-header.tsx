import Link from "next/link";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-teal-900/8 bg-[#f4faf8]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-teal-800 text-white">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg">
            AI <span className="text-teal-800">Center</span>
          </span>
        </Link>
        <nav className="text-muted-foreground flex items-center gap-4 text-sm">
          <Link href="/#categories" className="hover:text-foreground transition-colors">
            分类
          </Link>
          <Link href="/#tools" className="hover:text-foreground transition-colors">
            工具
          </Link>
        </nav>
      </div>
    </header>
  );
}
