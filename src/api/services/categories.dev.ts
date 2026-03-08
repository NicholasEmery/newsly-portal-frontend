import { createDevGetService } from "@/api/utils/serviceHelpers";
import type { Category } from "@/api/schemas/categories";

/**
 * Busca categorias para navegação
 * Usa helper que gerencia API vs mocks automaticamente
 */
export const getCategories = async (): Promise<Category[]> => {
  return createDevGetService({
    endpoint: "/categories",
    mockLoader: async (mocks) => {
      const nav =
        mocks.NAV_ALL_CATEGORIES || mocks.NAV_PRIMARY_CATEGORIES || [];
      if (!Array.isArray(nav)) return [];

      return nav.map((c: any) => ({
        label: String(c.label || ""),
        Slug: String(c.Slug || c.slug || c.href || "#"),
      }));
    },
    fallbackValue: [],
  });
};
