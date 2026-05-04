import {
  requestJson,
  resolveDataSourceMode,
  checkApiReadiness,
} from "@/api/connection/http";
import { IS_DEV_BUILD } from "@/config/buildTarget";
import { SocialLinksSchema, type SocialLink } from "@/api/schemas/socialLinks";

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  if (IS_DEV_BUILD) {
    const mod = await import("./socialLinks.dev");
    return mod.getSocialLinks();
  }

  resolveDataSourceMode();

  const apiReady = await checkApiReadiness(1500);
  if (!apiReady) return [];

  try {
    return await requestJson(
      `${process.env.NEXT_PUBLIC_API_URL}/social-links`,
      SocialLinksSchema,
    );
  } catch {
    return [];
  }
};
