"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ComponentType,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  Command,
  Flame,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { DailyNewsPanel } from "@/components/daily-news";
import { FeaturedPromo } from "@/components/featured-promo";
import { ToolGridSkeleton } from "@/components/site-card-skeleton";
import { ToolListItem } from "@/components/tool-list-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategoryIcon } from "@/lib/category-icons";
import { getFaviconUrl } from "@/lib/data";
import { SiteFavicon } from "@/components/site-favicon";
import { cn } from "@/lib/utils";
import type { Category, Site } from "@/lib/types";
import type { DailyNewsItem } from "@/lib/news";

const PAGE_SIZE = 24;
const LOAD_DELAY_MS = 260;

const HOT_KEYWORDS = [
  "DeepSeek",
  "ChatGPT",
  "Claude",
  "Sora",
  "Midjourney",
  "通义千问",
  "Kimi",
  "豆包",
];

type HomeExplorerProps = {
  sites: Site[];
  categories: Category[];
  newsItems: DailyNewsItem[];
  newsTotalCount: number;
  stats: {
    siteCount: number;
    categoryCount: number;
    featuredCount: number;
  };
};

export function HomeExplorer({
  sites,
  categories,
  newsItems,
  newsTotalCount,
  stats,
}: HomeExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterPending, startFilterTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingLockRef = useRef(false);
  const toolsAnchorRef = useRef<HTMLElement | null>(null);

  const featured = useMemo(
    () => sites.filter((site) => site.star > 0).slice(0, 4),
    [sites],
  );

  const recommended = useMemo(
    () => sites.filter((site) => site.star > 0).slice(4, 10),
    [sites],
  );

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
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, visibleSites.length]);

  const handleCategoryChange = (category: string, scroll = false) => {
    startFilterTransition(() => {
      setActiveCategory(category);
    });
    if (scroll) {
      window.requestAnimationFrame(() => {
        toolsAnchorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  const showInitialLoading = isFilterPending || isSearching;

  return (
    <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)_240px] lg:gap-5 lg:px-6 lg:py-5">
      {/* Left category sidebar */}
      <aside
        id="categories"
        className="hidden h-fit scroll-mt-20 rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-16 lg:block"
      >
        <div className="mb-2 flex items-center justify-between px-2 py-1">
          <h2 className="text-sm font-semibold text-foreground">分类导航</h2>
          <Badge variant="secondary" className="rounded-md text-[10px]">
            {stats.categoryCount}
          </Badge>
        </div>
        <nav className="max-h-[calc(100vh-8rem)] space-y-0.5 overflow-y-auto pr-1">
          <SidebarItem
            label="全部工具"
            count={stats.siteCount}
            active={activeCategory === "全部"}
            onClick={() => handleCategoryChange("全部", true)}
            icon={Sparkles}
          />
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            return (
              <SidebarItem
                key={category.name}
                label={category.name}
                count={category.count}
                active={activeCategory === category.name}
                onClick={() => handleCategoryChange(category.name, true)}
                icon={Icon}
              />
            );
          })}
        </nav>
      </aside>

      {/* Center column */}
      <div className="min-w-0 space-y-4">
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5 dark:border-blue-500/20 dark:from-blue-950/40 dark:to-card sm:p-7">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              发现全球顶尖的 AI 工具与实用神器
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              已收录 {stats.siteCount} 款产品 · {stats.featuredCount} 个精选推荐
            </p>

            <div className="relative mx-auto mt-5 w-full max-w-xl">
              <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索工具名称、标签、能力场景…"
                className="h-11 rounded-xl border-border bg-background pl-10 pr-16 shadow-sm"
                aria-label="搜索 AI 工具"
              />
              <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-flex">
                <Command className="size-2.5" />K
              </kbd>
              {query ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-1/2 right-2 -translate-y-1/2 sm:right-14"
                  onClick={() => setQuery("")}
                  aria-label="清除搜索"
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-500">
                <Flame className="size-3.5" />
                热门
              </span>
              {HOT_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setQuery(keyword)}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-500/40 dark:hover:text-blue-400"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </section>

        {featured.length > 0 ? <FeaturedPromo sites={featured} /> : null}

        {newsItems.length > 0 ? (
          <div className="lg:hidden">
            <DailyNewsPanel
              items={newsItems.slice(0, 5)}
              totalCount={newsTotalCount}
              compact
            />
          </div>
        ) : null}

        <section
          id="tools"
          ref={toolsAnchorRef}
          className="scroll-mt-20 rounded-2xl border border-border bg-card p-3 sm:p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <h2 className="text-sm font-semibold text-foreground">工具目录</h2>
            <p className="text-xs text-muted-foreground">
              已加载 {Math.min(visibleCount, filtered.length)} / {filtered.length}
            </p>
          </div>

          <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
            <TabChip
              label="全部"
              active={activeCategory === "全部"}
              onClick={() => handleCategoryChange("全部")}
            />
            {categories.map((category) => (
              <TabChip
                key={category.name}
                label={category.name}
                active={activeCategory === category.name}
                onClick={() => handleCategoryChange(category.name)}
              />
            ))}
          </div>

          {showInitialLoading ? (
            <ToolGridSkeleton count={12} />
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
              <p className="font-medium text-foreground">没有找到匹配的工具</p>
              <p className="mt-1 text-sm text-muted-foreground">
                试试换个关键词，或切换到「全部」分类
              </p>
              <Button
                variant="outline"
                className="mt-4"
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
              <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleSites.map((site) => (
                  <ToolListItem key={site.slug} site={site} />
                ))}
              </div>

              {isLoadingMore ? (
                <div className="mt-3 space-y-3">
                  <ToolGridSkeleton count={4} />
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-blue-600" />
                    正在加载更多工具…
                  </div>
                </div>
              ) : null}

              {hasMore ? (
                <div ref={sentinelRef} className="h-8" aria-hidden />
              ) : (
                <p className="py-5 text-center text-xs text-muted-foreground">
                  已全部加载 · 共 {filtered.length} 个工具
                </p>
              )}
            </>
          )}
        </section>
      </div>

      {/* Right sidebar */}
      <aside className="hidden h-fit space-y-4 lg:sticky lg:top-16 lg:block">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">
            探索无限可能
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            精选全球 AI 工具，覆盖创作、办公、开发与学习场景。
          </p>
          <Link
            href="/#tools"
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1 rounded-xl bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            AI 工具导航
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/#featured"
            className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            精选 AI 工具
          </Link>
        </div>

        <div
          id="recommend"
          className="scroll-mt-20 rounded-2xl border border-border bg-card p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">推荐工具</h2>
            <Flame className="size-3.5 text-orange-500" />
          </div>
          <div className="space-y-2">
            {recommended.map((site) => (
              <Link
                key={site.slug}
                href={`/tool/${site.slug}`}
                className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-accent"
              >
                <SiteFavicon
                  src={getFaviconUrl(site)}
                  title={site.title}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {site.title}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {site.categories[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <DailyNewsPanel
          items={newsItems.slice(0, 6)}
          totalCount={newsTotalCount}
          compact
        />

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            热门标签
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {HOT_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => {
                  setQuery(keyword);
                  toolsAnchorRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="rounded-md border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function SidebarItem({
  label,
  count,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
        active
          ? "border-l-2 border-blue-600 bg-blue-50 font-medium text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-300"
          : "border-l-2 border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="text-[11px] tabular-nums opacity-70">{count}</span>
    </button>
  );
}

function TabChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
