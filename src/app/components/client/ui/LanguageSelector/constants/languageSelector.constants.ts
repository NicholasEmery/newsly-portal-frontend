import { BR, US } from "country-flag-icons/react/3x2";

import type {
  DropdownPosition,
  LocaleOption,
} from "../types/languageSelector.types";

export const localeOptions: readonly LocaleOption[] = [
  { country: "pt-br", flag: BR, labelKey: "portugueseBrazil" },
  { country: "en", flag: US, labelKey: "englishUs" },
] as const;

export const VIEWPORT_PADDING = 12;
export const DROPDOWN_GAP = 2;
export const TRANSITION_MS = 420;

export const defaultDropdownPosition: DropdownPosition = {
  top: 0,
  left: 0,
  placement: "bottom",
  transformOrigin: "top center",
  ready: false,
};