"use client";

import { useEffect, useMemo, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useTheme } from "./ThemeProvider";

type LottieJson = {
  layers?: Array<any>;
};

const toUnit = (hex: string) => {
  const clean = hex.replace("#", "");
  const int = parseInt(clean, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return [r / 255, g / 255, b / 255, 1];
};

const THEME_BG = {
  light: "#ffffff",
  dark: "#364153", // rgb(54,65,83)
} as const;

const parseRgb = (
  value: string | null,
): [number, number, number, number] | null => {
  if (!value) return null;
  const m = value.match(/rgba?\(([^)]+)\)/i);
  if (!m) return null;
  const parts = m[1]
    .split(",")
    .map((p) => p.trim())
    .map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [r, g, b, a = 1] = parts;
  return [r / 255, g / 255, b / 255, a];
};

type NotFoundLottieProps = {
  className?: string;
};

export const NotFoundLottie = ({ className }: NotFoundLottieProps) => {
  const { theme } = useTheme();
  const [anim, setAnim] = useState<LottieJson | null>(null);

  const bgColor = useMemo(() => THEME_BG[theme], [theme]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/lottie/not-found-error.json");
        const json: LottieJson = await res.json();
        if (cancelled) return;

        const computed = getComputedStyle(
          document.documentElement,
        ).backgroundColor;
        const computedBody = getComputedStyle(document.body).backgroundColor;
        const parsed = parseRgb(computed) || parseRgb(computedBody);

        const clone = structuredClone(json);
        const layer = clone.layers?.find(
          (l: any) => l?.nm === "T-REX_cabeza Outlines",
        );
        const eye = layer?.shapes?.[0];
        const fill = eye?.it?.find((i: any) => i.ty === "fl");
        if (fill?.c?.k) {
          const forced = toUnit(THEME_BG[theme]);
          fill.c.k = forced ?? parsed ?? toUnit(bgColor);
        }

        setAnim(clone);
      } catch (err) {
        console.error("Failed to load lottie", err);
        setAnim(null);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [bgColor, theme]);

  return (
    <DotLottieReact
      className={className}
      data={anim ?? undefined}
      src={anim ? undefined : "/lottie/not-found-error.json"}
      loop
      autoplay
      aria-hidden
      role="presentation"
      autoCapitalize="characters"
      autoFocus
      renderConfig={{
        autoResize: true,
        quality: 100,
        freezeOnOffscreen: true,
      }}
      style={{ width: "100%", objectFit: "contain" }}
    />
  );
};
