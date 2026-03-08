// Node exposes NODE_ENV automatically; development is the only
// non-production build-target we care about.
const rawPublicEnv = process.env.NODE_ENV.trim().toLowerCase();

export const IS_DEV_BUILD = rawPublicEnv === "development";
