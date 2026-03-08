const DEFAULT_PAGE = 1;

const toPositiveInt = (
  value: string | number | null | undefined,
): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  const normalized = Math.trunc(parsed);
  if (normalized <= 0) return undefined;
  return normalized;
};

export const parsePaginationParams = (
  searchParams: URLSearchParams,
): { limit?: number; page: number } => {
  const limit = toPositiveInt(searchParams.get("limit"));
  const page = toPositiveInt(searchParams.get("page")) ?? DEFAULT_PAGE;
  return { limit, page };
};

export const paginateArray = <T>(
  items: T[],
  options: { limit?: number; page?: number },
): T[] => {
  const limit = toPositiveInt(options.limit);
  const page = toPositiveInt(options.page) ?? DEFAULT_PAGE;

  if (!limit) return items;

  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
};
