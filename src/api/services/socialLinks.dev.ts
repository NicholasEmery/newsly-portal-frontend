import { createDevGetService } from "@/api/utils/serviceHelpers";
import type { SocialLink } from "@/api/schemas/socialLinks";

const isSocialLink = (value: unknown): value is SocialLink => {
  if (!value || typeof value !== "object") return false;

  const entry = value as Record<string, unknown>;
  const validKey =
    entry.key === "facebook" ||
    entry.key === "instagram" ||
    entry.key === "twitter" ||
    entry.key === "youtube" ||
    entry.key === "pinterest";

  return validKey && typeof entry.href === "string";
};

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  return createDevGetService({
    endpoint: "/social-links",
    mockLoader: (mocks) => {
      const socialLinks = mocks.SOCIAL_LINKS_MOCK || [];
      if (!Array.isArray(socialLinks)) return [];

      return socialLinks.filter(isSocialLink);
    },
  });
};
