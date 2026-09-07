import type { Metadata } from "next";
import { CategorySidebar } from "@/components/category-sidebar";
import { DailyNewsFeed } from "@/components/daily-news";
import { getCategories, getSiteStats } from "@/lib/data";
import { fetchDailyNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "每日 AI 资讯",
  description: "追踪技术前沿，掌握全球 AI 最新动态",
};

export default async function NewsPage() {
  const categories = getCategories();
  const stats = getSiteStats();

  let news;

  try {
    news = await fetchDailyNews(1);
  } catch {
    news = {
      list: [],
      totalCount: 0,
      pageNo: 1,
      pageSize: 20,
      totalPage: 1,
      hasMore: false,
    };
  }

  return (
    <div className="bg-[#f5f7fb] dark:bg-background">
      <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)_240px] lg:gap-5 lg:px-6 lg:py-5">
        <CategorySidebar
          categories={categories}
          siteCount={stats.siteCount}
        />

        {news.list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center lg:col-span-2">
            <h1 className="text-xl font-semibold text-foreground">
              每日 AI 资讯
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              资讯暂时无法加载，请稍后刷新重试。
            </p>
          </div>
        ) : (
          <DailyNewsFeed
            initialItems={news.list}
            initialPage={news.pageNo}
            totalPage={news.totalPage}
            totalCount={news.totalCount}
          />
        )}
      </div>
    </div>
  );
}
