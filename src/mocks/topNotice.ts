import { TOP_NOTICE_NEWS } from "./newsCollections";
import { formatCreatedAtDisplay, type NewsCreators } from "./homeFactory";

// Fallback de criador caso o objeto não tenha a estrutura esperada
const defaultCreators: NewsCreators = {
  Owner: {
    name: "newsly",
    imgProfile: "",
    bio: "Autor newsly",
    socialMedias: [],
  },
  Colaborators: [],
};

export const TOP_NOTICE_MOCK = {
  ImgUrl: TOP_NOTICE_NEWS?.ImgUrl ?? "/images/imageScience.png",
  Category: TOP_NOTICE_NEWS?.Category ?? "Frontend",
  Creator:
    TOP_NOTICE_NEWS?.Creator ??
    TOP_NOTICE_NEWS?.Creators?.Owner?.name ??
    "newsly",
  Creators: TOP_NOTICE_NEWS?.Creators ?? defaultCreators,
  Title: TOP_NOTICE_NEWS?.Title ?? "Top Notice",
  Description:
    TOP_NOTICE_NEWS?.Description ?? "Top notice em destaque na home.",
  CreatedAt: TOP_NOTICE_NEWS?.CreatedAt ?? formatCreatedAtDisplay(new Date()),
  Slug: TOP_NOTICE_NEWS?.Slug ?? "top-notice",
};
