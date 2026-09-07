import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFavicon } from "@/components/site-favicon";
import { getFaviconUrl } from "@/lib/data";
import type { Site } from "@/lib/types";
import { cn } from "@/lib/utils";

const PROMO_STYLES = [
  "from-[#1a1033] via-[#2b1654] to-[#120b24] ring-violet-400/20",
  "from-[#06251c] via-[#0d3b2e] to-[#041912] ring-emerald-400/20",
  "from-[#101828] via-[#1d2939] to-[#0b1220] ring-sky-400/20",
  "from-[#2a1208] via-[#4a1d0c] to-[#180a05] ring-orange-400/20",
];

type FeaturedPromoProps = {
  sites: Site[];
};

export function FeaturedPromo({ sites }: FeaturedPromoProps) {
  return (
    <div
      id="featured"
      className="grid scroll-mt-20 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {sites.slice(0, 4).map((site, index) => (
        <Link
          key={site.slug}
          href={`/tool/${site.slug}`}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white ring-1 transition-transform hover:-translate-y-0.5",
            PROMO_STYLES[index % PROMO_STYLES.length],
          )}
        >
          <div className="flex items-start gap-3">
            <SiteFavicon
              src={getFaviconUrl(site)}
              title={site.title}
              size="sm"
              className="ring-white/20"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold">{site.title}</h3>
                <ArrowUpRight className="size-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/70">
                {site.intro || site.desc || "精选推荐工具"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
