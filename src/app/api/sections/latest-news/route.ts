import { NextRequest, NextResponse } from "next/server";
import { loadMocks } from "@/api/mocks";
import { LatestNewsSectionSchema } from "@/api/schemas/homepage";
import { paginateArray, parsePaginationParams } from "@/api/utils/pagination";
import { requestJson } from "@/api/connection/http";
import { withQuery } from "@/api/routes";
import { getDataSourceStatus } from "@/api/services/homeSections";

export async function GET(request: NextRequest) {
  const { limit, page } = parsePaginationParams(request.nextUrl.searchParams);
  const status = await getDataSourceStatus();

  if (!status.canRender) {
    return NextResponse.json({ Items: [], Hero: null }, { status: 200 });
  }

  if (String(status.reason).includes("mock")) {
    const mocks = loadMocks();
    if (!mocks || !mocks.LATEST_NEWS_SECTION_MOCK) {
      return NextResponse.json({ Items: [], Hero: null }, { status: 200 });
    }
    const base = mocks.LATEST_NEWS_SECTION_MOCK;
    const pagedItems = paginateArray(base.Items, { limit, page });
    const imageItems = pagedItems.filter(
      (item: any): item is (typeof base.Feed)[number] => "ImgUrl" in item,
    );

    const payload = LatestNewsSectionSchema.parse({
      ...base,
      Items: pagedItems,
      Hero: imageItems[0] || base.Hero,
      Feed: imageItems.slice(2, 7),
      SideCard: imageItems[1] || imageItems[0] || base.SideCard,
      SideProfile:
        pagedItems.find(
          (item: any): item is typeof base.SideProfile =>
            "ImgProfileUrl" in item,
        ) || base.SideProfile,
      TotalNews: base.Items.length,
    });

    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const resp = await requestJson(
      withQuery(`${process.env.NEXT_PUBLIC_API_URL}/sections/latest-news`, {
        limit,
        page,
      }),
      LatestNewsSectionSchema,
    );
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ Items: [], Hero: null }, { status: 200 });
  }
}
