import { loadMocksAsync } from "@/api/mocks";
import {
  normalizeCreators,
  slugifyNewsValue,
  type NoticeArticle,
} from "@/api/types/news";

const normalizeMockNotice = (item: any): NoticeArticle => {
  const title = String(item?.Title || item?.title || "Untitled news");
  const creatorName = String(
    item?.Creators?.Owner?.name || item?.Creator || "newsly",
  );
  const description = String(item?.Description || "");
  const category = String(item?.Category || "Geral");
  const slug = String(item?.Slug || slugifyNewsValue(title));

  return {
    ImgUrl: String(item?.ImgUrl || "/images/imageScience.png"),
    Title: title,
    Description: description,
    Creator: creatorName,
    Category: category,
    CreatedAt: String(item?.CreatedAt || ""),
    CommentsCount: Number(item?.CommentsCount || 0),
    isSubscriber: Boolean(item?.isSubscriber),
    Slug: slug,
    notice: String(item?.notice || ""),
    Creators: normalizeCreators(item?.Creators, creatorName, description),
  };
};

export const getNoticeArticlesFromMocks = async (): Promise<
  NoticeArticle[]
> => {
  const mocks = await loadMocksAsync();
  const allNews = mocks?.ALL_NEWS_MOCK || [];
  return Array.isArray(allNews)
    ? allNews.map((item: any) => normalizeMockNotice(item))
    : [];
};

export const getNoticeArticleBySlugFromMocks = async (
  slug: string,
): Promise<NoticeArticle | null> => {
  const articles = await getNoticeArticlesFromMocks();
  return articles.find((item) => item.Slug === slug) || null;
};
