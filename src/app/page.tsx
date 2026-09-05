import { HomeExplorer } from "@/components/home-explorer";
import { getAllSites, getCategories, getSiteStats } from "@/lib/data";

export default function HomePage() {
  const sites = getAllSites();
  const categories = getCategories();
  const stats = getSiteStats();

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.12),transparent),linear-gradient(180deg,#eef4ff_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.16),transparent),linear-gradient(180deg,rgba(15,23,42,0.65)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl dark:bg-blue-500/10"
      />

      <section className="relative mx-auto w-full max-w-7xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
        <HomeExplorer sites={sites} categories={categories} stats={stats} />
      </section>
    </div>
  );
}
