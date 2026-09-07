import type { DailyNewsItem } from "@/lib/news";

export const NEWS_FILTERS = [
  { key: "全部", label: "全部资讯" },
  { key: "行业动态", label: "行业动态" },
  { key: "产品发布", label: "产品发布" },
  { key: "技术突破", label: "技术突破" },
  { key: "融资快讯", label: "融资快讯" },
  { key: "政策监管", label: "政策监管" },
] as const;

export type NewsFilterKey = (typeof NEWS_FILTERS)[number]["key"];

const FILTER_RULES: Record<Exclude<NewsFilterKey, "全部">, string[]> = {
  行业动态: ["日报", "行业", "市场", "营收", "商业化", "IPO", "开幕", "亮相"],
  产品发布: ["发布", "上线", "推出", "首发", "正式版", "登场", "开源"],
  技术突破: ["模型", "开源", "突破", "升级", "参数", "多模态", "Agent", "芯片"],
  融资快讯: ["融资", "收购", "投资", "亿美元", "亿元", "估值"],
  政策监管: ["网信办", "整治", "监管", "政策", "法律", "诉讼", "合规"],
};

export function inferNewsTag(item: DailyNewsItem): Exclude<NewsFilterKey, "全部"> {
  const text = `${item.title} ${item.subtitle} ${item.description}`;
  for (const [tag, keywords] of Object.entries(FILTER_RULES) as [
    Exclude<NewsFilterKey, "全部">,
    string[],
  ][]) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return tag;
    }
  }
  return "行业动态";
}

export function matchesNewsFilter(item: DailyNewsItem, filter: NewsFilterKey) {
  if (filter === "全部") return true;
  return inferNewsTag(item) === filter;
}

export const NEWS_HOT_TAGS = [
  "大模型",
  "OpenAI",
  "DeepSeek",
  "Gemini",
  "智能体",
  "多模态",
  "开源",
  "机器人",
  "AI芯片",
  "融资",
];
