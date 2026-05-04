import { createDevPostService } from "@/api/utils/serviceHelpers";
import type {
  NewsletterSubscribeDto,
  NewsletterSubscribeResponseDto,
} from "@/api/schemas/newsletter";

/**
 * Dev implementation of newsletter subscription
 * Uses createDevPostService helper that manages API vs Mocks automatically
 */
export const subscribeNewsletter = async (
  data: NewsletterSubscribeDto,
): Promise<NewsletterSubscribeResponseDto> => {
  return createDevPostService({
    endpoint: "/newsletter/subscribe",
    data,
    mockLoader: (mocks, requestData) => {
      // Simulate duplicate email check
      const subscribers = mocks.NEWSLETTER_SUBSCRIBERS_MOCK || [];
      if (subscribers.includes(requestData.email)) {
        return (
          mocks.NEWSLETTER_ERROR_DUPLICATE_MOCK || {
            success: false,
            message: "This email is already registered.",
          }
        );
      }

      // Return mocked success
      return (
        mocks.NEWSLETTER_SUCCESS_RESPONSE_MOCK || {
          success: true,
          message: "Successfully subscribed!",
        }
      );
    },
  });
};
