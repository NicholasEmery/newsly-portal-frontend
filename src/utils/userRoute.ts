export const buildCreatorRoute = (
  creator: string,
): string => {
  return `/creators/${encodeURIComponent(creator.toLowerCase().replace(/\s+/g, "-"))}`;
};
