import { NotFoundLottie } from "@/app/components/client/media/NotFoundLottie";
import SystemStatusPanel from "@/app/components/server/feedback/SystemStatusPanel";
import { cookies } from "next/headers";
import { ServiceUnavailableReasonSchema } from "@/api/schemas/system";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function ServiceUnavailablePage() {
  const t = await getTranslations("serviceUnavailable");
  // Read reason from cookie
  const cookieStore = await cookies();
  const cookieReason = cookieStore.get("serviceUnavailableReason")?.value;

  // Validate reason with Zod
  const isValidReason =
    cookieReason &&
    ServiceUnavailableReasonSchema.safeParse(cookieReason).success;
  let resolvedReason = cookieReason;

  // Fallback: if no valid reason, show special content
  if (!isValidReason) {
    return (
      <main className="w-full min-h-dvh flex items-center justify-center px-6 py-10 bg-gray-50 dark:bg-gray-800">
        <SystemStatusPanel
          badge={t("cookiesRequired.badge")}
          title={t("cookiesRequired.title")}
          description={t("cookiesRequired.description")}
          secondaryDescription={t("cookiesRequired.secondaryDescription")}
          actionHref="/"
          actionLabel={t("cookiesRequired.actionLabel")}
          illustration={<NotFoundLottie />}
        />
      </main>
    );
  }

  const contentByReason = {
    "api-unavailable": {
      badge: t("apiUnavailable.badge"),
      title: t("apiUnavailable.title"),
      description: t("apiUnavailable.description"),
      secondaryDescription: t("apiUnavailable.secondaryDescription"),
      actionLabel: t("apiUnavailable.actionLabel"),
    },
  } as const;

  const devContentByReason = {
    "mock-directory-missing-dev": {
      badge: t("mockDirectoryMissing.badge"),
      title: t("mockDirectoryMissing.title"),
      description: t("mockDirectoryMissing.description"),
      secondaryDescription: t("mockDirectoryMissing.secondaryDescription"),
      actionLabel: t("mockDirectoryMissing.actionLabel"),
    },
    "datasource-env-missing-dev": {
      badge: t("datasourceEnvMissing.badge"),
      title: t("datasourceEnvMissing.title"),
      description: t("datasourceEnvMissing.description"),
      secondaryDescription: t("datasourceEnvMissing.secondaryDescription"),
      actionLabel: t("datasourceEnvMissing.actionLabel"),
    },
    "api-unavailable-use-mocks": {
      badge: t("apiUnavailableUseMocks.badge"),
      title: t("apiUnavailableUseMocks.title"),
      description: t("apiUnavailableUseMocks.description"),
      secondaryDescription: t("apiUnavailableUseMocks.secondaryDescription"),
      actionLabel: t("apiUnavailableUseMocks.actionLabel"),
    },
    "api-and-mock-unavailable": {
      badge: t("apiAndMockUnavailable.badge"),
      title: t("apiAndMockUnavailable.title"),
      description: t("apiAndMockUnavailable.description"),
      secondaryDescription: t("apiAndMockUnavailable.secondaryDescription"),
      actionLabel: t("apiAndMockUnavailable.actionLabel"),
    },
  } as const;

  const content =
    devContentByReason[resolvedReason as keyof typeof devContentByReason] ??
    contentByReason[resolvedReason as keyof typeof contentByReason] ??
    contentByReason["api-unavailable"];

  return (
    <main className="w-full min-h-dvh flex items-center justify-center px-6 py-10 bg-gray-50 dark:bg-gray-800">
      <SystemStatusPanel
        badge={content.badge}
        title={content.title}
        description={content.description}
        secondaryDescription={content.secondaryDescription}
        actionHref="/"
        actionLabel={content.actionLabel}
        illustration={<NotFoundLottie />}
      />
    </main>
  );
}
