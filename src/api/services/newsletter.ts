import { api } from "@/api/connection/http";
import {
  NewsletterSubscribeResponseSchema,
  type NewsletterSubscribeDto,
  type NewsletterSubscribeResponseDto,
} from "@/api/schemas/newsletter";
import { IS_DEV_BUILD } from "@/config/buildTarget";

/**
 * Subscribes an email to the newsletter (SERVER-SIDE ONLY)
 * In production: calls external API
 * In development: uses .dev implementation with fallback to mocks
 *
 * IMPORTANT: This function should only be called on the server (API routes, Server Components, etc).
 */
export const subscribeNewsletter = async (
  data: NewsletterSubscribeDto,
): Promise<NewsletterSubscribeResponseDto> => {
  if (IS_DEV_BUILD) {
    // Delegates to dev implementation that has mock logic
    const mod = await import("./newsletter.dev");
    return mod.subscribeNewsletter(data);
  }

  // In production: calls external API
  const response = await api.post("/newsletter/subscribe", data);
  return NewsletterSubscribeResponseSchema.parse(response.data);
};
