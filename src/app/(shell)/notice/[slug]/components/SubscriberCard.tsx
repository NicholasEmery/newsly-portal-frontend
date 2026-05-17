"use client";

import Link from "next/link";
import { useAuth } from "@/app/components/client/providers/AuthProvider";

type SubscriberCardTexts = {
  badge: string;
  titleGuest: string;
  titleMember: string;
  titlePremium: string;
  descriptionGuest: string;
  descriptionMember: string;
  descriptionPremium: string;
  primaryGuest: string;
  primaryMember: string;
  primaryPremium: string;
  secondaryGuest: string;
  secondaryPremium: string;
  secondaryPrompt: string;
  signedInAs: string;
};

type SubscriberCardProps = {
  className?: string;
  texts: SubscriberCardTexts;
};

const cardBaseClassName =
  "relative mx-auto w-full min-w-82 max-w-82 overflow-hidden rounded-[32px] border border-slate-100 bg-white px-6 py-8 text-center text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-[0_18px_50px_rgba(2,6,23,0.45)] sm:px-7";

const crownIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 48 48"
    className="h-12 w-12 text-indigo-600"
    fill="none"
  >
    <path
      d="M10 18L18 25L24 12L30 25L38 18L35 34H13L10 18Z"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <path
      d="M10 18L18 25L24 12L30 25L38 18L35 34H13L10 18Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M14 38H34"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

function LoadingState({
  className = "",
}: Pick<SubscriberCardProps, "className">) {
  return (
    <aside className={`${cardBaseClassName} ${className} animate-pulse`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_52%)] dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_55%)]" />
      <div className="mx-auto mb-7 h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mx-auto mb-4 h-7 w-44 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mx-auto mb-6 h-4 w-56 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mx-auto h-12 w-44 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mx-auto mt-4 h-4 w-48 rounded-full bg-slate-200 dark:bg-slate-700" />
    </aside>
  );
}

export default function SubscriberCard({
  className = "",
  texts,
}: SubscriberCardProps) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <LoadingState className={className} />;
  }

  if (auth.isPremium) {
    return null;
  }

  const title = auth.isPremium
    ? texts.titlePremium
    : auth.isAuthenticated
      ? texts.titleMember
      : texts.titleGuest;

  const description = auth.isPremium
    ? texts.descriptionPremium
    : auth.isAuthenticated
      ? texts.descriptionMember
      : texts.descriptionGuest;

  const primaryHref = auth.isAuthenticated
    ? auth.isPremium
      ? "/auth/account"
      : "/auth/account?mode=signup"
    : "/auth/account?mode=signup";

  const primaryLabel = auth.isPremium
    ? texts.primaryPremium
    : auth.isAuthenticated
      ? texts.primaryMember
      : texts.primaryGuest;

  const secondaryLabel = auth.isPremium
    ? texts.secondaryPremium
    : texts.secondaryGuest;
  const displayName =
    auth.user?.fullName?.trim() ||
    auth.user?.name?.trim() ||
    auth.user?.email?.trim() ||
    "";

  const handleSignOut = async () => {
    await auth.signOut();
  };

  return (
    <aside className={`${cardBaseClassName} ${className}`}>
      <div className="mb-7 flex justify-center">{crownIcon}</div>

      {auth.isPremium && (
        <div className="mb-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {texts.badge}
        </div>
      )}

      <h2 className="mx-auto max-w-[14ch] text-[1.72rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[1.9rem] lg:text-[2rem]">
        {title}
      </h2>

      {displayName && auth.isAuthenticated && (
        <p className="mt-2 text-[0.85rem] font-medium text-slate-500 dark:text-slate-400">
          {texts.signedInAs} {displayName}
        </p>
      )}

      <p className="mx-auto mt-4 max-w-[22ch] text-[0.98rem] leading-7 text-slate-600 dark:text-slate-300 sm:max-w-[24ch]">
        {description}
      </p>

      <Link
        href={primaryHref}
        className="mt-8 inline-flex min-w-40 items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-[1rem] font-bold text-white shadow-[0_12px_30px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
      >
        {primaryLabel}
      </Link>

      <div className="mt-4 text-[0.95rem] text-slate-600 dark:text-slate-300">
        <span>{texts.secondaryPrompt} </span>
        {auth.isAuthenticated ? (
          <button
            type="button"
            onClick={() => {
              void handleSignOut();
            }}
            className="font-bold text-slate-900 underline decoration-2 underline-offset-4 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
          >
            {secondaryLabel}
          </button>
        ) : (
          <Link
            href="/auth/account?mode=login"
            className="font-bold text-slate-900 underline decoration-2 underline-offset-4 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </aside>
  );
}
