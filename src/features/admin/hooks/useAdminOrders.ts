import { useState, useEffect } from "react";
import { subscribeAdminOrders } from "../adminService";
import type { OrderDoc } from "@/types";

export function useAdminOrders() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAdminOrders(
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { orders, loading };
}
