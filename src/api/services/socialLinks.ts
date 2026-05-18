// removed unused imports from http and buildTarget
import { SocialLinksSchema, type SocialLink } from "@/api/schemas/socialLinks";
import { createDevGetService } from "@/api/utils/serviceHelpers";
import { loadMocks } from "@/api/mocks";

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const mocks = loadMocks();
  const mockLinks = (mocks?.SOCIAL_LINKS_MOCK as SocialLink[]) || [];

  const result = await createDevGetService<SocialLink[]>({
    endpoint: "/social-links",
    mockLoader: () => mockLinks,
  });

  return SocialLinksSchema.parse(result);
};
