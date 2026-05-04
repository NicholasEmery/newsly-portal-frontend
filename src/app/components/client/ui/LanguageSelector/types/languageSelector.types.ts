export type LocaleCode = "pt-br" | "en";

export type FlagComponent = typeof import("country-flag-icons/react/3x2").BR;

export type LocaleOption = {
  country: LocaleCode;
  flag: FlagComponent;
  labelKey: "portugueseBrazil" | "englishUs";
};

export type ResolvedLocaleOption = {
  country: LocaleCode;
  flag: FlagComponent;
  label: string;
};

export type DropdownPlacement = "bottom" | "top" | "right" | "left";

export type DropdownPosition = {
  top: number;
  left: number;
  placement: DropdownPlacement;
  transformOrigin: string;
  ready: boolean;
};
