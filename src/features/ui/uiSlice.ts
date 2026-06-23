import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

interface UiState {
  theme: Theme;
  isCartOpen: boolean;
  isMobileNavOpen: boolean;
}

const getSystemTheme = (): Theme => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

const initialState: UiState = {
  theme: getSystemTheme(),
  isCartOpen: false,
  isMobileNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    openCart(state) {
      state.isCartOpen = true;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    openMobileNav(state) {
      state.isMobileNavOpen = true;
    },
    closeMobileNav(state) {
      state.isMobileNavOpen = false;
    },
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  openCart,
  closeCart,
  toggleCart,
  openMobileNav,
  closeMobileNav,
  toggleMobileNav,
} = uiSlice.actions;

export default uiSlice.reducer;

export const selectTheme = (state: { ui: UiState }) => state.ui.theme;
export const selectIsCartOpen = (state: { ui: UiState }) => state.ui.isCartOpen;
export const selectIsMobileNavOpen = (state: { ui: UiState }) => state.ui.isMobileNavOpen;
