import { useEffect, useRef, useState } from "react";
import { useGlobalStore } from "@/app/store/stateGlobals";

export const useNavPin = () => {
  const { pinned, setPinned } = useGlobalStore();
  const [slideIn, setSlideIn] = useState(false);
  const [navHeight, setNavHeight] = useState(78);
  const [scrollDirDown, setScrollDirDown] = useState(true);
  const baseHeightRef = useRef(72);
  const navRef = useRef<HTMLDivElement | null>(null);
  const pinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinnedRef = useRef(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const prevScrollYRef = useRef(0);
  const scrollDirDownRef = useRef(true);

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
      const current = window.scrollY || document.documentElement.scrollTop;
      const prev = prevScrollYRef.current;
      const isDown = current > prev;
      const wasDown = scrollDirDownRef.current;
      prevScrollYRef.current = current;

      // Detect if header is out of view (bottom at or above top)
      const headerBottom = header.getBoundingClientRect().bottom;
      const shouldPin = headerBottom <= -12;

      if (isDown !== wasDown) {
        scrollDirDownRef.current = isDown;
        setScrollDirDown(isDown);
      }

      if (shouldPin) {
        if (!pinnedRef.current && !pinTimer.current) {
          pinTimer.current = setTimeout(() => {
            setPinned(true);
            pinnedRef.current = true;
            requestAnimationFrame(() => {
              setSlideIn(false);
              requestAnimationFrame(() => setSlideIn(true));
            });
            pinTimer.current = null;
          }, 260);
        } else if (pinnedRef.current) {
          setSlideIn(!isDown);
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

    const handleResize = () => {
      handleScroll();
    };

    const observer = new ResizeObserver(() => {
      handleScroll();
    });
    observer.observe(header);

    handleScroll();

    const scrollTargets: Array<EventTarget | null> = [
      window,
      document,
      document.documentElement,
      document.body,
    ];

    scrollTargets.forEach((target) => {
      if (target) {
        target.addEventListener("scroll", handleScroll, { passive: true });
      }
    });

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimer();
      scrollTargets.forEach((target) => {
        if (target) target.removeEventListener("scroll", handleScroll);
      });
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [setPinned]);

  return { navRef, pinned, slideIn, navHeight, scrollDirDown };
};
