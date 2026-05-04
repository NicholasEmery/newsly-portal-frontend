"use client";

import { useTheme } from "@/app/components/client/providers/ThemeProvider";
import { useEffect, useState } from "react";
import { BiSun } from "react-icons/bi";
import { HiOutlineMoon } from "react-icons/hi";
import { useTranslations } from "next-intl";

type ThemeModeBtnProps = {
  className?: string;
};

const ThemeModeBtn = ({ className }: ThemeModeBtnProps) => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("header");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Optional: can return a loader or null
    return null;
  }

  return (
    <label
      className={`hidden h-7 w-12 items-center rounded-full bg-white/40 relative cursor-pointer border border-primary-blue/30 text-primary-blue shadow-sm dark:border-white/25 dark:bg-slate-800 ${className || "lg:flex"}`}
    >
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="absolute inset-0 w-full h-full opacity-0 appearance-none cursor-pointer z-10"
        aria-label={t("toggleTheme")}
      />
      <div
        className={`pointer-events-none absolute top-0.6 left-1 w-5 h-5 bg-white/30 rounded-full border-2 border-primary-blue/40 flex items-center justify-center transition-transform duration-500 ${
          theme === "dark" ? "translate-x-5" : "-translate-x-0.5"
        }`}
      >
        {/* Light theme icon */}
        <span
          className={`absolute transition-transform duration-500 ${
            theme === "dark"
              ? "translate-y-2 scale-0"
              : "translate-y-0 scale-100"
          }`}
        >
          <BiSun size={10} className="text-black" />
        </span>
        {/* Dark theme icon */}
        <span
          className={`absolute transition-transform duration-500 ${
            theme === "dark"
              ? "translate-y-0 scale-100"
              : "translate-y-2 scale-0"
          }`}
        >
          <HiOutlineMoon size={10} className="text-white" />
        </span>
      </div>
    </label>
  );
};

export default ThemeModeBtn;
