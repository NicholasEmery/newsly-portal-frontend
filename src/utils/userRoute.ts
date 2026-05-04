const normalizeRouteSegment = (value: string): string =>
  encodeURIComponent(value.toLowerCase().trim().replace(/\s+/g, "-"));

const normalizeNoticeSlug = (slug: string): string =>
  slug
    .trim()
    .replace(/^\/+/, "")
    .replace(/^notice\/+/, "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => normalizeRouteSegment(segment))
    .join("/");

export const buildCreatorRoute = (creator: string): string => {
  return `/creators/${normalizeRouteSegment(creator)}`;
};

export const buildNoticeRoute = (slug: string): string => {
  const normalizedSlug = normalizeNoticeSlug(slug);

  if (!normalizedSlug) {
    return "/notice";
  }

  return `/notice/${normalizedSlug}`;
};
