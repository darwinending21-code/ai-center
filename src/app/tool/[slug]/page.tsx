import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
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
import { Button } from "@/components/ui/button";
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
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.12),_transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2"
          render={<Link href="/" />}
        >
          <ArrowLeft data-icon="inline-start" />
          返回首页
        </Button>

        <article className="rounded-3xl border border-teal-900/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <SiteFavicon
              src={getFaviconUrl(site)}
              title={site.title}
              size="lg"
            />

            <div className="min-w-0 flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                    {site.title}
                  </h1>
                  {site.star > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
                      <Star className="size-3.5 fill-current" />
                      精选 {site.star}
                    </span>
                  ) : null}
                </div>
                {site.intro ? (
                  <p className="text-lg text-slate-600">{site.intro}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {site.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
                {site.needVPN ? (
                  <Badge variant="outline">
                    <Shield data-icon="inline-start" />
                    需翻墙
                  </Badge>
                ) : null}
                {site.needLogin ? (
                  <Badge variant="outline">
                    <KeyRound data-icon="inline-start" />
                    需登录
                  </Badge>
                ) : null}
                {site.needPay ? (
                  <Badge variant="outline">
                    <WalletCards data-icon="inline-start" />
                    付费
                  </Badge>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  size="lg"
                  render={
                    <a href={site.url} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  访问官网
                  <ExternalLink data-icon="inline-end" />
                </Button>
                {site.repo ? (
                  <Button
                    variant="outline"
                    size="lg"
                    render={
                      <a
                        href={`https://github.com/${site.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <ExternalLink data-icon="inline-start" />
                    开源仓库
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">工具介绍</h2>
              <p className="text-muted-foreground leading-7 whitespace-pre-wrap">
                {site.desc || site.intro || "暂无详细介绍。"}
              </p>
            </section>

            <aside className="space-y-5 rounded-2xl bg-teal-50/70 p-5 ring-1 ring-teal-900/8">
              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-500">
                  官网地址
                </h3>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-sm text-teal-900 hover:underline"
                >
                  <Globe2 className="mt-0.5 size-4 shrink-0" />
                  <span className="break-all">{hostname}</span>
                </a>
              </div>

              {site.urls.length > 0 ? (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-slate-500">
                    备用链接
                  </h3>
                  <ul className="space-y-1.5">
                    {site.urls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-sm text-teal-900 hover:underline"
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
                  <h3 className="mb-2 text-sm font-medium text-slate-500">
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {site.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {site.lang ? (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-slate-500">
                    语言
                  </h3>
                  <p className="text-sm text-slate-800 uppercase">{site.lang}</p>
                </div>
              ) : null}
            </aside>
          </div>
        </article>

        {related.length > 0 ? (
          <section className="mt-12 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">相关推荐</h2>
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
