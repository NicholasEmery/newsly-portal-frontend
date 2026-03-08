import { useEffect, useRef } from "react";
import { useGlobalStore } from "@/app/store/stateGlobals";

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

export const useNavDropdown = () => {
  const {
    dropdownOpen,
    dropdownTop,
    dropdownLeft,
    dropdownWidth,
    dropdownFullWidth,
    setDropdownOpen,
    setDropdownPosition,
  } = useGlobalStore();

  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateDropdownPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    if (isDesktop()) {
      setDropdownPosition({
        top: rect.bottom + scrollY,
        left: rect.left + scrollX,
        width: rect.width,
        fullWidth: false,
      });
    } else {
      setDropdownPosition({
        top: rect.bottom + scrollY,
        left: undefined,
        width: undefined,
        fullWidth: true,
      });
    }
  };

  // fecha em clique fora / ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      if (menuRef.current && menuRef.current.contains(target)) return;
      setDropdownOpen(false);
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // reposiciona enquanto aberto
  useEffect(() => {
    if (!dropdownOpen) return;
    updateDropdownPosition();

    const handleWin = () => updateDropdownPosition();
    window.addEventListener("resize", handleWin);
    window.addEventListener("scroll", handleWin, { passive: true });

    return () => {
      window.removeEventListener("resize", handleWin);
      window.removeEventListener("scroll", handleWin);
    };
  }, [dropdownOpen]);

  const openDesktop = () => {
    if (!isDesktop()) return;
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    setDropdownOpen(true);
    updateDropdownPosition();
  };

  const closeDesktop = () => {
    if (!isDesktop()) return;
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
    }
    hoverCloseTimer.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const cancelHoverClose = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };
  const scheduleHoverClose = () => {
    if (!isDesktop()) return;
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
    }
    hoverCloseTimer.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const closeDropdown = () => setDropdownOpen(false);

  const toggleMobile = () => {
    if (isDesktop()) return;
    const next = !dropdownOpen;
    setDropdownOpen(next);
    if (next) requestAnimationFrame(updateDropdownPosition);
  };

  return {
    dropdownOpen,
    dropdownTop,
    dropdownLeft,
    dropdownWidth,
    dropdownFullWidth,
    dropdownRef,
    triggerRef,
    menuRef,
    openDesktop,
    closeDesktop,
    cancelHoverClose,
    scheduleHoverClose,
    closeDropdown,
    toggleMobile,
  };
};
