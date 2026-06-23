import { useState, useEffect } from "react";
import { subscribeUserOrders } from "../orderService";
import type { OrderDoc } from "@/types";

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeUserOrders(
      userId,
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [userId]);

  return { orders, loading };
}
