"use client";

import React, { useEffect, useState } from "react";
import { CgChevronDown } from "react-icons/cg";
import Link from "next/link";
import { useGlobalStore } from "@/app/store/stateGlobals";
import { useNavPin } from "./hooks/useNavPin";
import { useNavDropdown } from "./hooks/useNavDropdown";
import SearchBtnIcon from "@/app/components/client/ui/SearchBtnIcon";
import SidebarBtn from "@/app/components/client/ui/SidebarBtn";
import ThemeModeBtn from "@/app/components/client/ui/ThemeModeBtn";
import MoreDropdown from "@/app/components/client/navigation/MoreDropdown";
import { useTranslations } from "next-intl";
import LanguageSelector from "../../ui/LanguageSelector";

interface NavMenuProps {
  categories: Array<{ label: string; href: string }>;
}

const NavMenu = ({ categories }: NavMenuProps) => {
  const { open, openSearchBar } = useGlobalStore();
  const t = useTranslations("header");
  const tNavbar = useTranslations("navbar");
  const { navRef, pinned, slideIn, navHeight } = useNavPin();
  const [isDesktop, setIsDesktop] = useState(false);
  const [devNoticeOffset, setDevNoticeOffset] = useState(0);
  // Next.js exposes NODE_ENV at build time; we consider only
  // development as the development environment.
  const isDevEnvironment = process.env.NODE_ENV === "development";

  const readDevNoticeHeight = () => {
    if (typeof window === "undefined") return 0;
    const rawValue = getComputedStyle(document.documentElement)
      .getPropertyValue("--newsly-dev-notice-height")
      .trim()
      .replace("px", "");

    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop("matches" in e ? e.matches : mq.matches);
    };

    handler(mq);

    if (!isDevEnvironment) {
      setDevNoticeOffset(0);
    }

    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  }, [isDevEnvironment]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncDevNoticeHeight = () => {
      setDevNoticeOffset(readDevNoticeHeight());
    };

    const onNoticeHeightChange = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      setDevNoticeOffset(customEvent.detail ?? readDevNoticeHeight());
    };

    syncDevNoticeHeight();
    window.addEventListener("resize", syncDevNoticeHeight);
    window.addEventListener("newsly:dev-notice-height", onNoticeHeightChange);

    return () => {
      window.removeEventListener("resize", syncDevNoticeHeight);
      window.removeEventListener(
        "newsly:dev-notice-height",
        onNoticeHeightChange,
      );
    };
  }, []);
  const {
    dropdownOpen,
    dropdownTop,
    dropdownLeft,
    dropdownFullWidth,
    dropdownRef,
    triggerRef,
    menuRef,
    openDesktop,
    cancelHoverClose,
    scheduleHoverClose,
    closeDropdown,
    toggleMobile,
  } = useNavDropdown();

  const [moreCategories, setMoreCategories] = useState<
    Array<{ label: string; href: string }>
  >([]);

  useEffect(() => {
    // Only use additional categories when the API returned more than 4.
    // Do NOT fall back to mocks here — if there are not >4 categories,
    // the More dropdown should not render.
    if (Array.isArray(categories) && categories.length > 4) {
      setMoreCategories(categories.slice(4));
    } else {
      setMoreCategories([]);
    }
  }, [categories]);

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label={t("mainNav")}
        style={{
          willChange: "transform",
          transform: pinned
            ? `translateY(${slideIn ? navHeight + devNoticeOffset : 0}px)`
            : "translateY(0)",
          transition: pinned
            ? "transform 650ms cubic-bezier(0.22, 0.68, 0, 1), left 400ms ease-in-out, width 400ms ease-in-out"
            : "transform 0ms, left 0ms, width 0ms",
          left:
            pinned && isDesktop && open ? "16rem" : pinned ? "0rem" : undefined,
          width:
            pinned && isDesktop && open
              ? "calc(100% - 16rem)"
              : pinned
                ? "100%"
                : undefined,
          right: pinned ? 0 : undefined,
          top: pinned ? -navHeight : undefined,
        }}
        className={`${
          pinned
            ? "fixed shadow-2xl backdrop-blur-sm px-4 gap-4 lg:gap-0"
            : "relative px-4"
        } ${openSearchBar && pinned ? "justify-between lg:justify-around" : "justify-around"} z-50 w-full py-2 bg-primary-blue border-t border-white/20 shadow-xl flex flex-row items-center transition-all duration-600 ease-in-out whitespace-nowrap`}
      >
        <div
          className={`flex items-center justify-center gap-2 md:gap-5 ${pinned ? "flex" : "hidden"}`}
        >
          <SidebarBtn />
          <div className="hidden lg:block">
            <SearchBtnIcon />
          </div>
        </div>
        <div
          className={`overflow-x-auto overflow-y-hidden scrollbar-hide transition-all duration-500 ease-in-out ${openSearchBar && pinned ? "w-0 opacity-0 xl:opacity-100 lg:w-auto" : "opacity-100"}`}
        >
          <ul className="min-w-max w-full flex flex-row items-center md:justify-center justify-start gap-5 lg:gap-10">
            {categories.slice(0, 4).map((item, idx) => (
              <li
                key={item.label}
                className={`${idx === 0 ? "" : "opacity-[0.8] hover:opacity-100"} uppercase text-white transition-opacity duration-500`}
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li
              ref={dropdownRef}
              className="group relative opacity-[0.8] gap-5 uppercase text-white hover:opacity-100 transition-opacity duration-500"
              onMouseEnter={openDesktop}
              onMouseLeave={scheduleHoverClose}
              onFocus={openDesktop}
            >
              <button
                type="button"
                className="group flex items-center uppercase cursor-pointer"
                onClick={toggleMobile}
                ref={triggerRef}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-controls="nav-more-dropdown"
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    closeDropdown();
                  }
                }}
              >
                {tNavbar("more")}
                <CgChevronDown
                  size={18}
                  className={`ml-0.5 transition-transform duration-500 text-white ${dropdownOpen ? "rotate-180" : ""} group-hover:rotate-180`}
                />
              </button>
            </li>
          </ul>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${openSearchBar ? "lg:w-auto" : "w-6 justify-end lg:justify-center lg:w-auto"} ${pinned ? "flex justify-center items-center gap-4" : "hidden"}`}
        >
          <div className="xs:hidden xl:block">
            <LanguageSelector />
          </div>
          <ThemeModeBtn />
          <div
            className={`block lg:hidden transition-all duration-500 ease-in-out`}
          >
            <SearchBtnIcon />
          </div>
        </div>
      </nav>
      {pinned && <div aria-hidden style={{ height: navHeight }} />}
      {moreCategories.length > 0 && (
        <MoreDropdown
          categories={moreCategories}
          dropdownOpen={dropdownOpen}
          dropdownTop={dropdownTop}
          dropdownLeft={dropdownLeft}
          dropdownFullWidth={dropdownFullWidth}
          menuRef={menuRef}
          cancelHoverClose={cancelHoverClose}
          scheduleHoverClose={scheduleHoverClose}
          closeDropdown={closeDropdown}
        />
      )}
    </>
  );
};

export default NavMenu;
