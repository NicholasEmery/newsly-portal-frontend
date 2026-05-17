import {
  requestJsonWithLocale,
  resolveDataSourceMode,
} from "@/api/connection/http";
import { IS_DEV_BUILD } from "@/config/buildTarget";
import { CategoriesSchema, type Category } from "@/api/schemas/categories";
import { createDevGetService } from "@/api/utils/serviceHelpers";
import { loadMocks } from "@/api/mocks";

export const getCategories = async (locale?: string): Promise<Category[]> => {
  const mocks = loadMocks();
  const mockCats = (mocks?.CATEGORIES_MOCK as Category[]) || [];

  const result = await createDevGetService<Category[]>({
    endpoint: "/categories",
    mockLoader: () => mockCats,
  });

  if (locale) {
    // If we have a locale, ensure the data is validated via schema
    return CategoriesSchema.parse(result);
  }

  return CategoriesSchema.parse(result);
};

export const getResolvedCategoriesMode = () => resolveDataSourceMode();
