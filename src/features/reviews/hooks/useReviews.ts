import { useState, useEffect } from "react";
import { subscribeReviews, hasUserReviewed } from "../reviewService";
import type { ReviewDoc } from "@/types";

export function useReviews(productId: string, userId?: string) {
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeReviews(
      productId,
      (data) => {
        setReviews(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [productId]);

  useEffect(() => {
    if (!userId) {
      setAlreadyReviewed(false);
      return;
    }
    hasUserReviewed(productId, userId).then(setAlreadyReviewed).catch(() => undefined);
  }, [productId, userId]);

  return { reviews, loading, alreadyReviewed };
}
