"use client";

import { useEffect, useRef, useState } from "react";

type UseIntersectionObserverOptions = {
  rootMargin?: string;
  threshold?: number;
  freezeOnceVisible?: boolean;
};

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {},
) => {
  const {
    rootMargin = "160px 0px",
    threshold = 0.1,
    freezeOnceVisible = true,
  } = options;

  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;
    if (freezeOnceVisible && isVisible) return;

    if (
      typeof window !== "undefined" &&
      Boolean((window as Window & { Cypress?: unknown }).Cypress)
    ) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (freezeOnceVisible) {
            observer.disconnect();
          }
        }
      },
      { root: null, rootMargin, threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [freezeOnceVisible, isVisible, rootMargin, threshold]);

  return { targetRef, isVisible };
};
