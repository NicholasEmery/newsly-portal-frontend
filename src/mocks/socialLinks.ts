export type SocialLinkKey =
  | "facebook"
  | "instagram"
  | "twitter"
  | "youtube"
  | "pinterest";

export interface SocialLinkMock {
  key: SocialLinkKey;
  href: string;
}

export const SOCIAL_LINKS_MOCK: SocialLinkMock[] = [
  { key: "facebook", href: "https://facebook.com/newsly" },
  { key: "instagram", href: "https://instagram.com/newsly" },
  { key: "twitter", href: "https://x.com/newsly" },
  { key: "youtube", href: "https://youtube.com/newsly" },
  { key: "pinterest", href: "https://pinterest.com/newsly" },
];
