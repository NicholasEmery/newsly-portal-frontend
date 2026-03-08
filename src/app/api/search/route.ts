import { NextRequest, NextResponse } from "next/server";
import { loadMocks, hasMocksDirectory } from "@/api/mocks";
import { requestJson } from "@/api/connection/http";
import {
  getDataSourceStatus,
  getResolvedDataSourceMode,
} from "@/api/services/homeSections";
import {
  TrendingItemSchema,
  LatestNewsSectionSchema,
  HomeSectionItemSchema,
  TopNoticeSchema,
} from "@/api/schemas/homepage";

// flatten results from various sections into {Title,Category,CreatedAt} list
const flattenMocks = () => {
  const mocks = loadMocks();
  if (!mocks) return [];

  const results: Array<{ Title: string; Category: string; CreatedAt: string }> =
    [];

  const fromHome =
    mocks.HOME_SECTIONS_MOCK?.flatMap((section: any) =>
      section.Items.map((item: any) => ({
        Title: item.Title,
        Category: item.Category,
        CreatedAt: item.CreatedAt,
      })),
    ) || [];
  results.push(...fromHome);

  const fromLatest = mocks.LATEST_NEWS_SECTION_MOCK
    ? [
        mocks.LATEST_NEWS_SECTION_MOCK.Hero,
        mocks.LATEST_NEWS_SECTION_MOCK.SideCard,
        ...mocks.LATEST_NEWS_SECTION_MOCK.Feed,
        {
          Title: mocks.LATEST_NEWS_SECTION_MOCK.SideProfile.Title,
          Category: mocks.LATEST_NEWS_SECTION_MOCK.SideProfile.Category,
          CreatedAt: mocks.LATEST_NEWS_SECTION_MOCK.SideProfile.CreatedAt,
        },
      ].map((item: any) => ({
        Title: item.Title,
        Category: item.Category,
        CreatedAt: item.CreatedAt,
      }))
    : [];
  results.push(...fromLatest);

  const fromTrending = (mocks.TRENDING_SECTION_MOCK || []).map((item: any) => ({
    Title: item.Title,
    Category: item.Category,
    CreatedAt: item.CreatedAt,
  }));
  results.push(...fromTrending);

  if (mocks.TOP_NOTICE_MOCK) {
    results.push({
      Title: mocks.TOP_NOTICE_MOCK.Title,
      Category: mocks.TOP_NOTICE_MOCK.Category,
      CreatedAt: mocks.TOP_NOTICE_MOCK.CreatedAt,
    });
  }

  const fromSubscriber = (mocks.SUBSCRIBER_NEWS_MOCK || []).map(
    (item: any) => ({
      Title: item.Title,
      Category: item.Category,
      CreatedAt: item.CreatedAt,
    }),
  );
  results.push(...fromSubscriber);

  return results;
};

export async function GET(request: NextRequest) {
  const status = await getDataSourceStatus();
  const mode = getResolvedDataSourceMode();

  const serveMocks = () => {
    const data = flattenMocks();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  };

  if (mode === "mock") return serveMocks();

  if (!status.canRender && hasMocksDirectory()) return serveMocks();

  try {
    const resp = await requestJson(
      `${process.env.NEXT_PUBLIC_API_URL}/search`,
      null as any,
    );
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    if (hasMocksDirectory()) return serveMocks();
    return NextResponse.json([], { status: 200 });
  }
}
