import { getDevDataSourceStatus } from "./dataSourceStatus.dev";

export { getDevDataSourceStatus };

import {
  HomeSectionItemSchema,
  HomeSectionSchema,
  LatestNewsSectionSchema,
  TopNoticeSchema,
  TrendingItemSchema,
  type HomePageSectionsDto,
} from "@/api/schemas/homepage";
import { paginateArray } from "@/api/utils/pagination";

export const getHomeSectionsFromMocks = async (
  options: {
    topNotice?: any;
    trendingNow?: any;
    latestNews?: any;
    homeGrids?: any;
    subscriberNews?: any;
  } = {},
): Promise<HomePageSectionsDto> => {
  let mocks: any = false;
  const { hasMocksDirectory } = await import("@/api/mocks");
  if (hasMocksDirectory()) {
    try {
      try {
        // @ts-ignore
        // eslint-disable-next-line
        mocks = (await import("@/mocks")) as unknown;
      } catch {
        mocks = false;
      }
    } catch (err: any) {
      if (
        err &&
        err.code !== "MODULE_NOT_FOUND" &&
        err.message &&
        !/Cannot find module/.test(err.message)
      ) {
        throw err;
      }
      mocks = false;
    }
  }
  if (!mocks) {
    throw new Error("Mocks não disponíveis.");
  }
  const pagedTrending = paginateArray(
    mocks.TRENDING_SECTION_MOCK || [],
    options.trendingNow || {},
  );
  const pagedSubscriber = paginateArray(
    mocks.SUBSCRIBER_NEWS_MOCK || [],
    options.subscriberNews || {},
  );
  const pagedHomeGrids = (mocks.HOME_SECTIONS_MOCK || []).map(
    (section: any) => ({
      ...section,
      Items: paginateArray(section.Items, options.homeGrids || {}),
    }),
  );
  const latestItems = paginateArray(
    (mocks.LATEST_NEWS_SECTION_MOCK?.Items as any[]) || [],
    options.latestNews || {},
  );
  const latestImageItems = latestItems.filter(
    (item): item is any => item && typeof item === "object" && "ImgUrl" in item,
  );
  const baseLatest = mocks.LATEST_NEWS_SECTION_MOCK || {};
  const pagedLatest = {
    ...baseLatest,
    Items: latestItems,
    Hero: latestImageItems[0] || baseLatest.Hero,
    Feed: latestImageItems.slice(2, 7),
    SideCard: latestImageItems[1] || latestImageItems[0] || baseLatest.SideCard,
    SideProfile:
      latestItems.find((item): item is any => "ImgProfileUrl" in item) ||
      baseLatest.SideProfile,
    TotalNews: latestItems.length,
  };
  return {
    TopNotice: TopNoticeSchema.parse(mocks.TOP_NOTICE_MOCK || {}),
    TrendingNow: TrendingItemSchema.array().parse(pagedTrending),
    LatestNews: LatestNewsSectionSchema.parse(pagedLatest),
    HomeGrids: HomeSectionSchema.array().parse(pagedHomeGrids),
    SubscriberNews: HomeSectionItemSchema.array().parse(pagedSubscriber),
  };
};
