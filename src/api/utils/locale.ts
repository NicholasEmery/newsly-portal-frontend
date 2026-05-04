import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

type AppLocale = (typeof routing.locales)[number];

const normalizeLocaleToken = (value: string) =>
  value.trim().toLowerCase().replace("_", "-");

const isSupportedLocale = (value: string): value is AppLocale =>
  routing.locales.includes(value as AppLocale);

const resolveLocaleFromHeader = (
  headerValue: string | null,
): AppLocale | null => {
  if (!headerValue) return null;

  const rawCandidates = headerValue
    .split(",")
    .map((entry) => entry.split(";")[0])
    .filter(Boolean);

  for (const candidate of rawCandidates) {
    const normalizedCandidate = normalizeLocaleToken(candidate);

    if (isSupportedLocale(normalizedCandidate)) {
      return normalizedCandidate;
    }

    const baseLocale = normalizedCandidate.split("-")[0];
    const matchedLocale = routing.locales.find(
      (locale) => locale === baseLocale || locale.startsWith(`${baseLocale}-`),
    );

    if (matchedLocale) {
      return matchedLocale;
    }
  }

  return null;
};

/**
 * Extracts the locale from the NEXT_LOCALE cookie in the request.
 * Falls back to Accept-Language and then default locale.
 */
export function getLocaleFromRequest(request: NextRequest): string {
  const cookieLocale = normalizeLocaleToken(
    request.cookies.get("NEXT_LOCALE")?.value || "",
  );

  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const localeFromHeader = resolveLocaleFromHeader(
    request.headers.get("accept-language"),
  );

  return localeFromHeader || routing.defaultLocale;
}
