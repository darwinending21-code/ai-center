# AI Center

基于 `core-ai.json` 的 AI 导航站 — Next.js · Tailwind CSS · shadcn/ui。

## 功能

- 首页：搜索、分类筛选、工具卡片列表
- 详情页：`/tool/[slug]`，含介绍、标签、官网跳转与相关推荐
- 数据源：`src/core-ai.json`（约 829 个可见站点）

## 开始开发

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 目录

```
src/
  app/
    page.tsx              # 首页
    tool/[slug]/page.tsx  # 工具详情
  components/
    home-explorer.tsx     # 搜索与分类筛选
    site-card.tsx
    site-header.tsx
  lib/
    data.ts               # 数据加载与查询
    types.ts
  core-ai.json
```
