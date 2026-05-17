import { api, checkApiReadiness } from "@/api/connection/http";
import {
  NewsletterSubscribeResponseSchema,
  type NewsletterSubscribeDto,
  type NewsletterSubscribeResponseDto,
} from "@/api/schemas/newsletter";

/**
 * Subscribes an email to the newsletter (SERVER-SIDE ONLY)
 * In production: calls external API
 * In development: uses API (no mock fallback)
 *
 * IMPORTANT: This function should only be called on the server (API routes, Server Components, etc).
 */
export const subscribeNewsletter = async (
  data: NewsletterSubscribeDto,
): Promise<NewsletterSubscribeResponseDto> => {
  const apiReady = await checkApiReadiness(1500);
  if (!apiReady) {
    throw new Error("API not ready");
  }

  // If readiness passed, use API (without mock fallback)
  const response = await api.post("/newsletter/subscribe", data);
  return NewsletterSubscribeResponseSchema.parse(response.data);
};
