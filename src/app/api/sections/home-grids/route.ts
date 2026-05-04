import { NextRequest, NextResponse } from "next/server";
import { loadMocksAsync } from "@/api/mocks";
import { HomeSectionSchema } from "@/api/schemas/homepage";
import { paginateArray, parsePaginationParams } from "@/api/utils/pagination";
import { requestJsonWithLocale } from "@/api/connection/http";
import { withQuery } from "@/api/routes";
import { getDataSourceStatus } from "@/api/services/homeSections";
import { getLocaleFromRequest } from "@/api/utils/locale";

const parseCategoriesLimit = (value: string | null): number | undefined => {
  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;

  return parsed;
};

const applyCategoriesLimit = <T>(
  sections: T[],
  categoriesLimit?: number,
): T[] => {
  if (!categoriesLimit) return sections;
  return sections.slice(0, categoriesLimit);
};

export async function GET(request: NextRequest) {
  const { limit, page } = parsePaginationParams(request.nextUrl.searchParams);
  const categoriesLimit = parseCategoriesLimit(
    request.nextUrl.searchParams.get("categoriesLimit"),
  );
  const status = await getDataSourceStatus();

  if (!status.canRender) {
    return NextResponse.json([], { status: 200 });
  }

  if (status.datasource === "mock" || String(status.reason).includes("mock")) {
    const mocks = await loadMocksAsync();
    if (!mocks || !mocks.HOME_SECTIONS_MOCK) {
      // eslint-disable-next-line no-console
      console.debug(
        "[home-grids] mocks missing or HOME_SECTIONS_MOCK not present",
        { status },
      );
      return NextResponse.json([], { status: 200 });
    }
    const limitedMockSections = applyCategoriesLimit(
      mocks.HOME_SECTIONS_MOCK,
      categoriesLimit,
    );
    const payload = HomeSectionSchema.array().parse(
      limitedMockSections.map((section: any) => ({
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
    const locale = getLocaleFromRequest(request);
    const resp = await requestJsonWithLocale(
      withQuery(`${process.env.NEXT_PUBLIC_API_URL}/sections/home-grids`, {
        limit,
        page,
        categoriesLimit,
      }),
      HomeSectionSchema.array(),
      locale,
    );
    const payload = applyCategoriesLimit(resp, categoriesLimit);
    return NextResponse.json(payload, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
