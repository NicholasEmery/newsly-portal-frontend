"use client";

import { useTheme } from "@/app/components/client/ThemeProvider";
import { useEffect, useState } from "react";
import { BiSun } from "react-icons/bi";
import { HiOutlineMoon } from "react-icons/hi";

const ThemeModeBtn = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Opcional: pode retornar um loader ou null
    return null;
  }

  return (
    <div className="hidden lg:flex w-12 h-7 bg-white/40 pl-1 rounded-full items-center relative">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="w-full h-full opacity-0 appearance-none cursor-pointer z-10"
        aria-label="Alternar tema"
      />
      <div
        className={`absolute w-5 h-5 bg-white/30 rounded-full border-2 border-white/30 flex items-center justify-center transition-transform duration-500 ${
          theme === "dark" ? "translate-x-5" : "translate-x-0"
        }`}
      >
        {/* Ícone tema claro */}
        <span
          className={`absolute transition-transform duration-500 ${
            theme === "dark"
              ? "translate-y-2 scale-0"
              : "translate-y-0 scale-100"
          }`}
        >
          <BiSun size={10} className="text-black" />
        </span>
        {/* Ícone tema escuro */}
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
    </div>
  );
};

export default ThemeModeBtn;
