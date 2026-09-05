import raw from "@/core-ai.json";
import type { Category, CategoryInfo, Site, SiteRaw } from "@/lib/types";

type CoreAiData = {
  categoryInfo: Record<string, CategoryInfo>;
  siteInfo: Record<string, SiteRaw>;
};

const data = raw as unknown as CoreAiData;

export function urlToSlug(url: string): string {
  try {
    const parsed = new URL(url);
    const base = `${parsed.hostname}${parsed.pathname}`
      .replace(/\/$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    return base || "site";
  } catch {
    return Buffer.from(url).toString("base64url").slice(0, 40);
  }
}

export function getFaviconUrl(site: Pick<Site, "url" | "icon">): string {
  if (site.icon) return site.icon;
  try {
    const hostname = new URL(site.url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "/favicon.ico";
  }
}

function normalizeSite(url: string, item: SiteRaw): Site | null {
  if (item.hide) return null;

  const title = item.title?.trim() || new URL(url).hostname;
  return {
    id: url,
    slug: urlToSlug(url),
    url,
    title,
    intro: item.intro?.trim() || "",
    desc: item.desc?.trim() || item.intro?.trim() || "",
    lang: item.lang ?? undefined,
    tags: item.tags ?? [],
    categories: item.type?.length ? item.type : ["未分类"],
    star: item.star ?? 0,
    needVPN: Boolean(item.needVPN),
    needLogin: Boolean(item.needLogin),
    needPay: Boolean(item.needPay),
    icon: item.icon ?? undefined,
    repo: item.repo ?? undefined,
    urls: item.urls ?? [],
    sort: item.sort ?? 0,
  };
}

function compareSites(a: Site, b: Site): number {
  if (b.star !== a.star) return b.star - a.star;
  if (a.sort !== b.sort) return a.sort - b.sort;
  return a.title.localeCompare(b.title, "zh-CN");
}

let cachedSites: Site[] | null = null;
let cachedBySlug: Map<string, Site> | null = null;

export function getAllSites(): Site[] {
  if (cachedSites) return cachedSites;

  const sites: Site[] = [];
  for (const [url, item] of Object.entries(data.siteInfo)) {
    try {
      const site = normalizeSite(url, item);
      if (site) sites.push(site);
    } catch {
      // skip invalid urls
    }
  }

  cachedSites = sites.sort(compareSites);
  return cachedSites;
}

export function getSiteBySlug(slug: string): Site | undefined {
  if (!cachedBySlug) {
    cachedBySlug = new Map(getAllSites().map((site) => [site.slug, site]));
  }
  return cachedBySlug.get(slug);
}

export function getCategories(): Category[] {
  const sites = getAllSites();
  const counts = new Map<string, number>();

  for (const site of sites) {
    for (const category of site.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  const known = Object.entries(data.categoryInfo).map(([name, info]) => ({
    name,
    sort: info.sort ?? 0,
    count: counts.get(name) ?? 0,
    keywords: info.keywords ?? [],
  }));

  const extras = [...counts.keys()]
    .filter((name) => !(name in data.categoryInfo))
    .map((name) => ({
      name,
      sort: 999,
      count: counts.get(name) ?? 0,
      keywords: [] as string[],
    }));

  return [...known, ...extras]
    .filter((category) => category.count > 0)
    .sort((a, b) => a.sort - b.sort || b.count - a.count);
}

export function getRelatedSites(site: Site, limit = 6): Site[] {
  return getAllSites()
    .filter((item) => item.slug !== site.slug)
    .map((item) => {
      const sharedCategories = item.categories.filter((category) =>
        site.categories.includes(category),
      ).length;
      const sharedTags = item.tags.filter((tag) =>
        site.tags.includes(tag),
      ).length;
      return {
        item,
        score: sharedCategories * 3 + sharedTags + item.star,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || compareSites(a.item, b.item))
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getSiteStats() {
  const sites = getAllSites();
  return {
    siteCount: sites.length,
    categoryCount: getCategories().length,
    featuredCount: sites.filter((site) => site.star > 0).length,
  };
}
