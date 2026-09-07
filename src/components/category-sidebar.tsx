import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

type CategorySidebarProps = {
  categories: Category[];
  siteCount: number;
  activeName?: string;
};

export function CategorySidebar({
  categories,
  siteCount,
  activeName,
}: CategorySidebarProps) {
  return (
    <aside className="hidden h-fit rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-16 lg:block">
      <div className="mb-2 flex items-center justify-between px-2 py-1">
        <h2 className="text-sm font-semibold text-foreground">分类导航</h2>
        <Badge variant="secondary" className="rounded-md text-[10px]">
          {categories.length}
        </Badge>
      </div>
      <nav className="max-h-[calc(100vh-8rem)] space-y-0.5 overflow-y-auto pr-1">
        <Link
          href="/#tools"
          className={cn(
            "flex w-full items-center gap-2 rounded-xl border-l-2 px-2.5 py-2 text-left text-sm transition-colors",
            !activeName
              ? "border-blue-600 bg-blue-50 font-medium text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <Sparkles className="size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate">全部工具</span>
          <span className="text-[11px] tabular-nums opacity-70">{siteCount}</span>
        </Link>
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const active = activeName === category.name;
          return (
            <Link
              key={category.name}
              href={`/?category=${encodeURIComponent(category.name)}#tools`}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border-l-2 px-2.5 py-2 text-left text-sm transition-colors",
                active
                  ? "border-blue-600 bg-blue-50 font-medium text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-300"
                  : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{category.name}</span>
              <span className="text-[11px] tabular-nums opacity-70">
                {category.count}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
