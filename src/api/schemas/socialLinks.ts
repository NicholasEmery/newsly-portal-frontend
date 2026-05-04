import { z } from "zod";

export const SocialLinkKeySchema = z.enum([
  "facebook",
  "instagram",
  "twitter",
  "youtube",
  "pinterest",
]);

export const SocialLinkSchema = z.object({
  key: SocialLinkKeySchema,
  href: z.string().url(),
});

export const SocialLinksSchema = SocialLinkSchema.array();

export type SocialLinkKey = z.infer<typeof SocialLinkKeySchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
