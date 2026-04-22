import { create } from "zustand";

interface MenuState {
  menuShown: boolean;
  closeMenu: () => void;
  openMenu: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuShown: false,
  closeMenu: () => set({ menuShown: false }),
  openMenu: () => set({ menuShown: true }),
}));
