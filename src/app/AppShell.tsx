"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SidebarMenu from "@/app/components/client/navigation/SideBarMenu";
import Header from "@/app/components/client/navigation/Header";
import Footer from "@/app/components/client/navigation/Footer";
import ScrollToTopButton from "@/app/components/client/ui/ScrollToTopButton";
import { useGlobalStore } from "@/app/store/stateGlobals";
import { useTranslations } from "next-intl";

const RouteTransitionOverlay = ({ onDone }: { onDone: () => void }) => {
  const pathname = usePathname();
  const t = useTranslations("appShell");
  const [visible, setVisible] = useState(true);
  const [canGreet, setCanGreet] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const greetingRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isHome = pathname === "/";
    if (!isHome) {
      setCanGreet(false);
      return;
    }
    const key = "newsly_lastGreetingAt";
    const readCookie = (name: string) => {
      const match = document.cookie.match(
        new RegExp(`(?:^|; )${name}=([^;]*)`),
      );
      return match ? decodeURIComponent(match[1]) : null;
    };
    const writeCookie = (
      name: string,
      value: string,
      maxAgeSeconds: number,
    ) => {
      document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/`;
    };

    const last = Number(readCookie(key) || 0);
    const now = Date.now();
    const twoHoursSeconds = 2 * 60 * 60; // 2h
    const allow = !last || now - last > twoHoursSeconds * 1000;
    if (allow) writeCookie(key, String(now), twoHoursSeconds);
    setCanGreet(allow);
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    const run = async () => {
      try {
        const { gsap } = await import("gsap");
        if (!isMounted) return;
        const ctx = gsap.context(() => {
          gsap.set(overlayRef.current, { opacity: 1, yPercent: 0 });
          if (canGreet) {
            gsap.set(greetingRef.current, { opacity: 0, y: -12 });
          }

          const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
          const greetStart = 0.15;
          const greetDuration = 0.45;
          const slideStart = canGreet ? greetStart + greetDuration + 0.1 : 0;

          if (canGreet && greetingRef.current) {
            tl.fromTo(
              greetingRef.current,
              { opacity: 0, y: -12 },
              {
                opacity: 1,
                y: 0,
                duration: greetDuration,
                ease: "power2.out",
              },
              greetStart,
            );
          }

          tl.to(
            overlayRef.current,
            {
              yPercent: -100,
              duration: 0.75,
              delay: canGreet ? 0.55 : 0.2,
            },
            slideStart,
          ).call(() => {
            if (!isMounted) return;
            setVisible(false);
            onDone();
          });
        }, overlayRef);

        cleanup = () => ctx.revert();
      } catch (err) {
        const t = setTimeout(() => {
          if (!isMounted) return;
          setVisible(false);
          onDone();
        }, 850);
        cleanup = () => clearTimeout(t);
      }
    };

    setVisible(true);
    run();

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [pathname, onDone, canGreet]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-90 flex items-center justify-center bg-white dark:bg-gray-900"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-5 border-blue-500 border-t-transparent animate-spin" />
          <span className="flex items-center justify-center w-full h-full">
            <Image
              src="/images/logo-spinner.png"
              alt={t("logoAlt")}
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
              priority
            />
          </span>
        </div>
        {canGreet && (
          <span
            ref={greetingRef}
            className="text-lg dark:text-gray-300 text-blue-500 font-semibold"
          >
            {t("welcome")}
          </span>
        )}
      </div>
    </div>
  );
};

export function AppShell({ children }: { children: ReactNode }) {
  const { open } = useGlobalStore();

  return (
    <div data-appshell="true" className="h-full w-full overflow-x-hidden flex flex-row text-gray-900 dark:text-gray-100 transition-all duration-500">
      <RouteTransitionOverlay onDone={() => {}} />
      <SidebarMenu />
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-500 ${open ? "md:pl-64" : "pl-0"}`}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <ScrollToTopButton />
        <Footer />
      </div>
    </div>
  );
}
