export type SocialMediaLink = {
  type: string;
  url: string;
};

export interface CreatorInfo {
  name: string;
  imgProfile: string;
  bio: string;
  socialMedias: SocialMediaLink[];
}

export interface NewsCreators {
  Owner: CreatorInfo;
  Colaborators: CreatorInfo[];
}

export interface NoticeArticle {
  ImgUrl: string;
  Title: string;
  Description: string;
  Creator: string;
  Category: string;
  CreatedAt: string;
  CommentsCount: number;
  isSubscriber: boolean;
  Slug: string;
  notice: string;
  Creators: NewsCreators;
}

export const DEFAULT_PROFILE_IMAGE = "/images/Nicholas-Emery.png";

export const normalizeCreator = (
  creator?: Partial<CreatorInfo> | null,
  fallbackName = "newsly",
  fallbackBio = "",
): CreatorInfo => ({
  name: creator?.name?.trim() || fallbackName,
  imgProfile: creator?.imgProfile?.trim() || DEFAULT_PROFILE_IMAGE,
  bio: creator?.bio?.trim() || fallbackBio,
  socialMedias: Array.isArray(creator?.socialMedias)
    ? creator.socialMedias.filter(
        (media: Partial<SocialMediaLink>): media is SocialMediaLink =>
          Boolean(media?.type?.trim()) && Boolean(media?.url?.trim()),
      )
    : [],
});

export const normalizeCreators = (
  creators?: Partial<NewsCreators> | null,
  fallbackName = "newsly",
  fallbackBio = "",
): NewsCreators => ({
  Owner: normalizeCreator(creators?.Owner, fallbackName, fallbackBio),
  Colaborators: Array.isArray(creators?.Colaborators)
    ? creators.Colaborators.map((collaborator, index) =>
        normalizeCreator(collaborator, `colaborador ${index + 1}`),
      )
    : [],
});

export const slugifyNewsValue = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "newsly";
