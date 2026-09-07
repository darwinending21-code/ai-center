import { NextResponse } from "next/server";
import { fetchDailyNews } from "@/lib/news";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageNo = Number(searchParams.get("pageNo") || "1");
  const safePage = Number.isFinite(pageNo) && pageNo > 0 ? pageNo : 1;

  try {
    const data = await fetchDailyNews(safePage, "zh_cn", { revalidate: false });
    return NextResponse.json({ code: 200, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load daily news";
    return NextResponse.json({ code: 500, msg: message }, { status: 500 });
  }
}
