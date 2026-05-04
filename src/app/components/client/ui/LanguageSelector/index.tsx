"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useTransition, type KeyboardEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";
import { localeOptions } from "./constants/languageSelector.constants";
import type {
  FlagComponent,
  LocaleCode,
  ResolvedLocaleOption,
} from "./types/languageSelector.types";
import { useLanguageSelectorDropdown } from "./hooks/useLanguageSelectorDropdown";

const LanguageSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("sidebar");
  const [isPending, startTransition] = useTransition();
  const {
    closeDropdown,
    dropdownPosition,
    isMounted,
    isOpen,
    isPresent,
    isVisible,
    listboxId,
    menuRef,
    rootRef,
    toggleDropdown,
  } = useLanguageSelectorDropdown();

  const locales: ResolvedLocaleOption[] = localeOptions.map(
    ({ country, flag, labelKey }) => ({
      country,
      flag,
      label: t(labelKey),
    }),
  );

  const selectedLocale =
    locales.find((item) => item.country === locale) ?? locales[0];
  const SelectedFlag = selectedLocale.flag as FlagComponent;

  function handleChange(nextLocale: LocaleCode) {
    closeDropdown();

    if (nextLocale === locale) {
      return;
    }

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    nextLocale: LocaleCode,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleChange(nextLocale);
    }
  }

  return (
    <>
      <div ref={rootRef} className="relative inline-flex items-center">
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={toggleDropdown}
            aria-label={t("language")}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            disabled={isPending}
          >
            <div className="flex items-center justify-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 hover:bg-gray-400/40">
              <SelectedFlag className="h-6 w-6 rounded-sm" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>{selectedLocale.label}</div>
          </TooltipContent>
        </Tooltip>
      </div>

      {isMounted && isPresent
        ? createPortal(
            <div
              style={{
                position: "fixed",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.28))",
                pointerEvents: "none",
                zIndex: 1300,
              }}
            >
              <div
                ref={menuRef}
                id={listboxId}
                role="listbox"
                aria-label={t("language")}
                aria-hidden={!isOpen}
                style={{
                  transformOrigin: dropdownPosition.transformOrigin,
                  transform: isVisible ? "scaleY(1)" : "scaleY(0.8)",
                  maxHeight: isVisible ? 240 : 0,
                  overflow: "hidden",
                  opacity: 1,
                  willChange: "transform, max-height",
                  transition: "transform 360ms ease, max-height 420ms ease",
                  pointerEvents: isVisible ? "auto" : "none",
                }}
                className={`flex flex-col rounded-2xl border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-slate-800 ${dropdownPosition.ready ? "opacity-100" : "opacity-0"}`}
              >
                <div className="flex flex-col gap-1">
                  {locales.map((loc) => (
                    <button
                      key={loc.country}
                      type="button"
                      role="option"
                      tabIndex={isOpen ? 0 : -1}
                      aria-label={loc.label}
                      aria-selected={loc.country === selectedLocale.country}
                      onClick={() => handleChange(loc.country)}
                      onKeyDown={(event) =>
                        handleOptionKeyDown(event, loc.country)
                      }
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors duration-200 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-700 ${loc.country === selectedLocale.country ? "bg-slate-100 text-slate-950 dark:bg-slate-700 dark:text-white" : ""}`}
                    >
                      <loc.flag className="h-6 w-6 rounded-sm" />
                    </button>
                  ))}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default LanguageSelector;
