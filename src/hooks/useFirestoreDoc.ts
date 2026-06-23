import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  type DocumentData,
  type CollectionReference,
} from "firebase/firestore";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFirestoreDoc<T extends DocumentData>(
  colRef: CollectionReference<T> | null,
  id: string | null | undefined
): State<T> {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: Boolean(colRef && id),
    error: null,
  });

  useEffect(() => {
    if (!colRef || !id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true }));
    const unsubscribe = onSnapshot(
      doc(colRef, id),
      (snap) => {
        if (snap.exists()) {
          setState({ data: snap.data(), loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: "Topilmadi" });
        }
      },
      (err) => {
        setState({ data: null, loading: false, error: err.message });
      }
    );

    return unsubscribe;
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
