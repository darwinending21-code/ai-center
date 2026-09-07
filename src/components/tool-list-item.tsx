import Link from "next/link";
import { SiteFavicon } from "@/components/site-favicon";
import { getFaviconUrl } from "@/lib/data";
import type { Site } from "@/lib/types";
import { cn } from "@/lib/utils";

type ToolListItemProps = {
  site: Site;
  className?: string;
};

export function ToolListItem({ site, className }: ToolListItemProps) {
  const summary = site.intro || site.desc || "优质 AI 工具";

  return (
    <Link
      href={`/tool/${site.slug}`}
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-transparent bg-card p-3 transition-all hover:border-blue-200 hover:bg-blue-50/60 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10",
        className,
      )}
    >
      <SiteFavicon src={getFaviconUrl(site)} title={site.title} size="sm" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {site.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-muted-foreground">
          {summary}
        </p>
      </div>
    </Link>
  );
}
