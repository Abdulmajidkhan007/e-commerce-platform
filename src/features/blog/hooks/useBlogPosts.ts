import { useState, useEffect, useRef } from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { fetchBlogPosts, type BlogFilters } from "../blogService";
import type { BlogPostDoc } from "@/types";

export function useBlogPosts(filters: BlogFilters = {}) {
  const [posts, setPosts] = useState<BlogPostDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const filtersRef = useRef(filters);
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    filtersRef.current = filters;
  });

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setCursor(null);
    setHasMore(true);

    fetchBlogPosts(filtersRef.current)
      .then(({ items, cursor: next }) => {
        setPosts(items);
        setCursor(next);
        setHasMore(next !== null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  async function loadMore() {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const { items, cursor: next } = await fetchBlogPosts(filtersRef.current, cursor);
      setPosts((prev) => [...prev, ...items]);
      setCursor(next);
      setHasMore(next !== null);
    } finally {
      setLoadingMore(false);
    }
  }

  return { posts, loading, loadingMore, hasMore, loadMore };
}
