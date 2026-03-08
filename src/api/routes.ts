const API_PREFIX = "/api";

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const joinRoute = (...parts: string[]) => {
  const normalized = parts
    .map((part) => trimSlashes(part))
    .filter((part) => part.length > 0)
    .join("/");

  return `/${normalized}`;
};

const SECTIONS_PREFIX = joinRoute(API_PREFIX, "sections");

// Central map of internal/frontend API routes. Keep values absolute and typed.
export const routes = {
  sections: {
    topNotice: joinRoute(SECTIONS_PREFIX, "top-notice"),
    trendingNow: joinRoute(SECTIONS_PREFIX, "trending-now"),
    latestNews: joinRoute(SECTIONS_PREFIX, "latest-news"),
    homeGrids: joinRoute(SECTIONS_PREFIX, "home-grids"),
    subscriberNews: joinRoute(SECTIONS_PREFIX, "subscriber-news"),
  },
  categories: joinRoute(API_PREFIX, "categories"),
  newsletter: joinRoute(API_PREFIX, "newsletter"),
  system: {
    health: joinRoute(API_PREFIX, "health"),
    ready: joinRoute(API_PREFIX, "ready"),
  },
} as const;

export type Routes = typeof routes;
export type RouteGroup = keyof Routes;
export type RouteName<G extends RouteGroup> = keyof Routes[G];
export type RoutePath = Routes[RouteGroup][keyof Routes[RouteGroup]];

export const getRoute = <G extends RouteGroup, N extends RouteName<G>>(
  group: G,
  name: N,
): Routes[G][N] => routes[group][name];

export const withQuery = (
  path: string,
  query: Record<string, string | number | boolean | null | undefined> = {},
) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.set(key, String(value));
  });

  const serialized = params.toString();
  if (!serialized) return path;
  return `${path}?${serialized}`;
};
