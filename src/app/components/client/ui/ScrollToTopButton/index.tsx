"use client";

import { useEffect, useState } from "react";
import { AiOutlineUp } from "react-icons/ai";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercentage = scrolled / scrollHeight;

      setIsVisible(scrollPercentage >= 0.1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window === "undefined") return;

    const startY = window.scrollY || document.documentElement.scrollTop;
    if (startY <= 0) return;

    const duration = 700;
    const startTime = performance.now();
    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const nextY = startY * (1 - easeOutCubic(progress));
      window.scrollTo({ top: nextY, left: 0 });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <button
      type="button"
      aria-label="Voltar ao início da página"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-400 rounded-lg bg-primary-blue p-3 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <AiOutlineUp className="h-4 w-4 text-white" />
    </button>
  );
};

export default ScrollToTopButton;
