import Link from "next/link";

type SectionEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

const SectionEmptyState = ({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: SectionEmptyStateProps) => {
  return (
    <div
      className={`w-full rounded-2xl border border-dashed border-gray-300/90 bg-gray-50/70 p-6 text-center dark:border-gray-700 dark:bg-gray-900/40 ${className || ""}`}
      data-cy="section-empty-state"
    >
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-primary-blue px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};

export default SectionEmptyState;
