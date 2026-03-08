import { routes, withQuery } from "@/api/routes";
import { requestByDataSourceMode, requestJson } from "@/api/connection/http";
import {
  HomeSectionItemSchema,
  HomeSectionSchema,
  LatestNewsSectionSchema,
  TrendingItemSchema,
  type HomeSectionItemDto,
  type LatestNewsSectionDto,
  type TrendingItemDto,
} from "@/api/schemas/homepage";
import { loadMocks } from "@/api/mocks";
import { paginateArray } from "@/api/utils/pagination";

export type ViewMoreQuery = {
  limit?: number;
  page?: number;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginatedMeta;
};

const DEFAULT_LIMIT = 8;
const DEFAULT_PAGE = 1;

const toPositiveInt = (value: number | undefined): number | undefined => {
  if (value === undefined) return undefined;
  if (!Number.isFinite(value)) return undefined;
  const normalized = Math.trunc(value);
  if (normalized <= 0) return undefined;
  return normalized;
};

const resolveQuery = (query: ViewMoreQuery = {}) => {
  const limit = toPositiveInt(query.limit) ?? DEFAULT_LIMIT;
  const page = toPositiveInt(query.page) ?? DEFAULT_PAGE;
  return { limit, page };
};

const toPaginatedResult = <T>(
  items: T[],
  total: number,
  query: ViewMoreQuery,
): PaginatedResult<T> => {
  const { limit, page } = resolveQuery(query);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

export const getTrendingNowPage = async (
  query: ViewMoreQuery = {},
): Promise<PaginatedResult<TrendingItemDto>> => {
  const { limit, page } = resolveQuery(query);
  const mocks = loadMocks();
  const mockTrending = mocks?.TRENDING_SECTION_MOCK || [];
  const total = mockTrending.length;

  const fallbackItems: TrendingItemDto[] = paginateArray(
    mockTrending as any[],
    { limit, page },
  );

  const items: TrendingItemDto[] = await requestByDataSourceMode<
    TrendingItemDto[]
  >({
    fromApi: () =>
      requestJson(
        withQuery(routes.sections.trendingNow, { limit, page }),
        TrendingItemSchema.array(),
      ),
    fallbackData: fallbackItems,
  });

  return toPaginatedResult(items, total, { limit, page });
};

export const getSubscriberNewsPage = async (
  query: ViewMoreQuery = {},
): Promise<PaginatedResult<HomeSectionItemDto>> => {
  const { limit, page } = resolveQuery(query);
  const mocks = loadMocks();
  const mockSubscriber = mocks?.SUBSCRIBER_NEWS_MOCK || [];
  const total = mockSubscriber.length;

  const fallbackItems: HomeSectionItemDto[] = paginateArray(
    mockSubscriber as any[],
    { limit, page },
  );

  const items: HomeSectionItemDto[] = await requestByDataSourceMode({
    fromApi: () =>
      requestJson(
        withQuery(routes.sections.subscriberNews, { limit, page }),
        HomeSectionItemSchema.array(),
      ),
    fallbackData: fallbackItems,
  });

  return toPaginatedResult(items, total, { limit, page });
};

export const getLatestNewsPage = async (
  query: ViewMoreQuery = {},
): Promise<PaginatedResult<LatestNewsSectionDto["Items"][number]>> => {
  const { limit, page } = resolveQuery(query);
  const mocks = loadMocks();
  const mockLatestItems = mocks?.LATEST_NEWS_SECTION_MOCK?.Items || [];
  const total = mockLatestItems.length;

  const fallbackItems: LatestNewsSectionDto["Items"][number][] = paginateArray(
    mockLatestItems as any[],
    {
      limit,
      page,
    },
  );

  const fallbackImageItems = fallbackItems.filter(
    (item): item is LatestNewsSectionDto["Feed"][number] => "ImgUrl" in item,
  );

  const section = await requestByDataSourceMode<LatestNewsSectionDto>({
    fromApi: () =>
      requestJson(
        withQuery(routes.sections.latestNews, { limit, page }),
        LatestNewsSectionSchema,
      ),
    fallbackData: {
      ...((mocks?.LATEST_NEWS_SECTION_MOCK as any) || {}),
      Items: fallbackItems,
      Hero:
        fallbackImageItems[0] || (mocks?.LATEST_NEWS_SECTION_MOCK?.Hero as any),
      Feed: fallbackImageItems.slice(2, 7),
      SideCard:
        fallbackImageItems[1] ||
        fallbackImageItems[0] ||
        (mocks?.LATEST_NEWS_SECTION_MOCK?.SideCard as any),
      SideProfile: mocks?.LATEST_NEWS_SECTION_MOCK?.SideProfile as any,
      TotalNews: total,
    },
  });

  return toPaginatedResult(section.Items, total, { limit, page });
};

export const getHomeGridNewsPageByCategory = async (
  category: string,
  query: ViewMoreQuery = {},
): Promise<PaginatedResult<HomeSectionItemDto>> => {
  const { limit, page } = resolveQuery(query);
  const normalizedCategory = category.trim().toLowerCase();

  const mocks = loadMocks();
  const homeMockSections = mocks?.HOME_SECTIONS_MOCK || [];
  const sourceSection = homeMockSections.find(
    (section: any) =>
      section.Category.trim().toLowerCase() === normalizedCategory,
  ) ||
    homeMockSections[0] || { Items: [] };

  const total = sourceSection?.Items.length || 0;
  const fallbackItems = paginateArray(sourceSection?.Items || [], {
    limit,
    page,
  });

  const sections = await requestByDataSourceMode({
    fromApi: () =>
      requestJson(
        withQuery(routes.sections.homeGrids, { limit, page }),
        HomeSectionSchema.array(),
      ),
    fallbackData: [
      {
        ...sourceSection,
        Items: fallbackItems,
      },
    ],
  });

  const selectedSection =
    sections.find(
      (section) => section.Category.trim().toLowerCase() === normalizedCategory,
    ) || sections[0];

  return toPaginatedResult(selectedSection?.Items || [], total, {
    limit,
    page,
  });
};
