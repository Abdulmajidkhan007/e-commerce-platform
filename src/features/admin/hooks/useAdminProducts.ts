import { useState, useEffect } from "react";
import { subscribeAdminProducts } from "../adminService";
import type { ProductDoc } from "@/types";

export function useAdminProducts() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAdminProducts(
      (data) => {
        setProducts(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { products, loading };
}
