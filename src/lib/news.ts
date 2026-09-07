export type DailyNewsItem = {
  title: string;
  subtitle: string;
  thumb: string;
  sourceName: string;
  author: string;
  description: string;
  oid: number;
  createTime: string;
  pv: number;
};

export type DailyNewsResult = {
  list: DailyNewsItem[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPage: number;
  hasMore: boolean;
};

type DailyNewsApiResponse = {
  code: number;
  msg: string;
  data?: {
    list?: DailyNewsItem[];
    totalCount?: number;
    pageNo?: number;
    pageSize?: number;
    totalPage?: number;
    lastPage?: boolean;
  };
};

const NEWS_API = "https://mcpapi.aibase.cn/api/aiInfo/dailyNews";

export async function fetchDailyNews(
  pageNo = 1,
  langType = "zh_cn",
  options?: { revalidate?: number | false },
): Promise<DailyNewsResult> {
  const t = Math.floor(Date.now() / 1000);
  const url = `${NEWS_API}?t=${t}&langType=${langType}&pageNo=${pageNo}`;

  const response = await fetch(url, {
    ...(options?.revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate: options?.revalidate ?? 300 } }),
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Daily news request failed: ${response.status}`);
  }

  const json = (await response.json()) as DailyNewsApiResponse;
  if (json.code !== 200 || !json.data) {
    throw new Error(json.msg || "Daily news API error");
  }

  const list = json.data.list ?? [];
  const totalPage = json.data.totalPage ?? 1;
  const currentPage = json.data.pageNo ?? pageNo;

  return {
    list,
    totalCount: json.data.totalCount ?? list.length,
    pageNo: currentPage,
    pageSize: json.data.pageSize ?? list.length,
    totalPage,
    hasMore: !json.data.lastPage && currentPage < totalPage,
  };
}

export function formatNewsTime(value: string) {
  const date = new Date(value.replace(/-/g, "/"));
  if (Number.isNaN(date.getTime())) return value;

  const now = Date.now();
  const diff = now - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) {
    const mins = Math.max(1, Math.floor(diff / minute));
    return `${mins} 分钟前`;
  }
  if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`;
  }
  if (diff < 7 * day) {
    return `${Math.floor(diff / day)} 天前`;
  }

  return value.slice(0, 10);
}
