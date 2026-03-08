import { NextRequest, NextResponse } from "next/server";
import { loadMocks } from "@/api/mocks";
import { HomeSectionSchema } from "@/api/schemas/homepage";
import { paginateArray, parsePaginationParams } from "@/api/utils/pagination";
import { requestJson } from "@/api/connection/http";
import { withQuery } from "@/api/routes";
import { getDataSourceStatus } from "@/api/services/homeSections";

export async function GET(request: NextRequest) {
  const { limit, page } = parsePaginationParams(request.nextUrl.searchParams);
  const status = await getDataSourceStatus();

  if (!status.canRender) {
    return NextResponse.json([], { status: 200 });
  }

  if (String(status.reason).includes("mock")) {
    const mocks = loadMocks();
    if (!mocks || !mocks.HOME_SECTIONS_MOCK) {
      return NextResponse.json([], { status: 200 });
    }
    const payload = HomeSectionSchema.array().parse(
      mocks.HOME_SECTIONS_MOCK.map((section: any) => ({
        ...section,
        Items: paginateArray(section.Items, { limit, page }),
      })),
    );
    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const resp = await requestJson(
      withQuery(`${process.env.NEXT_PUBLIC_API_URL}/sections/home-grids`, {
        limit,
        page,
      }),
      HomeSectionSchema.array(),
    );
    return NextResponse.json(resp, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
