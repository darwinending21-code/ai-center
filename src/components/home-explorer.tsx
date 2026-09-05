"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Loader2, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteCard } from "@/components/site-card";
import { SiteGridSkeleton } from "@/components/site-card-skeleton";
import { cn } from "@/lib/utils";
import type { Category, Site } from "@/lib/types";

const PAGE_SIZE = 24;
const LOAD_DELAY_MS = 280;

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
  const [activeCategory, setActiveCategory] = useState("全部");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterPending, startFilterTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingLockRef = useRef(false);

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

  const visibleSites = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const isSearching = query !== deferredQuery;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
    loadingLockRef.current = false;
  }, [activeCategory, deferredQuery]);

  const loadMore = useCallback(() => {
    if (loadingLockRef.current || !hasMore) return;

    loadingLockRef.current = true;
    setIsLoadingMore(true);

    window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length));
      setIsLoadingMore(false);
      loadingLockRef.current = false;
    }, LOAD_DELAY_MS);
  }, [filtered.length, hasMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, visibleSites.length]);

  const handleCategoryChange = (category: string) => {
    startFilterTransition(() => {
      setActiveCategory(category);
    });
  };

  const showInitialLoading = isFilterPending || isSearching;

  return (
    <div className="space-y-10">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-10xl font-semibold tracking-tight text-foreground sm:text-5xl">
          一站式发现优质{" "}
          <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
            AI 工具
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          覆盖 {stats.categoryCount} 个分类、{stats.siteCount}{" "}
          款产品，从聊天、绘图到编程办公，快速定位你需要的能力。
        </p>

        <div className="relative mx-auto mt-8 w-full max-w-2xl">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索工具名称、标签、能力场景…"
            className="h-12 rounded-2xl border-border bg-card pl-11 pr-11 text-[15px] shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-none"
            aria-label="搜索 AI 工具"
          />
          {query ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-2.5 -translate-y-1/2"
              onClick={() => setQuery("")}
              aria-label="清除搜索"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </section>

      <section id="categories" className="scroll-mt-24 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              按分类浏览
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              已加载 {Math.min(visibleCount, filtered.length)} /{" "}
              {filtered.length}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            label="全部"
            count={sites.length}
            active={activeCategory === "全部"}
            onClick={() => handleCategoryChange("全部")}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.name}
              label={category.name}
              count={category.count}
              active={activeCategory === category.name}
              onClick={() => handleCategoryChange(category.name)}
            />
          ))}
        </div>
      </section>

      <section id="tools" className="scroll-mt-24 space-y-5">
        {showInitialLoading ? (
          <SiteGridSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="text-lg font-semibold text-foreground">
              没有找到匹配的工具
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              试试换个关键词，或切换到「全部」分类
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setQuery("");
                handleCategoryChange("全部");
              }}
            >
              重置筛选
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleSites.map((site) => (
                <SiteCard key={site.slug} site={site} />
              ))}
            </div>

            {isLoadingMore ? (
              <div className="space-y-4 pt-2">
                <SiteGridSkeleton count={3} />
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin text-blue-600 dark:text-blue-400" />
                  正在加载更多工具…
                </div>
              </div>
            ) : null}

            {hasMore ? (
              <div
                ref={sentinelRef}
                className="flex h-10 items-center justify-center"
                aria-hidden
              />
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                已全部加载 · 共 {filtered.length} 个工具
              </p>
            )}
          </>
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
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-foreground bg-foreground text-background shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"
      )}
    >
      <span>{label}</span>
      <Badge
        variant="secondary"
        className={cn(
          "h-5 min-w-5 justify-center rounded-full px-1.5 text-[11px]",
          active
            ? "border-transparent bg-background/15 text-background"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </Badge>
    </button>
  );
}
