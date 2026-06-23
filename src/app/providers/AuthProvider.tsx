import { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useAppDispatch } from "@/store";
import { setLoading, setUser, clearUser } from "@/features/auth/authSlice";
import { toAppUser } from "@/features/auth/authService";

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    dispatch(setLoading());

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const appUser = await toAppUser(firebaseUser);
          dispatch(setUser(appUser));
        } catch {
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
      initialized.current = true;
    });

    return unsubscribe;
  }, [dispatch]);

  return <>{children}</>;
}
