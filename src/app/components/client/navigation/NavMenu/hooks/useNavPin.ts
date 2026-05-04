import { useEffect, useRef, useState } from "react";
import { useGlobalStore } from "@/app/store/stateGlobals";

export const useNavPin = () => {
  const { pinned, setPinned } = useGlobalStore();
  const [slideIn, setSlideIn] = useState(false);
  const [navHeight, setNavHeight] = useState(78);
  const baseHeightRef = useRef(72);
  const navRef = useRef<HTMLDivElement | null>(null);
  const pinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinnedRef = useRef(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const scrollTickingRef = useRef(false);

  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const measure = () => {
      const base = el.offsetHeight;
      baseHeightRef.current = base;
      setNavHeight(base + 16);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const base = baseHeightRef.current;
    setNavHeight(pinned ? base : base + 16);
  }, [pinned]);

  useEffect(() => {
    const header = document.getElementById("site-header") as HTMLElement | null;
    headerRef.current = header;
    if (!header) return;

    const clearTimer = () => {
      if (pinTimer.current) {
        clearTimeout(pinTimer.current);
        pinTimer.current = null;
      }
    };

    const handleScroll = () => {
      const headerBottom = header.getBoundingClientRect().bottom;
      const shouldPin = headerBottom <= -12;

      if (shouldPin) {
        if (!pinnedRef.current && !pinTimer.current) {
          pinTimer.current = setTimeout(() => {
            setPinned(true);
            pinnedRef.current = true;
            requestAnimationFrame(() => {
              setSlideIn(true);
            });
            pinTimer.current = null;
          }, 260);
        } else if (pinnedRef.current) {
          setSlideIn(true);
        }
      } else {
        clearTimer();
        if (pinnedRef.current) {
          setSlideIn(true);
          setPinned(false);
          pinnedRef.current = false;
        }
      }
    };

    const scheduleScrollSync = () => {
      if (scrollTickingRef.current) return;
      scrollTickingRef.current = true;
      requestAnimationFrame(() => {
        scrollTickingRef.current = false;
        handleScroll();
      });
    };

    const handleResize = () => {
      scheduleScrollSync();
    };

    const observer = new ResizeObserver(() => {
      scheduleScrollSync();
    });
    observer.observe(header);

    scheduleScrollSync();

    const scrollTargets: Array<EventTarget | null> = [
      window,
      document,
      document.documentElement,
      document.body,
    ];

    scrollTargets.forEach((target) => {
      if (target) {
        target.addEventListener("scroll", scheduleScrollSync, {
          passive: true,
        });
      }
    });

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimer();
      scrollTargets.forEach((target) => {
        if (target) {
          target.removeEventListener("scroll", scheduleScrollSync);
        }
      });
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [setPinned]);

  return { navRef, pinned, slideIn, navHeight };
};
