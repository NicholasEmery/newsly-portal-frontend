"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MoreDropdownProps = {
  categories: Array<{ label: string; href: string }>;
  dropdownOpen: boolean;
  dropdownTop: number;
  dropdownLeft?: number;
  dropdownFullWidth: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  cancelHoverClose: () => void;
  scheduleHoverClose: () => void;
  closeDropdown: () => void;
};

const MoreDropdown = ({
  categories,
  dropdownOpen,
  dropdownTop,
  dropdownLeft,
  dropdownFullWidth,
  menuRef,
  cancelHoverClose,
  scheduleHoverClose,
}: MoreDropdownProps) => {
  const [isPresent, setIsPresent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const TRANSITION_MS = 420;

  useEffect(() => {
    if (dropdownOpen) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setIsPresent(true);
      // next frame to allow initial styles to apply
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      hideTimerRef.current = setTimeout(() => {
        setIsPresent(false);
        hideTimerRef.current = null;
      }, TRANSITION_MS);
    }
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [dropdownOpen]);

  if (!isPresent || typeof window === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: dropdownTop,
        left: dropdownFullWidth ? 0 : dropdownLeft,
        right: dropdownFullWidth ? 0 : undefined,
        width: dropdownFullWidth ? "100%" : undefined,
        filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.28))",
        pointerEvents: "none",
        zIndex: 1200,
      }}
    >
      <div
        ref={menuRef}
        onMouseEnter={cancelHoverClose}
        onMouseLeave={scheduleHoverClose}
        style={{
          transformOrigin: "top center",
          transform: isVisible ? "scaleY(1)" : "scaleY(0.8)",
          maxHeight: isVisible ? 500 : 0,
          overflow: "hidden",
          opacity: 1,
          willChange: "transform, max-height",
          transition: "transform 360ms ease, max-height 420ms ease",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <ul
          id="nav-more-dropdown"
          className="mt-2 md:mt-0 bg-white dark:bg-gray-800 dark:border-gray-400 dark:border text-black dark:text-white rounded-b-xl lg:rounded-xl"
        >
          {categories.map((cat, idx) => (
            <li
              key={cat.href}
              className={[
                idx === 0 ? "rounded-t-xl" : "",
                idx === categories.length - 1 ? "rounded-b-xl" : "",
                "transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700",
              ].filter(Boolean).join(" ")}
            >
              <Link
                href={cat.href}
                className="block px-4 py-2"
              >
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
};

export default MoreDropdown;
