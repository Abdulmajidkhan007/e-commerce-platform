import { useState, useEffect } from "react";
import { getProductBySlug, getRelatedProducts } from "../productService";
import type { ProductDoc } from "@/types";

export function useProduct(slug: string) {
  const [product, setProduct] = useState<ProductDoc | null>(null);
  const [related, setRelated] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);
    setRelated([]);

    getProductBySlug(slug)
      .then(async (p) => {
        if (cancelled) return;
        setProduct(p);
        if (p) {
          const rel = await getRelatedProducts(p.category, p.id).catch(() => []);
          if (!cancelled) setRelated(rel);
        }
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Xatolik yuz berdi");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, related, loading, error };
}
