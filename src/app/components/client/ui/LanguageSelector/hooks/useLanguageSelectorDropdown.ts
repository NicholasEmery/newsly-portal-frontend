"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  defaultDropdownPosition,
  TRANSITION_MS,
} from "../constants/languageSelector.constants";
import type { DropdownPosition } from "../types/languageSelector.types";
import { resolveDropdownPosition } from "../utils/languageSelector.utils";

export const useLanguageSelectorDropdown = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>(
    defaultDropdownPosition,
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const trigger = rootRef.current;
    const menu = menuRef.current;

    if (!trigger || !menu) {
      return;
    }

    setDropdownPosition(
      resolveDropdownPosition(
        trigger.getBoundingClientRect(),
        menu.getBoundingClientRect(),
      ),
    );
  }, [isMounted, isOpen, isPresent]);

  useEffect(() => {
    if (isOpen) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setIsPresent(true);
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
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    const handleReposition = () => {
      const trigger = rootRef.current;
      const menu = menuRef.current;

      if (!trigger || !menu) {
        return;
      }

      setDropdownPosition(
        resolveDropdownPosition(
          trigger.getBoundingClientRect(),
          menu.getBoundingClientRect(),
        ),
      );
    };

    const frame = requestAnimationFrame(handleReposition);

    const handleScrollClose = () => {
      setIsOpen(false);
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleScrollClose, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleScrollClose, true);
    };
  }, [isOpen]);

  return {
    closeDropdown: () => setIsOpen(false),
    dropdownPosition,
    isMounted,
    isOpen,
    isPresent,
    isVisible,
    listboxId,
    menuRef,
    rootRef,
    toggleDropdown: () => setIsOpen((current) => !current),
  };
};
