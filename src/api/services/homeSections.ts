import { routes, withQuery } from "@/api/routes";
import { headers } from "next/headers";
import {
  requestJson,
  resolveDataSourceMode,
  checkApiReadiness,
} from "@/api/connection/http";
import type { DataSourceMode } from "@/api/connection/http";
import { getDataSourceStatus, type DataSourceStatus } from "./dataSourceStatus";
import {
  HomePageSectionsSchema,
  HomeSectionItemSchema,
  HomeSectionSchema,
  LatestNewsSectionSchema,
  TopNoticeSchema,
  TrendingItemSchema,
  type HomeSectionDto,
  type HomeSectionItemDto,
  type LatestNewsSectionDto,
  type TopNoticeDto,
  type TrendingItemDto,
  type HomePageSectionsDto,
} from "@/api/schemas/homepage";

import { IS_DEV_BUILD } from "@/config/buildTarget";
import { homeSectionsRequestQueue } from "@/api/utils/requestQueue";

type SectionQueryOptions = {
  limit?: number;
  page?: number;
  categoriesLimit?: number;
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

const SECTION_CACHE_TTL_MS = 20_000;
const SECTION_RETRY_ATTEMPTS = 2;
const SECTION_RETRY_BASE_DELAY_MS = 250;

const resolveInternalApiOrigin = async () => {
  try {
    const requestHeaders = await headers();
    const host =
      requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");

    if (host) {
      const forwardedProto = requestHeaders.get("x-forwarded-proto");
      const protocol =
        forwardedProto ||
        (host.includes("localhost") || host.startsWith("127.")
          ? "http"
          : "https");

      return `${protocol}://${host}`;
    }
  } catch {
    // Fallback to env/default origin when request headers are unavailable.
  }

  const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();
  if (appOrigin) return appOrigin;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

const resolveSectionRequestPath = async (path: string) => {
  if (!path.startsWith("/api/")) return path;
  return `${await resolveInternalApiOrigin()}${path}`;
};

type SectionCacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const sectionCache = new Map<string, SectionCacheEntry<unknown>>();

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const requestWithRetry = async <T>(
  request: () => Promise<T>,
  attempts = SECTION_RETRY_ATTEMPTS,
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i <= attempts; i += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      if (i === attempts) break;
      const delay = SECTION_RETRY_BASE_DELAY_MS * 2 ** i;
      await sleep(delay);
    }
  }

  throw lastError;
};

const getCached = <T>(cacheKey: string): T | null => {
  const entry = sectionCache.get(cacheKey);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    sectionCache.delete(cacheKey);
    return null;
  }
  return entry.value as T;
};

const setCached = <T>(cacheKey: string, value: T) => {
  sectionCache.set(cacheKey, {
    value,
    expiresAt: Date.now() + SECTION_CACHE_TTL_MS,
  });
};

const fetchSectionWithPolicy = async <T>(
  cacheKey: string,
  path: string,
  schema: Parameters<typeof requestJson<T>>[1],
  query: SectionQueryOptions = {},
  priority: "high" | "normal" | "low" = "normal",
): Promise<T> => {
  const cached = getCached<T>(cacheKey);
  if (cached) {
    return cached;
  }

  const queueKey = `${cacheKey}:${query.page || 1}:${query.limit || "all"}`;
  const result = await homeSectionsRequestQueue.enqueue(
    queueKey,
    async () => {
      const resolvedPath = await resolveSectionRequestPath(path);
      const response = await requestWithRetry(() =>
        requestJson(withQuery(resolvedPath, query), schema),
      );
      setCached(cacheKey, response);
      return response;
    },
    priority,
  );

  return result;
};

export const getTopNoticeSection = async (): Promise<TopNoticeDto> =>
  fetchSectionWithPolicy(
    "top-notice",
    routes.sections.topNotice,
    TopNoticeSchema,
    {},
    "high",
  );

export const getTrendingNowSection = async (
  options: SectionQueryOptions = {},
): Promise<TrendingItemDto[]> =>
  fetchSectionWithPolicy(
    `trending-now:${options.page || 1}:${options.limit || "all"}`,
    routes.sections.trendingNow,
    TrendingItemSchema.array(),
    options,
    "high",
  );

export const getLatestNewsSectionPage = async (
  options: SectionQueryOptions = {},
): Promise<LatestNewsSectionDto> =>
  fetchSectionWithPolicy(
    `latest-news:${options.page || 1}:${options.limit || "all"}`,
    routes.sections.latestNews,
    LatestNewsSectionSchema,
    options,
    "normal",
  );

export const getHomeGridsSectionPage = async (
  options: SectionQueryOptions = {},
): Promise<HomeSectionDto[]> =>
  fetchSectionWithPolicy(
    `home-grids:${options.page || 1}:${options.limit || "all"}:${options.categoriesLimit || "all-categories"}`,
    routes.sections.homeGrids,
    HomeSectionSchema.array(),
    options,
    "normal",
  );

export const getSubscriberNewsSectionPage = async (
  options: SectionQueryOptions = {},
): Promise<HomeSectionItemDto[]> =>
  fetchSectionWithPolicy(
    `subscriber-news:${options.page || 1}:${options.limit || "all"}`,
    routes.sections.subscriberNews,
    HomeSectionItemSchema.array(),
    options,
    "low",
  );

// fetch data by calling the internal API endpoints; the
// endpoints themselves decide whether to proxy to an external
// backend or return mock data based on the current data source mode.
// this keeps all components and pages agnostic of the source.
const getHomeSectionsFromApi = async (
  options: HomeSectionsRequestOptions = {},
): Promise<HomePageSectionsDto> => {
  const [topNotice, trendingNow, latestNews, homeGrids, subscriberNews] =
    await Promise.all([
      getTopNoticeSection(),
      getTrendingNowSection(options.trendingNow || {}),
      getLatestNewsSectionPage(options.latestNews || {}),
      getHomeGridsSectionPage(options.homeGrids || {}),
      getSubscriberNewsSectionPage(options.subscriberNews || {}),
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

  // Always prioritize mocks if mock mode (only in dev build)
  if (mode === "mock") {
    if (!IS_DEV_BUILD) {
      // Mocks are not supported in production
      throw new Error("Mock data source requested in non-dev build");
    }
    const mod = await import("./homeSections.dev");
    return mod.getHomeSectionsFromMocks(options);
  }

  // If auto mode, try API, if it fails try mocks
  if (mode === "auto") {
    const apiReady = await checkApiReadiness(1500);
    if (apiReady) {
      try {
        return await getHomeSectionsFromApi(options);
      } catch {
        // If API fails even though it was "ready", try mocks (dev only)
        if (!IS_DEV_BUILD)
          throw new Error("API failed and mocks not available in production");
        const mod = await import("./homeSections.dev");
        return mod.getHomeSectionsFromMocks(options);
      }
    } else {
      // API not ready, try mocks directly (dev only)
      if (!IS_DEV_BUILD)
        throw new Error(
          "API unavailable and mocks not available in production",
        );
      const mod = await import("./homeSections.dev");
      return mod.getHomeSectionsFromMocks(options);
    }
  }

  // API mode: only call if API is ready
  const apiReady = await checkApiReadiness(1500);
  if (apiReady) {
    return await getHomeSectionsFromApi(options);
  }
  // API not available, try mocks if they exist (dev only)
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
