export type SectionFilterLabelKey =
  | "spotlight"
  | "trendingStories"
  | "longreads"
  | "dontMissOut";

const sectionFilterLabelKeyByNormalized: Record<string, SectionFilterLabelKey> =
  {
    spotlight: "spotlight",
    trendingstories: "trendingStories",
    longreads: "longreads",
    dontmissout: "dontMissOut",
  };

const normalizeFilterLabel = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

export const getSectionFilterLabelKey = (
  value: string,
): SectionFilterLabelKey | null => {
  const normalizedLabel = normalizeFilterLabel(value);
  if (!normalizedLabel) return null;

  return sectionFilterLabelKeyByNormalized[normalizedLabel] || null;
};

export const isDontMissOutFilterLabel = (value: string): boolean =>
  getSectionFilterLabelKey(value) === "dontMissOut";

export const resolveSectionFilterLabel = (
  value: string,
  translate: (key: `filterLabels.${SectionFilterLabelKey}`) => string,
): string => {
  const key = getSectionFilterLabelKey(value);
  if (!key) return value;

  return translate(`filterLabels.${key}`);
};
