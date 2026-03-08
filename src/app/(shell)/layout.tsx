import { ReactNode } from "react";
import { AppShell } from "@/app/AppShell";
import { getDataSourceStatus } from "@/api/services/homeSections";
import { redirect } from "next/navigation";

export default async function ShellLayout({
  children,
}: {
  children: ReactNode;
}) {
  const status = await getDataSourceStatus();
  if (!status.canRender) {
    redirect(
      `/api/service-unavailable-redirect?reason=${encodeURIComponent(status.reason)}`,
    );
  }

  return <AppShell>{children}</AppShell>;
}
