import { TOP_NOTICE_NEWS } from "./newsCollections";
import { formatCreatedAtDisplay } from "./homeFactory";

export const TOP_NOTICE_MOCK = {
  ImgUrl: TOP_NOTICE_NEWS?.ImgUrl || "/images/imageScience.png",
  Category: TOP_NOTICE_NEWS?.Category || "Frontend",
  Creator: TOP_NOTICE_NEWS?.Creator || "newsly",
  Title: TOP_NOTICE_NEWS?.Title || "Top Notice",
  Description: TOP_NOTICE_NEWS?.Description || "",
  CreatedAt: TOP_NOTICE_NEWS?.CreatedAt || formatCreatedAtDisplay(new Date()),
  Slug: TOP_NOTICE_NEWS?.Slug || "/",
};
