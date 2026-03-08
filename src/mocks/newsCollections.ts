import type { HomeSectionItem } from "./homeFactory";
import { FRONTEND_NEWS_MOCK } from "./frontendNews";
import { BACKEND_NEWS_MOCK } from "./backendNews";
import { DEVOPS_NEWS_MOCK } from "./devopsNews";
import { CLOUD_NEWS_MOCK } from "./cloudNews";
import { SUBSCRIBER_NEWS_MOCK } from "./subscriberNews";
import { parseCreatedAtDisplay } from "@/utils/date";

export const CATEGORY_NEWS_MOCK: HomeSectionItem[] = [
  ...FRONTEND_NEWS_MOCK,
  ...BACKEND_NEWS_MOCK,
  ...DEVOPS_NEWS_MOCK,
  ...CLOUD_NEWS_MOCK,
];

export const ALL_NEWS_MOCK: HomeSectionItem[] = [
  ...CATEGORY_NEWS_MOCK,
  ...SUBSCRIBER_NEWS_MOCK,
];

export const sortByCreatedAtDesc = (items: HomeSectionItem[]) =>
  [...items].sort(
    (a, b) =>
      parseCreatedAtDisplay(b.CreatedAt) - parseCreatedAtDisplay(a.CreatedAt),
  );

export const sortByCommentsDesc = (items: HomeSectionItem[]) =>
  [...items].sort((a, b) => (b.CommentsCount || 0) - (a.CommentsCount || 0));

export const TOP_NOTICE_NEWS = sortByCreatedAtDesc(CATEGORY_NEWS_MOCK)[0];
export const TRENDING_NEWS = sortByCommentsDesc(ALL_NEWS_MOCK).slice(0, 4);
export const LATEST_NEWS = sortByCreatedAtDesc(CATEGORY_NEWS_MOCK).slice(0, 8);
export const LATEST_NEWS_HERO = LATEST_NEWS[0] || CATEGORY_NEWS_MOCK[0];
export const PROFILE_SPOTLIGHT_NEWS = LATEST_NEWS[1] || LATEST_NEWS_HERO;
