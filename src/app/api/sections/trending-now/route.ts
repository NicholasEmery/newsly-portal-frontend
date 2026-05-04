import { NextRequest, NextResponse } from "next/server";
import { loadMocksAsync } from "@/api/mocks";
import { TrendingItemSchema } from "@/api/schemas/homepage";
import { paginateArray, parsePaginationParams } from "@/api/utils/pagination";
import { requestJsonWithLocale } from "@/api/connection/http";
import { withQuery } from "@/api/routes";
import { getDataSourceStatus } from "@/api/services/homeSections";
import { getLocaleFromRequest } from "@/api/utils/locale";

export async function GET(request: NextRequest) {
  const { limit, page } = parsePaginationParams(request.nextUrl.searchParams);
  const status = await getDataSourceStatus();

  if (!status.canRender) {
    return NextResponse.json([], { status: 200 });
  }

  // If mocks available, use mocks
  if (status.datasource === "mock" || String(status.reason).includes("mock")) {
    const mocks = await loadMocksAsync();
    if (!mocks || !mocks.TRENDING_SECTION_MOCK) {
      // eslint-disable-next-line no-console
      console.debug(
        "[trending-now] mocks missing or TRENDING_SECTION_MOCK empty",
        { status },
      );
      return NextResponse.json([], { status: 200 });
    }
    const payload = TrendingItemSchema.array().parse(
      paginateArray(mocks.TRENDING_SECTION_MOCK, { limit, page }),
    );
    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Otherwise, try API
  try {
    const locale = getLocaleFromRequest(request);
    const resp = await requestJsonWithLocale(
      withQuery(`${process.env.NEXT_PUBLIC_API_URL}/sections/trending-now`, {
        limit,
        page,
      }),
      TrendingItemSchema.array(),
      locale,
    );
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    // If API fails, return empty
    return NextResponse.json([], { status: 200 });
  }
}
