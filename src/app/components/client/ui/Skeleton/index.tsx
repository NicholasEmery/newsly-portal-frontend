import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-700/50",
        className,
      )}
      aria-hidden
    />
  );
};

export default Skeleton;
