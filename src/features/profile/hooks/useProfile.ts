import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { userConverter } from "@/firebase/converters";
import type { UserDoc } from "@/types";

interface ProfileState {
  profile: UserDoc | null;
  loading: boolean;
  error: string | null;
}

export function useProfile(uid: string | null | undefined): ProfileState {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: Boolean(uid),
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState({ profile: null, loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true }));
    const ref = doc(db, "users", uid).withConverter(userConverter);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setState({ profile: snap.data(), loading: false, error: null });
        } else {
          setState({ profile: null, loading: false, error: null });
        }
      },
      (err) => {
        setState({ profile: null, loading: false, error: err.message });
      }
    );

    return unsubscribe;
  }, [uid]);

  return state;
}
