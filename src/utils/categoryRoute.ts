export type CategoryRouteSource = {
  label: string;
  Slug: string;
};

const normalizeCategoryLabel = (value: string) => value.trim().toLowerCase();

export const isCategoryRouteSource = (
  value: unknown,
): value is CategoryRouteSource => {
  if (!value || typeof value !== "object") return false;

  const entry = value as Record<string, unknown>;
  return typeof entry.label === "string" && typeof entry.Slug === "string";
};

export const resolveCategoryHref = (
  categoryLabel: string,
  categories: CategoryRouteSource[],
): string | null => {
  const normalizedCategoryLabel = normalizeCategoryLabel(categoryLabel);

  if (!normalizedCategoryLabel) {
    return null;
  }

  const matchedCategory = categories.find(
    (category) =>
      normalizeCategoryLabel(category.label) === normalizedCategoryLabel,
  );

  return matchedCategory?.Slug ?? null;
};

export const buildCategoryHrefMap = (categories: CategoryRouteSource[]) => {
  return categories.reduce<Record<string, string>>((accumulator, category) => {
    const key = normalizeCategoryLabel(category.label);

    if (!key || !category.Slug) {
      return accumulator;
    }

    accumulator[key] = category.Slug;
    return accumulator;
  }, {});
};
