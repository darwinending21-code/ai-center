"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  Loader2,
  Newspaper,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  NEWS_FILTERS,
  NEWS_HOT_TAGS,
  inferNewsTag,
  matchesNewsFilter,
  type NewsFilterKey,
} from "@/lib/news-filters";
import { formatNewsTime, type DailyNewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";

type DailyNewsPanelProps = {
  items: DailyNewsItem[];
  totalCount?: number;
  compact?: boolean;
};

export function DailyNewsPanel({
  items,
  totalCount,
  compact = false,
}: DailyNewsPanelProps) {
  const [active, setActive] = useState<DailyNewsItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Newspaper className="size-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-foreground">AI 每日资讯</h2>
        </div>
        <p className="text-xs text-muted-foreground">暂无资讯，稍后再试</p>
      </div>
    );
  }

  return (
    <>
      <div
        id="news"
        className="scroll-mt-20 rounded-2xl border border-border bg-card p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Newspaper className="size-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-foreground">AI 每日资讯</h2>
          </div>
          {typeof totalCount === "number" ? (
            <Badge variant="secondary" className="rounded-md text-[10px]">
              {totalCount}
            </Badge>
          ) : null}
        </div>

        <div className={compact ? "space-y-2.5" : "space-y-3"}>
          {items.map((item) => (
            <button
              key={item.oid}
              type="button"
              onClick={() => setActive(item)}
              className="group flex w-full gap-2.5 rounded-xl p-1.5 text-left transition-colors hover:bg-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumb}
                alt=""
                width={64}
                height={48}
                loading="lazy"
                className="h-12 w-16 shrink-0 rounded-lg object-cover ring-1 ring-border/70"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium leading-5 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.subtitle || item.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="truncate">{item.sourceName || "AI 资讯"}</span>
                  <span>·</span>
                  <span className="shrink-0">
                    {formatNewsTime(item.createTime)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Link
          href="/news"
          className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-xl border border-border text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          查看更多资讯
        </Link>
      </div>

      <NewsDetailDialog active={active} onClose={() => setActive(null)} />
    </>
  );
}

type DailyNewsFeedProps = {
  initialItems: DailyNewsItem[];
  initialPage: number;
  totalPage: number;
  totalCount: number;
};

export function DailyNewsFeed({
  initialItems,
  initialPage,
  totalPage,
  totalCount,
}: DailyNewsFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<DailyNewsItem | null>(null);
  const [filter, setFilter] = useState<NewsFilterKey>("全部");
  const [query, setQuery] = useState("");
  const hasMore = page < totalPage;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (!matchesNewsFilter(item, filter)) return false;
      if (!q) return true;
      return `${item.title} ${item.subtitle} ${item.description}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, filter, query]);

  const recommendations = items.slice(0, 5);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/news?pageNo=${nextPage}`);
      const json = await res.json();
      if (json.code === 200 && json.data?.list) {
        setItems((prev) => [...prev, ...json.data.list]);
        setPage(nextPage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-w-0 space-y-4">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            首页
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">每日 AI 资讯</span>
        </nav>

        <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0b1220_0%,#1a1040_55%,#0f172a_100%)] px-6 py-8 text-white shadow-sm sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(96,165,250,0.25),transparent_40%)]"
          />
          <div className="relative">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              每日 AI 资讯
            </h1>
            <p className="mt-1 text-sm tracking-[0.18em] text-white/55 uppercase">
              AICENTER.NEWS
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85 ring-1 ring-white/10">
              <CalendarDays className="size-4" />
              追踪技术前沿 · 掌握全球 AI 最新动态
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {NEWS_FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                    filter === item.key
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-56">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索资讯…"
                className="h-9 rounded-full bg-background pl-9 pr-9 text-sm"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="清除搜索"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-2 px-1 text-xs text-muted-foreground">
            共 {totalCount} 条 · 当前显示 {filtered.length} 条
          </div>

          <div className="mt-2 divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="px-2 py-14 text-center">
                <p className="font-medium text-foreground">没有匹配的资讯</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  试试切换分类或更换关键词
                </p>
              </div>
            ) : (
              filtered.map((item) => {
                const tag = inferNewsTag(item);
                return (
                  <button
                    key={item.oid}
                    type="button"
                    onClick={() => setActive(item)}
                    className="group flex w-full gap-4 px-2 py-4 text-left transition-colors hover:bg-accent/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumb}
                      alt=""
                      width={140}
                      height={96}
                      loading="lazy"
                      className="h-20 w-28 shrink-0 rounded-xl object-cover ring-1 ring-border/70 sm:h-24 sm:w-36"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-2 text-base font-semibold leading-7 text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.subtitle || item.title}
                      </h2>
                      <span className="mt-2 inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                        {tag}
                      </span>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{item.createTime}</span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="size-3" />
                          {item.pv.toLocaleString()} 阅读
                        </span>
                        <span>{item.sourceName}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {hasMore ? (
            <div className="flex justify-center border-t border-border pt-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
                className="min-w-36 rounded-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    加载中…
                  </>
                ) : (
                  "加载更多资讯"
                )}
              </Button>
            </div>
          ) : filtered.length > 0 ? (
            <p className="border-t border-border py-4 text-center text-xs text-muted-foreground">
              已加载全部资讯
            </p>
          ) : null}
        </section>
      </div>

      <aside className="hidden h-fit space-y-4 lg:sticky lg:top-16 lg:block">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">探索无限可能</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            浏览全球优质 AI 工具，覆盖创作、办公、开发与学习场景。
          </p>
          <Link
            href="/#tools"
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1 rounded-xl bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            AI 工具导航
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">热门标签</h2>
          <div className="flex flex-wrap gap-2">
            {NEWS_HOT_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="rounded-md px-1.5 py-0.5 text-sm text-muted-foreground transition-colors hover:text-blue-600"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">今日推荐</h2>
          <div className="space-y-3">
            {recommendations.map((item) => (
              <button
                key={item.oid}
                type="button"
                onClick={() => setActive(item)}
                className="group flex w-full gap-2.5 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumb}
                  alt=""
                  className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-border/70"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-5 text-foreground group-hover:text-blue-600">
                    {item.subtitle || item.title}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {item.createTime.slice(0, 10)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <NewsDetailDialog active={active} onClose={() => setActive(null)} />
    </>
  );
}

function NewsDetailDialog({
  active,
  onClose,
}: {
  active: DailyNewsItem | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={Boolean(active)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {active ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-left leading-7">
                {active.title}
              </DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2 text-left">
                <span>{active.sourceName || "AI 资讯"}</span>
                <span>·</span>
                <span>{active.createTime}</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3" />
                  {active.pv.toLocaleString()}
                </span>
              </DialogDescription>
            </DialogHeader>
            {active.thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.thumb}
                alt=""
                className="mt-2 max-h-52 w-full rounded-xl object-cover"
              />
            ) : null}
            <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
              {active.description}
            </p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
