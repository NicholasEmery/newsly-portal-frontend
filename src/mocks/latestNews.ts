import {
  LATEST_NEWS,
  LATEST_NEWS_HERO,
  PROFILE_SPOTLIGHT_NEWS,
} from "./newsCollections";
import { formatCreatedAtDisplay } from "./homeFactory";

type LatestNewsImageItem = {
  Title: string;
  Creator: string;
  Category: string;
  CreatedAt: string;
  Slug: string;
  ImgUrl: string;
};

type LatestNewsProfileItem = {
  Title: string;
  Creator: string;
  Category: string;
  CreatedAt: string;
  Slug: string;
  ImgProfileUrl: string;
};

const toImageItem = (
  item: (typeof LATEST_NEWS)[number],
): LatestNewsImageItem => ({
  Title: item.Title,
  Creator: item.Creator,
  Category: item.Category,
  CreatedAt: item.CreatedAt,
  Slug: item.Slug,
  ImgUrl: item.ImgUrl,
});

const regularBase = LATEST_NEWS.slice(0, 7);
const LATEST_NEWS_REGULAR: LatestNewsImageItem[] =
  regularBase.length > 0
    ? [...regularBase].map(toImageItem)
    : [toImageItem(LATEST_NEWS_HERO)];

while (LATEST_NEWS_REGULAR.length < 7) {
  LATEST_NEWS_REGULAR.push(LATEST_NEWS_REGULAR[0]);
}

const LATEST_NEWS_PROFILE_LAST: LatestNewsProfileItem = {
  Title: PROFILE_SPOTLIGHT_NEWS?.Title || LATEST_NEWS_HERO?.Title || "",
  Creator: PROFILE_SPOTLIGHT_NEWS?.Creator || LATEST_NEWS_HERO?.Creator || "",
  Category:
    PROFILE_SPOTLIGHT_NEWS?.Category ||
    LATEST_NEWS_HERO?.Category ||
    "Frontend",
  CreatedAt:
    PROFILE_SPOTLIGHT_NEWS?.CreatedAt ||
    LATEST_NEWS_HERO?.CreatedAt ||
    formatCreatedAtDisplay(new Date()),
  Slug: PROFILE_SPOTLIGHT_NEWS?.Slug || LATEST_NEWS_HERO?.Slug || "/",
  ImgProfileUrl: "/images/Nicholas-Emery.png",
};

export const LATEST_NEWS_ITEMS_MOCK = [
  ...LATEST_NEWS_REGULAR.slice(0, 7),
  LATEST_NEWS_PROFILE_LAST,
];

export const LATEST_NEWS_SECTION_MOCK = {
  Items: LATEST_NEWS_ITEMS_MOCK,
  Hero: LATEST_NEWS_ITEMS_MOCK[0] as LatestNewsImageItem,
  Feed: LATEST_NEWS_ITEMS_MOCK.slice(2, 7) as LatestNewsImageItem[],
  SideCard: LATEST_NEWS_ITEMS_MOCK[1] as LatestNewsImageItem,
  SideProfile: LATEST_NEWS_ITEMS_MOCK[7] as LatestNewsProfileItem,
  TotalNews: 8,
};
