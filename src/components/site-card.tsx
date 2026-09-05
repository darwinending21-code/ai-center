import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteFavicon } from "@/components/site-favicon";
import { getFaviconUrl } from "@/lib/data";
import type { Site } from "@/lib/types";

type SiteCardProps = {
  site: Site;
};

export function SiteCard({ site }: SiteCardProps) {
  const summary = site.intro || site.desc || "暂无简介";

  return (
    <Link
      href={`/tool/${site.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] dark:shadow-none dark:hover:bg-accent/40 dark:hover:shadow-none"
    >
      <div className="flex items-start gap-3">
        <SiteFavicon src={getFaviconUrl(site)} title={site.title} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400">
              {site.title}
            </h3>
            {site.star > 0 ? (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                <Star className="size-3 fill-current" />
                {site.star}
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {summary}
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
        {site.categories.slice(0, 2).map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="rounded-md bg-muted text-muted-foreground"
          >
            {category}
          </Badge>
        ))}
        {site.needVPN ? (
          <Badge variant="outline" className="rounded-md">
            需翻墙
          </Badge>
        ) : null}
        <span className="ml-auto inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          查看
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
