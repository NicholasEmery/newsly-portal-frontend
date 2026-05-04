import NotFoundShellAware from "@/app/components/client/NotFoundShellAware";
import { NotFoundLottie } from "@/app/components/client/media/NotFoundLottie";
import SystemStatusPanel from "@/app/components/server/feedback/SystemStatusPanel";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <NotFoundShellAware>
      <main className="w-full flex items-center justify-center px-4 md:px-6 py-4 md:py-6 overflow-hidden">
        <SystemStatusPanel
          badge={t("badge")}
          title={t("title")}
          description={t("description")}
          secondaryDescription={t("secondaryDescription")}
          actionHref="/"
          actionLabel={t("actionLabel")}
          illustration={<NotFoundLottie className="max-h-60 md:max-h-84" />}
        />
      </main>
    </NotFoundShellAware>
  );
}
