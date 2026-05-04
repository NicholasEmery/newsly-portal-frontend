import { NextRequest, NextResponse } from "next/server";
import { loadMocksAsync } from "@/api/mocks";
import { HomeSectionItemSchema } from "@/api/schemas/homepage";
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

  if (status.datasource === "mock" || String(status.reason).includes("mock")) {
    const mocks = await loadMocksAsync();
    if (!mocks || !mocks.SUBSCRIBER_NEWS_MOCK) {
      // eslint-disable-next-line no-console
      console.debug(
        "[subscriber-news] mocks missing or SUBSCRIBER_NEWS_MOCK not present",
        { status },
      );
      return NextResponse.json([], { status: 200 });
    }
    const payload = HomeSectionItemSchema.array().parse(
      paginateArray(mocks.SUBSCRIBER_NEWS_MOCK, { limit, page }),
    );
    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const locale = getLocaleFromRequest(request);
    const resp = await requestJsonWithLocale(
      withQuery(`${process.env.NEXT_PUBLIC_API_URL}/sections/subscriber-news`, {
        limit,
        page,
      }),
      HomeSectionItemSchema.array(),
      locale,
    );
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
