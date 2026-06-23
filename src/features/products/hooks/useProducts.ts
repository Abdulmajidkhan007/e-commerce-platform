import { useState, useEffect, useCallback, useRef } from "react";
import { fetchProducts, type ProductFilters } from "../productService";
import type { ProductDoc } from "@/types";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

type Cursor = QueryDocumentSnapshot<ProductDoc, DocumentData>;

interface State {
  items: ProductDoc[];
  cursor: Cursor | null;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

const INIT: State = {
  items: [],
  cursor: null,
  hasMore: false,
  loading: true,
  loadingMore: false,
  error: null,
};

export function useProducts(filters: ProductFilters) {
  const [state, setState] = useState<State>(INIT);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setState({ ...INIT, loading: true });

    fetchProducts(filtersRef.current)
      .then((res) => {
        if (!cancelled) {
          setState({
            items: res.items,
            cursor: res.cursor,
            hasMore: res.cursor !== null,
            loading: false,
            loadingMore: false,
            error: null,
          });
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: e instanceof Error ? e.message : "Xatolik yuz berdi",
          }));
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const loadMore = useCallback(async () => {
    setState((prev) => {
      if (!prev.cursor || prev.loadingMore) return prev;
      return { ...prev, loadingMore: true };
    });

    const cursor = state.cursor;
    if (!cursor) return;

    try {
      const res = await fetchProducts(filtersRef.current, cursor);
      setState((prev) => ({
        ...prev,
        items: [...prev.items, ...res.items],
        cursor: res.cursor,
        hasMore: res.cursor !== null,
        loadingMore: false,
      }));
    } catch {
      setState((prev) => ({ ...prev, loadingMore: false }));
    }
  }, [state.cursor]);

  return { ...state, loadMore };
}
