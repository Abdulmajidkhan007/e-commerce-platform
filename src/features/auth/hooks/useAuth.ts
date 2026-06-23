import { useCallback } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectAuth,
  selectUser,
  selectIsAdmin,
  selectAuthStatus,
  clearUser,
} from "@/features/auth/authSlice";
import { clearCart } from "@/features/cart/cartSlice";
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logoutUser,
} from "@/features/auth/authService";

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const status = useAppSelector(selectAuthStatus);

  const login = useCallback(
    async (email: string, password: string) => {
      await loginWithEmail(email, password);
      // onAuthStateChanged AuthProvider'da yangilaydi
    },
    []
  );

  const loginGoogle = useCallback(async () => {
    await loginWithGoogle();
  }, []);

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      await registerWithEmail(email, password, firstName, lastName);
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutUser();
    dispatch(clearUser());
    dispatch(clearCart());
    toast.success("Tizimdan chiqildi");
  }, [dispatch]);

  return {
    user,
    isAdmin,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "idle" || status === "loading",
    auth,
    login,
    loginGoogle,
    register,
    logout,
  };
}
