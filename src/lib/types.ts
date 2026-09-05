export type CategoryInfo = {
  keywords?: string[];
  sort?: number;
};

export type SiteRaw = {
  title?: string | null;
  intro?: string | null;
  desc?: string | null;
  lang?: string | null;
  tags?: string[] | null;
  type?: string[] | null;
  star?: number | null;
  needVPN?: number | null;
  needVerify?: number | null;
  needLogin?: number | null;
  needKey?: number | null;
  needPay?: number | null;
  needPwd?: number | null;
  sort?: number | null;
  hide?: number | boolean | null;
  icon?: string | null;
  repo?: string | null;
  source?: string | null;
  urls?: string[] | null;
  nav?: string | null;
  errmsg?: string | null;
};

export type Site = {
  id: string;
  slug: string;
  url: string;
  title: string;
  intro: string;
  desc: string;
  lang?: string;
  tags: string[];
  categories: string[];
  star: number;
  needVPN: boolean;
  needLogin: boolean;
  needPay: boolean;
  icon?: string;
  repo?: string;
  urls: string[];
  sort: number;
};

export type Category = {
  name: string;
  sort: number;
  count: number;
  keywords: string[];
};
