import type { HomeSection } from "./homeFactory";
import { FRONTEND_NEWS_MOCK } from "./frontendNews";
import { BACKEND_NEWS_MOCK } from "./backendNews";
import { DEVOPS_NEWS_MOCK } from "./devopsNews";
import { CLOUD_NEWS_MOCK } from "./cloudNews";

export const HOME_SECTIONS_MOCK: HomeSection[] = [
  {
    FilterLabel: "Spotlight",
    Category: "Frontend",
    Items: FRONTEND_NEWS_MOCK,
  },
  {
    FilterLabel: "Trending Stories",
    Category: "Backend",
    Items: BACKEND_NEWS_MOCK,
  },
  {
    FilterLabel: "Longreads",
    Category: "DevOps",
    Items: DEVOPS_NEWS_MOCK,
  },
  {
    FilterLabel: "Dont Miss Out",
    Category: "Cloud",
    Items: CLOUD_NEWS_MOCK,
  },
];
