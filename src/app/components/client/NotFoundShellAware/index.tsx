"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppShell } from "@/app/AppShell";

type Props = {
  children: ReactNode;
};

export default function NotFoundShellAware({ children }: Props) {
  const [hasAppShell, setHasAppShell] = useState<boolean | null>(null);

  useEffect(() => {
    const exists = !!document.querySelector('[data-appshell]');
    setHasAppShell(exists);
  }, []);

  if (hasAppShell === null) return null;
  if (hasAppShell) return <>{children}</>;

  return <AppShell>{children}</AppShell>;
}
