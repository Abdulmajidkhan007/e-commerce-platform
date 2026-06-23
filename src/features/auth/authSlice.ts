import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppUser } from "@/types";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AppUser | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state) {
      state.status = "loading";
    },
    setUser(state, action: PayloadAction<AppUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    clearUser(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setLoading, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.role === "admin";
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
