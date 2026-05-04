"use client";

import { routes, withQuery } from "@/api/routes";
import {
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
} from "@/api/schemas/homepage";
import { homeSectionsRequestQueue } from "@/api/utils/requestQueue";

type SectionQueryOptions = {
  limit?: number;
  page?: number;
  categoriesLimit?: number;
};

const RETRY_ATTEMPTS = 2;
const RETRY_BASE_DELAY_MS = 250;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const fetchWithRetry = async <T>(
  task: () => Promise<T>,
  attempts = RETRY_ATTEMPTS,
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i <= attempts; i += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (i === attempts) break;
      await sleep(RETRY_BASE_DELAY_MS * 2 ** i);
    }
  }

  throw lastError;
};

const fetchSectionJson = async <T>(
  path: string,
  query: SectionQueryOptions,
  parse: (payload: unknown) => T,
  priority: "high" | "normal" | "low" = "normal",
): Promise<T> => {
  const page = query.page || 1;
  const limit = query.limit || "all";
  const categoriesLimit = query.categoriesLimit || "all-categories";
  const key = `${path}:${page}:${limit}:${categoriesLimit}`;

  return homeSectionsRequestQueue.enqueue(
    key,
    async () => {
      const endpoint = withQuery(path, query);
      const payload = await fetchWithRetry(async () => {
        const response = await fetch(endpoint, {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
        }

        return await response.json();
      });

      return parse(payload);
    },
    priority,
  );
};

export const getLatestNewsSectionPageClient = async (
  options: SectionQueryOptions = {},
): Promise<LatestNewsSectionDto> =>
  fetchSectionJson(
    routes.sections.latestNews,
    options,
    (payload) => LatestNewsSectionSchema.parse(payload),
    "normal",
  );

export const getTopNoticeSectionClient = async (): Promise<TopNoticeDto> =>
  fetchSectionJson(
    routes.sections.topNotice,
    {},
    (payload) => TopNoticeSchema.parse(payload),
    "high",
  );

export const getTrendingNowSectionPageClient = async (
  options: SectionQueryOptions = {},
): Promise<TrendingItemDto[]> =>
  fetchSectionJson(
    routes.sections.trendingNow,
    options,
    (payload) => TrendingItemSchema.array().parse(payload),
    "high",
  );

export const getHomeGridsSectionPageClient = async (
  options: SectionQueryOptions = {},
): Promise<HomeSectionDto[]> =>
  fetchSectionJson(
    routes.sections.homeGrids,
    options,
    (payload) => HomeSectionSchema.array().parse(payload),
    "normal",
  );

export const getSubscriberNewsSectionPageClient = async (
  options: SectionQueryOptions = {},
): Promise<HomeSectionItemDto[]> =>
  fetchSectionJson(
    routes.sections.subscriberNews,
    options,
    (payload) => HomeSectionItemSchema.array().parse(payload),
    "low",
  );
