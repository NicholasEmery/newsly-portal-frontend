import { create } from "zustand";

interface GlobalsStates {
  open: boolean;
  setOpen: (value: boolean) => void;
  openSearchBar: boolean;
  setOpenSearchBar: (value: boolean) => void;
  pinned: boolean;
  setPinned: (value: boolean) => void;
  dropdownOpen: boolean;
  dropdownTop: number;
  dropdownLeft?: number;
  dropdownWidth?: number;
  dropdownFullWidth: boolean;
  setDropdownOpen: (value: boolean) => void;
  setDropdownPosition: (value: {
    top: number;
    left?: number;
    width?: number;
    fullWidth: boolean;
  }) => void;
}

export const useGlobalStore = create<GlobalsStates>((set) => ({
  open: false,
  setOpen: (value: boolean) => set({ open: value }),
  openSearchBar: false,
  setOpenSearchBar: (value: boolean) => set({ openSearchBar: value }),
  pinned: false,
  setPinned: (value: boolean) => set({ pinned: value }),
  dropdownOpen: false,
  dropdownTop: 0,
  dropdownLeft: undefined,
  dropdownWidth: undefined,
  dropdownFullWidth: false,
  setDropdownOpen: (value: boolean) => set({ dropdownOpen: value }),
  setDropdownPosition: ({ top, left, width, fullWidth }) =>
    set({
      dropdownTop: top,
      dropdownLeft: left,
      dropdownWidth: width,
      dropdownFullWidth: fullWidth,
    }),
}));
