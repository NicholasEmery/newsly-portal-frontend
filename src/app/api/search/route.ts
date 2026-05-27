import { NextRequest, NextResponse } from "next/server";
import { loadMocksAsync, hasMocksDirectory } from "@/api/mocks";
import { requestJsonWithLocale, resolveBackendBaseUrl } from "@/api/connection/http";
import {
  getDataSourceStatus,
  getResolvedDataSourceMode,
} from "@/api/services/homeSections";
import { getLocaleFromRequest } from "@/api/utils/locale";
// schema imports removed (not used)

// flatten results from various sections into {Title,Category,CreatedAt} list
const flattenMocks = (mocks: any) => {
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

  const serveMocks = async () => {
    const mocks = await loadMocksAsync();
    if (!mocks) {
      // eslint-disable-next-line no-console
      console.debug("[search] mocks not available; returning empty results");
      return NextResponse.json([], {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      });
    }
    const data = flattenMocks(mocks);
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  };

  if (mode === "mock") return await serveMocks();

  if (!status.canRender && hasMocksDirectory()) return await serveMocks();

  try {
    const locale = getLocaleFromRequest(request);
    const resp = await requestJsonWithLocale(
      `${resolveBackendBaseUrl()}/search`,
      null as any,
      locale,
    );
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    if (hasMocksDirectory()) return await serveMocks();
    return NextResponse.json([], { status: 200 });
  }
}
