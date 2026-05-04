import { createDevGetService } from "@/api/utils/serviceHelpers";
import type { Category } from "@/api/schemas/categories";

/**
 * Fetches categories for navigation
 * Uses helper that manages API vs mocks automatically
 */
export const getCategories = async (locale?: string): Promise<Category[]> => {
  return createDevGetService({
    endpoint: "/categories",
    headers: locale ? { "Accept-Language": locale } : undefined,
    mockLoader: async (mocks) => {
      const nav =
        mocks.NAV_ALL_CATEGORIES || mocks.NAV_PRIMARY_CATEGORIES || [];
      if (!Array.isArray(nav)) return [];

      return nav.map((c: any) => ({
        label: String(c.label || ""),
        Slug: String(c.Slug || c.slug || c.href || "#"),
      }));
    },
  });
};
