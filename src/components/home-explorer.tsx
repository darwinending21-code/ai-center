"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteCard } from "@/components/site-card";
import { cn } from "@/lib/utils";
import type { Category, Site } from "@/lib/types";

type HomeExplorerProps = {
  sites: Site[];
  categories: Category[];
  stats: {
    siteCount: number;
    categoryCount: number;
    featuredCount: number;
  };
};

export function HomeExplorer({ sites, categories, stats }: HomeExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();

    return sites.filter((site) => {
      const matchCategory =
        activeCategory === "全部" || site.categories.includes(activeCategory);

      if (!matchCategory) return false;
      if (!q) return true;

      const haystack = [
        site.title,
        site.intro,
        site.desc,
        ...site.tags,
        ...site.categories,
        site.url,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [sites, activeCategory, deferredQuery]);

  return (
    <div className="space-y-10">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium tracking-[0.18em] text-teal-800 uppercase">
          AI Center
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          发现值得用的 AI 工具
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base sm:text-lg">
          收录 {stats.siteCount} 个优质资源，覆盖 {stats.categoryCount}{" "}
          个分类，快速直达聊天、绘图、编程与办公助手。
        </p>

        <div className="relative mx-auto mt-8 w-full max-w-2xl">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索工具名称、标签、简介…"
            className="h-12 rounded-xl border-teal-900/10 bg-white/90 pl-10 pr-10 shadow-sm"
            aria-label="搜索 AI 工具"
          />
          {query ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-2 -translate-y-1/2"
              onClick={() => setQuery("")}
              aria-label="清除搜索"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </section>

      <section id="categories" className="scroll-mt-20 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">分类浏览</h2>
          <p className="text-muted-foreground text-sm">
            共 {filtered.length} 个结果
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            label="全部"
            count={sites.length}
            active={activeCategory === "全部"}
            onClick={() => setActiveCategory("全部")}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.name}
              label={category.name}
              count={category.count}
              active={activeCategory === category.name}
              onClick={() => setActiveCategory(category.name)}
            />
          ))}
        </div>
      </section>

      <section id="tools" className="scroll-mt-20 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-teal-900/15 bg-white/50 px-6 py-16 text-center">
            <p className="text-lg font-medium">没有找到匹配的工具</p>
            <p className="text-muted-foreground mt-2 text-sm">
              试试换个关键词，或切换到「全部」分类
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setActiveCategory("全部");
              }}
            >
              重置筛选
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((site) => (
              <SiteCard key={site.slug} site={site} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-teal-800 bg-teal-800 text-white"
          : "border-teal-900/10 bg-white/70 text-foreground hover:border-teal-700/30 hover:bg-teal-50",
      )}
    >
      <span>{label}</span>
      <Badge
        variant={active ? "secondary" : "outline"}
        className={cn(
          "h-5 min-w-5 justify-center px-1.5",
          active && "border-transparent bg-white/20 text-white",
        )}
      >
        {count}
      </Badge>
    </button>
  );
}
