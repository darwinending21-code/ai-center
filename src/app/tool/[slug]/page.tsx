import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Globe2,
  KeyRound,
  Shield,
  Star,
  WalletCards,
} from "lucide-react";
import { SiteCard } from "@/components/site-card";
import { SiteFavicon } from "@/components/site-favicon";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getAllSites,
  getFaviconUrl,
  getRelatedSites,
  getSiteBySlug,
} from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSites().map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = getSiteBySlug(slug);
  if (!site) {
    return { title: "工具未找到" };
  }

  return {
    title: site.title,
    description: site.intro || site.desc || `${site.title} 工具详情`,
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const site = getSiteBySlug(slug);
  if (!site) notFound();

  const related = getRelatedSites(site);
  const hostname = (() => {
    try {
      return new URL(site.url).hostname;
    } catch {
      return site.url;
    }
  })();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_70%_60%_at_50%_-20%,rgba(37,99,235,0.12),transparent)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_-20%,rgba(59,130,246,0.18),transparent)]"
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          返回首页
        </Link>

        <article className="rounded-3xl border border-border/80 bg-card p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-none sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <SiteFavicon
              src={getFaviconUrl(site)}
              title={site.title}
              size="lg"
            />

            <div className="min-w-0 flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    {site.title}
                  </h1>
                  {site.star > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 ring-1 ring-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30">
                      <Star className="size-3.5 fill-current" />
                      精选 {site.star}
                    </span>
                  ) : null}
                </div>
                {site.intro ? (
                  <p className="text-lg leading-7 text-muted-foreground">
                    {site.intro}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {site.categories.map((category) => (
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
                    <Shield className="size-3" />
                    需翻墙
                  </Badge>
                ) : null}
                {site.needLogin ? (
                  <Badge variant="outline" className="rounded-md">
                    <KeyRound className="size-3" />
                    需登录
                  </Badge>
                ) : null}
                {site.needPay ? (
                  <Badge variant="outline" className="rounded-md">
                    <WalletCards className="size-3" />
                    付费
                  </Badge>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  访问官网
                  <ArrowUpRight className="size-4" />
                </a>
                {site.repo ? (
                  <a
                    href={`https://github.com/${site.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <ExternalLink className="size-4" />
                    开源仓库
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                工具介绍
              </h2>
              <p className="leading-7 whitespace-pre-wrap text-muted-foreground">
                {site.desc || site.intro || "暂无详细介绍。"}
              </p>
            </section>

            <aside className="space-y-5 rounded-2xl border border-border bg-muted/50 p-5">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  官网地址
                </h3>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
                >
                  <Globe2 className="mt-0.5 size-4 shrink-0" />
                  <span className="break-all">{hostname}</span>
                </a>
              </div>

              {site.urls.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    备用链接
                  </h3>
                  <ul className="space-y-1.5">
                    {site.urls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-sm text-blue-700 hover:underline dark:text-blue-400"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {site.tags.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {site.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {site.lang ? (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    语言
                  </h3>
                  <p className="text-sm font-medium text-foreground uppercase">
                    {site.lang}
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </article>

        {related.length > 0 ? (
          <section className="mt-12 space-y-5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              相关推荐
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <SiteCard key={item.slug} site={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
