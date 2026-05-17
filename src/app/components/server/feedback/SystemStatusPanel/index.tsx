import { ReactNode } from "react";

type SystemStatusPanelProps = {
  badge: string;
  title: string;
  description: string;
  secondaryDescription?: ReactNode;
  actionHref: string;
  actionLabel: string;
  illustration: ReactNode;
};

export default function SystemStatusPanel({
  badge,
  title,
  description,
  secondaryDescription,
  actionHref,
  actionLabel,
  illustration,
}: SystemStatusPanelProps) {
  return (
    <section className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center rounded-2xl bg-white dark:bg-gray-700 p-6 md:p-10 shadow-sm lg:auto-cols-fr">
      <div className="flex flex-col gap-4 md:gap-6 order-2 lg:order-1">
        <span className="text-sm font-semibold tracking-wide uppercase text-primary-blue">
          {badge}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
        {secondaryDescription && (
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            {secondaryDescription}
          </p>
        )}
        <div>
          <a
            href={actionHref}
            className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium bg-primary-blue text-white hover:bg-blue-600 transition-colors"
          >
            {actionLabel}
          </a>
        </div>
      </div>

      <div className="w-full max-w-sm md:max-w-md mx-auto order-1 lg:order-2">
        {illustration}
      </div>
    </section>
  );
}
