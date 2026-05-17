// Dev-only static bundle that re-exports mock constants using static imports
// This avoids dynamic path import restrictions under Turbopack in dev mode.
import * as nav from "../mocks/navigation";
import * as topNotice from "../mocks/topNotice";
import * as trending from "../mocks/trending";
import * as latest from "../mocks/latestNews";
import * as social from "../mocks/socialLinks";
import * as home from "../mocks/home";
import * as subscriber from "../mocks/subscriberNews";
import * as frontend from "../mocks/frontendNews";
import * as backend from "../mocks/backendNews";
import * as devops from "../mocks/devopsNews";
import * as cloud from "../mocks/cloudNews";

const bundle: Record<string, any> = {
  NAV_ALL_CATEGORIES: nav.NAV_ALL_CATEGORIES,
  NAV_PRIMARY_CATEGORIES: nav.NAV_PRIMARY_CATEGORIES,
  NAV_MORE_CATEGORIES: nav.NAV_MORE_CATEGORIES,
  TOP_NOTICE_MOCK: topNotice.TOP_NOTICE_MOCK,
  TRENDING_SECTION_MOCK: trending.TRENDING_SECTION_MOCK,
  LATEST_NEWS_SECTION_MOCK: latest.LATEST_NEWS_SECTION_MOCK,
  SOCIAL_LINKS_MOCK: social.SOCIAL_LINKS_MOCK,
  HOME_SECTIONS_MOCK: home.HOME_SECTIONS_MOCK,
  SUBSCRIBER_NEWS_MOCK: subscriber.SUBSCRIBER_NEWS_MOCK,
  FRONTEND_NEWS_MOCK: frontend.FRONTEND_NEWS_MOCK,
  BACKEND_NEWS_MOCK: backend.BACKEND_NEWS_MOCK,
  DEVOPS_NEWS_MOCK: devops.DEVOPS_NEWS_MOCK,
  CLOUD_NEWS_MOCK: cloud.CLOUD_NEWS_MOCK,
};

export default bundle;
