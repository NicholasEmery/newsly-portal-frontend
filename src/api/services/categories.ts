import {
  requestJson,
  resolveDataSourceMode,
  checkApiReadiness,
} from "@/api/connection/http";
import { IS_DEV_BUILD } from "@/config/buildTarget";
import { CategoriesSchema, type Category } from "@/api/schemas/categories";

// Production-aware function: in production we do not load mocks.
export const getCategories = async (): Promise<Category[]> => {
  if (IS_DEV_BUILD) {
    // delegate to dev implementation which may use mocks
    const mod = await import("./categories.dev");
    return mod.getCategories();
  }

  const mode = resolveDataSourceMode();

  // In production we expect API to be the source
  const apiReady = await checkApiReadiness(1500);
  if (!apiReady) return [];

  try {
    return await requestJson(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      CategoriesSchema,
    );
  } catch {
    return [];
  }
};

export const getResolvedCategoriesMode = () => resolveDataSourceMode();
