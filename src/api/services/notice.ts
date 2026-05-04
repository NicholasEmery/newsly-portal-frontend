import { IS_DEV_BUILD } from "@/config/buildTarget";
import {
  normalizeCreators,
  slugifyNewsValue,
  type NoticeArticle,
} from "@/api/types/news";
import { getHomeSections } from "./homeSections";

const normalizeSectionItem = (item: any): NoticeArticle => {
  const title = String(item?.Title || item?.Creator || "Untitled news");
  const creatorName = String(item?.Creator || "newsly");
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

export const getNoticeArticles = async (): Promise<NoticeArticle[]> => {
  if (IS_DEV_BUILD) {
    const mod = await import("./notice.dev");
    return mod.getNoticeArticlesFromMocks();
  }

  const sections = await getHomeSections({
    latestNews: { limit: 500, page: 1 },
    homeGrids: { limit: 500, page: 1 },
    subscriberNews: { limit: 500, page: 1 },
    trendingNow: { limit: 500, page: 1 },
  });

  if (!sections) return [];

  const all = [
    ...(sections.HomeGrids || []).flatMap((section) => section.Items || []),
    ...(sections.SubscriberNews || []),
    ...(sections.LatestNews?.Items || []),
    ...(sections.TrendingNow || []),
  ];

  const unique = new Map<string, NoticeArticle>();

  for (const item of all) {
    const article = normalizeSectionItem(item);
    if (!unique.has(article.Slug)) {
      unique.set(article.Slug, article);
    }
  }

  return Array.from(unique.values());
};

export const getNoticeArticleBySlug = async (
  slug: string,
): Promise<NoticeArticle | null> => {
  const articles = await getNoticeArticles();
  return articles.find((item) => item.Slug === slug) || null;
};
