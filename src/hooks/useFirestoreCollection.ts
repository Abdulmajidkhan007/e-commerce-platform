import { useState, useEffect } from "react";
import {
  query,
  onSnapshot,
  type DocumentData,
  type CollectionReference,
  type QueryConstraint,
} from "firebase/firestore";

interface State<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export function useFirestoreCollection<T extends DocumentData>(
  colRef: CollectionReference<T> | null,
  constraints: QueryConstraint[] = []
): State<T> {
  const [state, setState] = useState<State<T>>({
    data: [],
    loading: Boolean(colRef),
    error: null,
  });

  useEffect(() => {
    if (!colRef) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true }));
    const q = query(colRef, ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setState({
          data: snap.docs.map((d) => d.data()),
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({ data: [], loading: false, error: err.message });
      }
    );

    return unsubscribe;
  }, [colRef]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
