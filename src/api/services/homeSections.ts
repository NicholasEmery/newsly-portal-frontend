import { routes, withQuery } from "@/api/routes";
import { requestJson, requestByDataSourceMode, resolveDataSourceMode, checkApiReadiness } from "@/api/connection/http";
import type { DataSourceMode } from "@/api/connection/http";
import {
  getDataSourceStatus,
  type DataSourceStatus,
} from "./dataSourceStatus";
import {
  HomePageSectionsSchema,
  HomeSectionItemSchema,
  HomeSectionSchema,
  LatestNewsSectionSchema,
  TopNoticeSchema,
  TrendingItemSchema,
  type HomePageSectionsDto,
} from "@/api/schemas/homepage";

import { paginateArray } from "@/api/utils/pagination";
import { IS_DEV_BUILD } from "@/config/buildTarget";

type SectionQueryOptions = {
  limit?: number;
  page?: number;
};

type HomeSectionsRequestOptions = {
  topNotice?: SectionQueryOptions;
  trendingNow?: SectionQueryOptions;
  latestNews?: SectionQueryOptions;
  homeGrids?: SectionQueryOptions;
  subscriberNews?: SectionQueryOptions;
};

export { getDataSourceStatus };
export type { DataSourceStatus };

export const getResolvedDataSourceMode = (): DataSourceMode =>
  resolveDataSourceMode();

// fetch data by calling the internal API endpoints; the
// endpoints themselves decide whether to proxy to an external
// backend or return mock data based on the current data source mode.
// this keeps all components and pages agnostic of the source.
const getHomeSectionsFromApi = async (
  options: HomeSectionsRequestOptions = {},
): Promise<HomePageSectionsDto> => {
  const [topNotice, trendingNow, latestNews, homeGrids, subscriberNews] =
    await Promise.all([
      requestJson(
        withQuery(routes.sections.topNotice, options.topNotice || {}),
        TopNoticeSchema,
      ),
      requestJson(
        withQuery(routes.sections.trendingNow, options.trendingNow || {}),
        TrendingItemSchema.array(),
      ),
      requestJson(
        withQuery(routes.sections.latestNews, options.latestNews || {}),
        LatestNewsSectionSchema,
      ),
      requestJson(
        withQuery(routes.sections.homeGrids, options.homeGrids || {}),
        HomeSectionSchema.array(),
      ),
      requestJson(
        withQuery(routes.sections.subscriberNews, options.subscriberNews || {}),
        HomeSectionItemSchema.array(),
      ),
    ]);

  return HomePageSectionsSchema.parse({
    TopNotice: topNotice,
    TrendingNow: trendingNow,
    LatestNews: latestNews,
    HomeGrids: homeGrids,
    SubscriberNews: subscriberNews,
  });
};

export const getHomeSections = async (
  options: HomeSectionsRequestOptions = {},
): Promise<HomePageSectionsDto | null> => {
  const mode = resolveDataSourceMode();

  // Sempre prioriza mocks se modo mock (apenas em build de dev)
  if (mode === "mock") {
    if (!IS_DEV_BUILD) {
      // Mocks não são suportados em produção
      throw new Error("Mock data source requested in non-dev build");
    }
    const mod = await import("./homeSections.dev");
    return mod.getHomeSectionsFromMocks(options);
  }

  // Se modo auto, tenta API, se falhar tenta mocks
  if (mode === "auto") {
    const apiReady = await checkApiReadiness(1500);
    if (apiReady) {
      try {
        return await getHomeSectionsFromApi(options);
      } catch {
        // Se a API falhar mesmo estando "pronta", tenta mocks (dev only)
        if (!IS_DEV_BUILD) throw new Error("API failed and mocks not available in production");
        const mod = await import("./homeSections.dev");
        return mod.getHomeSectionsFromMocks(options);
      }
    } else {
      // API não está pronta, tenta mocks direto (dev only)
      if (!IS_DEV_BUILD) throw new Error("API unavailable and mocks not available in production");
      const mod = await import("./homeSections.dev");
      return mod.getHomeSectionsFromMocks(options);
    }
  }

  // Modo API: só chama se a API estiver pronta
  const apiReady = await checkApiReadiness(1500);
  if (apiReady) {
    return await getHomeSectionsFromApi(options);
  }
  // API não disponível, tenta mocks se existirem (dev only)
  if (!IS_DEV_BUILD) return null;
  try {
    const mod = await import("./homeSections.dev");
    return await mod.getHomeSectionsFromMocks(options);
  } catch {
    return null;
  }
};

// Dev-only proxy to the mocks implementation. This avoids importing mock
// code into production builds; the actual implementation lives in
// `homeSections.dev.ts` and will only be bundled in dev builds.
export const getHomeSectionsFromMocks = async (
  options: HomeSectionsRequestOptions = {},
): Promise<HomePageSectionsDto> => {
  if (!IS_DEV_BUILD) throw new Error("Mocks not available in non-dev build");
  const mod = await import("./homeSections.dev");
  return mod.getHomeSectionsFromMocks(options);
};

export const canAccessHomeSections = async (): Promise<DataSourceStatus> => {
  const status = await getDataSourceStatus();
  return status;
};
