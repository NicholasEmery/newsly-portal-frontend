export interface NavCategory {
  label: string;
  Slug: string;
}

export const NAV_PRIMARY_CATEGORIES: NavCategory[] = [
  { label: "Frontend", Slug: "/frontend" },
  { label: "Backend", Slug: "/backend" },
  { label: "DevOps", Slug: "/devops" },
  { label: "Cloud", Slug: "/cloud" },
];

export const NAV_MORE_CATEGORIES: NavCategory[] = [
  { label: "Frameworks", Slug: "/frameworks" },
  { label: "Tooling", Slug: "/tooling" },
  { label: "AI/ML", Slug: "/ai-ml" },
  { label: "Databases", Slug: "/databases" },
  { label: "Security", Slug: "/security" },
  { label: "Performance", Slug: "/performance" },
];

export const NAV_ALL_CATEGORIES: NavCategory[] = [
  ...NAV_PRIMARY_CATEGORIES,
  ...NAV_MORE_CATEGORIES,
];
