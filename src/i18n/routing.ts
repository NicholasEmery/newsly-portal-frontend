import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt-br", "en"],
  defaultLocale: "pt-br",
  localePrefix: "never",
  localeCookie: {
    name: "NEXT_LOCALE",
  },
});
