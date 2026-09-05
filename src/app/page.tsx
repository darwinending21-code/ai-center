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
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.12),_transparent_60%),linear-gradient(180deg,_#e8f5f1_0%,_transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(15,118,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <section className="relative mx-auto w-full max-w-7xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        <HomeExplorer sites={sites} categories={categories} stats={stats} />
      </section>
    </div>
  );
}
