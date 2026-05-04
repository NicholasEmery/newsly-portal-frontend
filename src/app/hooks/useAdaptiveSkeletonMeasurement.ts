"use client";

import { useEffect, useRef, useState } from "react";

const SKELETON_RATIO_STORAGE_PREFIX = "newsly:skeleton-ratio:";
const SKELETON_RATIO_EVENT = "newsly:skeleton-ratio-updated";
const MIN_RATIO = 0.45;
const MAX_RATIO = 3;

const ratioCache = new Map<string, number>();

type RatioUpdateDetail = {
  cacheKey: string;
  ratio: number;
};

type AdaptiveSkeletonProbeOptions = {
  cacheKey: string;
  enabled?: boolean;
  minDelta?: number;
};

type AdaptiveSkeletonRatioOptions = {
  cacheKey: string;
  fallback: number;
};

export const SKELETON_RATIO_KEYS = {
  cardMediaDefault: "card-media-default",
  cardMediaWithCategory: "card-media-with-category",
  heroTopNoticeMedia: "hero-top-notice-media",
  latestHeroMedia: "latest-hero-media",
  subscriberHighlightMedia: "subscriber-highlight-media",
  subscriberBannerMedia: "subscriber-banner-media",
  trendingCardMedia: "trending-card-media",
} as const;

const toStorageKey = (cacheKey: string) =>
  `${SKELETON_RATIO_STORAGE_PREFIX}${cacheKey}`;

const clampRatio = (ratio: number) =>
  Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio));

const readStoredRatio = (cacheKey: string): number | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.sessionStorage.getItem(toStorageKey(cacheKey));

    if (!stored) {
      return null;
    }

    const parsed = Number.parseFloat(stored);

    if (!Number.isFinite(parsed)) {
      return null;
    }

    return clampRatio(parsed);
  } catch {
    return null;
  }
};

const persistRatio = (cacheKey: string, ratio: number) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(toStorageKey(cacheKey), String(ratio));
  } catch {
    // Ignore storage write failures (private mode/quota).
  }
};

const publishRatio = (
  cacheKey: string,
  nextRatio: number,
  minDelta: number,
): number | null => {
  const normalizedRatio = clampRatio(nextRatio);
  const previousRatio = ratioCache.get(cacheKey);

  if (
    typeof previousRatio === "number" &&
    Math.abs(previousRatio - normalizedRatio) < minDelta
  ) {
    return null;
  }

  ratioCache.set(cacheKey, normalizedRatio);
  persistRatio(cacheKey, normalizedRatio);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<RatioUpdateDetail>(SKELETON_RATIO_EVENT, {
        detail: {
          cacheKey,
          ratio: normalizedRatio,
        },
      }),
    );
  }

  return normalizedRatio;
};

export const useAdaptiveSkeletonProbe = <T extends HTMLElement>({
  cacheKey,
  enabled = true,
  minDelta = 0.04,
}: AdaptiveSkeletonProbeOptions) => {
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const targetElement = targetRef.current;

    if (!targetElement) {
      return;
    }

    let frameId = 0;

    const measure = () => {
      const rect = targetElement.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      publishRatio(cacheKey, rect.width / rect.height, minDelta);
    };

    const scheduleMeasure = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        measure();
      });
    };

    scheduleMeasure();

    const resizeObserver = new ResizeObserver(() => {
      scheduleMeasure();
    });

    resizeObserver.observe(targetElement);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      resizeObserver.disconnect();
    };
  }, [cacheKey, enabled, minDelta]);

  return targetRef;
};

export const useAdaptiveSkeletonRatio = ({
  cacheKey,
  fallback,
}: AdaptiveSkeletonRatioOptions) => {
  const [ratio, setRatio] = useState<number>(() => {
    if (typeof window === "undefined") {
      return fallback;
    }

    const inMemoryRatio = ratioCache.get(cacheKey);

    if (typeof inMemoryRatio === "number") {
      return inMemoryRatio;
    }

    const storedRatio = readStoredRatio(cacheKey);

    return typeof storedRatio === "number" ? storedRatio : fallback;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const inMemoryRatio = ratioCache.get(cacheKey);

    if (typeof inMemoryRatio === "number") {
      setRatio(inMemoryRatio);
      return;
    }

    const storedRatio = readStoredRatio(cacheKey);

    if (typeof storedRatio === "number") {
      ratioCache.set(cacheKey, storedRatio);
      setRatio(storedRatio);
      return;
    }

    setRatio(fallback);
  }, [cacheKey, fallback]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleRatioUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<RatioUpdateDetail>;

      if (customEvent.detail?.cacheKey !== cacheKey) {
        return;
      }

      setRatio(customEvent.detail.ratio);
    };

    window.addEventListener(SKELETON_RATIO_EVENT, handleRatioUpdate);

    return () => {
      window.removeEventListener(SKELETON_RATIO_EVENT, handleRatioUpdate);
    };
  }, [cacheKey]);

  return ratio;
};
