import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteFavicon } from "@/components/site-favicon";
import { getFaviconUrl } from "@/lib/data";
import type { Site } from "@/lib/types";

type SiteCardProps = {
  site: Site;
};

export function SiteCard({ site }: SiteCardProps) {
  const summary = site.intro || site.desc || "暂无简介";

  return (
    <Link href={`/tool/${site.slug}`} className="group block h-full">
      <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:ring-teal-700/25">
        <CardHeader className="gap-3">
          <div className="flex items-start gap-3">
            <SiteFavicon
              src={getFaviconUrl(site)}
              title={site.title}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-1 group-hover:text-teal-800">
                  {site.title}
                </CardTitle>
                {site.star > 0 ? (
                  <span className="text-amber-600 inline-flex shrink-0 items-center gap-0.5 text-xs font-medium">
                    <Star className="size-3 fill-current" />
                    {site.star}
                  </span>
                ) : null}
              </div>
              <CardDescription className="mt-1 line-clamp-2">
                {summary}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-1.5 pt-0">
          {site.categories.slice(0, 2).map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
          {site.needVPN ? (
            <Badge variant="outline">需翻墙</Badge>
          ) : null}
          <span className="text-muted-foreground ml-auto inline-flex items-center gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
            详情
            <ExternalLink className="size-3" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
