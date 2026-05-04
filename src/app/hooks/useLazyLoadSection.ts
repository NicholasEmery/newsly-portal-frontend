"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/app/hooks/useIntersectionObserver";

type UseLazyLoadSectionOptions<T> = {
  fetcher: () => Promise<T>;
  rootMargin?: string;
  threshold?: number;
};

type UseLazyLoadSectionResult<T> = {
  targetRef: ReturnType<typeof useIntersectionObserver>["targetRef"];
  data: T | null;
  isLoading: boolean;
  hasError: boolean;
};

export const useLazyLoadSection = <T>({
  fetcher,
  rootMargin = "180px 0px",
  threshold = 0.1,
}: UseLazyLoadSectionOptions<T>): UseLazyLoadSectionResult<T> => {
  const { targetRef, isVisible } = useIntersectionObserver({
    rootMargin,
    threshold,
  });

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (!isVisible || data || isLoading || hasAttempted) return;

    setHasAttempted(true);
    setIsLoading(true);
    setHasError(false);

    void fetcher()
      .then((response) => {
        setData(response);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [data, fetcher, hasAttempted, isLoading, isVisible]);

  return { targetRef, data, isLoading, hasError };
};
