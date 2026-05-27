// Prefer explicit NEWSLY_ENV tags and fall back to NODE_ENV.
const rawPublicEnv = (
  process.env.NEXT_PUBLIC_NEWSLY_ENV ||
  process.env.NEWSLY_ENV ||
  process.env.NODE_ENV ||
  "production"
)
  .trim()
  .toLowerCase();

export const IS_DEV_BUILD = rawPublicEnv === "development";
