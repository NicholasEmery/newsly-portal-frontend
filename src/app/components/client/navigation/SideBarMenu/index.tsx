"use client";

import { useGlobalStore } from "@/app/store/stateGlobals";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import {
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiMail,
  FiLogOut,
  FiSettings,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "@/app/components/client/providers/AuthProvider";

type SidebarLink = {
  key: string;
  href?: string;
  icon: ReactNode;
  destructive?: boolean;
  cta?: boolean;
  badgeKey?: string;
  onClick?: () => void | Promise<void>;
};

type SidebarSection = {
  key: string;
  titleKey: string;
  items: SidebarLink[];
};

const SidebarMenu = () => {
  const { open, setOpen } = useGlobalStore();
  const t = useTranslations("sidebar");
  const auth = useAuth();

  const accountState = !auth.isAuthenticated
    ? "guest"
    : auth.isPremium
      ? "premium"
      : "member";

  const stateMeta = {
    guest: {
      titleKey: "guestTitle",
      summaryKey: "guestSummary",
      badgeKey: "guestBadge",
    },
    member: {
      titleKey: "memberTitle",
      summaryKey: "memberSummary",
      badgeKey: "memberBadge",
    },
    premium: {
      titleKey: "premiumTitle",
      summaryKey: "premiumSummary",
      badgeKey: "premiumBadge",
    },
  } as const;

  const sections = useMemo<SidebarSection[]>(() => {
    const supportSection: SidebarSection = {
      key: "support",
      titleKey: "supportSection",
      items: [
        { key: "help", icon: <FiSettings size={17} />, badgeKey: "soon" },
        { key: "privacy", icon: <FiSettings size={17} />, badgeKey: "soon" },
        { key: "terms", icon: <FiSettings size={17} />, badgeKey: "soon" },
      ],
    };

    if (accountState === "guest") {
      return [
        {
          key: "access",
          titleKey: "accessSection",
          items: [
            {
              key: "signIn",
              href: "/auth/account?mode=login",
              icon: <FiUser size={17} />,
              cta: true,
            },
            {
              key: "createAccount",
              href: "/auth/account?mode=signup",
              icon: <FiCreditCard size={17} />,
              badgeKey: "soon",
            },
            {
              key: "newsletter",
              href: "/newsletter",
              icon: <FiMail size={17} />,
            },
          ],
        },
        supportSection,
      ];
    }

    if (accountState === "premium") {
      return [
        {
          key: "account",
          titleKey: "accountSection",
          items: [
            { key: "profile", href: "/auth/account", icon: <FiUser size={17} /> },
            {
              key: "accountSettings",
              icon: <FiSettings size={17} />,
              badgeKey: "soon",
            },
          ],
        },
        {
          key: "premium",
          titleKey: "premiumSection",
          items: [
            { key: "subscriberArea", href: "/subscribers", icon: <FiStar size={17} /> },
            {
              key: "manageSubscription",
              icon: <FiCreditCard size={17} />,
              badgeKey: "soon",
            },
            {
              key: "billing",
              icon: <FiCreditCard size={17} />,
              badgeKey: "soon",
            },
          ],
        },
        supportSection,
      ];
    }

    return [
      {
        key: "account",
        titleKey: "accountSection",
        items: [
          { key: "profile", href: "/auth/account", icon: <FiUser size={17} /> },
          {
            key: "accountSettings",
            icon: <FiSettings size={17} />,
            badgeKey: "soon",
          },
          {
            key: "readingHistory",
            icon: <FiClock size={17} />,
            badgeKey: "soon",
          },
          {
            key: "signOut",
            icon: <FiLogOut size={17} />,
            destructive: true,
            onClick: async () => {
              await auth.signOut();
              setOpen(false);
            },
          },
        ],
      },
      supportSection,
    ];
  }, [accountState]);

  const resolveItemClassName = (item: SidebarLink) => {
    if (item.destructive) {
      return "group flex w-full items-center justify-between rounded-xl border border-red-300/70 bg-red-50/80 px-3.5 py-2.5 text-sm font-semibold text-red-700 transition-colors duration-250 hover:bg-red-100 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20";
    }

    if (item.cta) {
      return "group flex w-full items-center justify-between rounded-xl border border-primary-blue/20 bg-primary-blue/8 px-3.5 py-2.5 text-sm font-semibold text-primary-blue transition-colors duration-250 hover:bg-primary-blue hover:text-white";
    }

    return "group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-250 hover:bg-gray-200/80 dark:text-gray-100 dark:hover:bg-white/10";
  };

  const renderBadge = (badgeKey?: string) => {
    if (!badgeKey) return null;

    const badgeClasses =
      badgeKey === "soon"
        ? "border-gray-300 text-gray-500 dark:border-white/20 dark:text-gray-300"
        : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300";

    return (
      <span
        className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${badgeClasses}`}
      >
        {t(badgeKey)}
      </span>
    );
  };

  const renderMenuItem = (item: SidebarLink) => {
    const content = (
      <>
        <span className="inline-flex min-w-0 items-center gap-2">
          <span className="text-inherit">{item.icon}</span>
          <span className="truncate">{t(item.key)}</span>
        </span>
        <span className="flex items-center gap-2">
          {renderBadge(item.badgeKey)}
          <FiChevronRight size={16} className="opacity-50" />
        </span>
      </>
    );

    if (item.href) {
      return (
        <Link
          href={item.href}
          onClick={() => setOpen(false)}
          className={resolveItemClassName(item)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        type="button"
        className={resolveItemClassName(item)}
        onClick={item.onClick}
      >
        {content}
      </button>
    );
  };

  const stateInfo = stateMeta[accountState];

  return (
    <div className="fixed inset-0 z-1200 pointer-events-none">
      <button
        type="button"
        aria-label={t("menu")}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
      />

      <aside
        className={`fixed pointer-events-auto top-0 left-0 shrink-0 h-screen max-h-screen overflow-y-auto bg-linear-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-r border-gray-200/80 dark:border-white/10 shadow-2xl transition-transform duration-500 ease-in-out w-72 min-w-[18rem] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col gap-8 p-6 text-black">
          <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-gray-900/60">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-blue/25 bg-primary-blue/8 text-primary-blue">
                <FiUser size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t(stateInfo.titleKey)}
                  </p>
                  <span className="rounded-full border border-primary-blue/20 bg-primary-blue/8 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary-blue">
                    {t(stateInfo.badgeKey)}
                  </span>
                </div>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {t(stateInfo.summaryKey)}
                </p>
                {accountState === "guest" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary-blue/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-primary-blue">
                      {t("guestBadge")}
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                      {t("newsletter")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-primary-blue/20 bg-primary-blue/8 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-blue">
              {t("menu")}
            </span>

            {sections.map((section) => (
              <section
                key={section.key}
                className="rounded-2xl border border-gray-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-gray-900/60"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t(section.titleKey)}
                </p>
                <ul className="flex flex-col gap-2">
                  {section.items.map((item) => (
                    <li key={item.key}>{renderMenuItem(item)}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidebarMenu;
