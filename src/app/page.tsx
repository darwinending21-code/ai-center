import { HomeExplorer } from "@/components/home-explorer";
import { getAllSites, getCategories, getSiteStats } from "@/lib/data";
import { fetchDailyNews } from "@/lib/news";

export default async function HomePage() {
  const sites = getAllSites();
  const categories = getCategories();
  const stats = getSiteStats();

  let newsItems: Awaited<ReturnType<typeof fetchDailyNews>>["list"] = [];
  let newsTotalCount = 0;

  try {
    const news = await fetchDailyNews(1);
    newsItems = news.list;
    newsTotalCount = news.totalCount;
  } catch {
    newsItems = [];
    newsTotalCount = 0;
  }

  return (
    <div className="bg-[#f5f7fb] dark:bg-background">
      <HomeExplorer
        sites={sites}
        categories={categories}
        newsItems={newsItems}
        newsTotalCount={newsTotalCount}
        stats={stats}
      />
    </div>
  );
}
