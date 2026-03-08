import { NextRequest, NextResponse } from "next/server";
import { loadMocks } from "@/api/mocks";
import { TrendingItemSchema } from "@/api/schemas/homepage";
import { paginateArray, parsePaginationParams } from "@/api/utils/pagination";
import { requestJson } from "@/api/connection/http";
import { withQuery } from "@/api/routes";
import { getDataSourceStatus } from "@/api/services/homeSections";

  const { limit, page } = parsePaginationParams(request.nextUrl.searchParams);
  const status = await getDataSourceStatus();

  if (!status.canRender) {
    return NextResponse.json([], { status: 200 });
  }

  // Se mocks disponíveis, usa mocks
  if (String(status.reason).includes("mock")) {
    const mocks = loadMocks();
    if (!mocks || !mocks.TRENDING_SECTION_MOCK) {
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

  // Caso contrário, tenta API
  try {
    const resp = await requestJson(
      withQuery(`${process.env.NEXT_PUBLIC_API_URL}/sections/trending-now`, {
        limit,
        page,
      }),
      TrendingItemSchema.array(),
    );
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    // Se API falhar, retorna vazio
    return NextResponse.json([], { status: 200 });
  }
}
