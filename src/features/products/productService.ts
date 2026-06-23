import {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { productsCol } from "@/firebase/collections";
import type { ProductDoc } from "@/types";
import { ITEMS_PER_PAGE } from "@/constants";

export type SortOption = "new" | "popular" | "price_asc" | "price_desc" | "rating";

export interface ProductFilters {
  category?: string;
  size?: string;
  audience?: string;
  sort?: SortOption;
  search?: string;
}

type ProductCursor = QueryDocumentSnapshot<ProductDoc, DocumentData>;

function sortArgs(sort?: SortOption): ["createdAt" | "price" | "ratingAvg" | "soldCount", "asc" | "desc"] {
  switch (sort) {
    case "popular": return ["soldCount", "desc"];
    case "price_asc": return ["price", "asc"];
    case "price_desc": return ["price", "desc"];
    case "rating": return ["ratingAvg", "desc"];
    default: return ["createdAt", "desc"];
  }
}

export async function fetchProducts(
  filters: ProductFilters,
  cursor?: ProductCursor
): Promise<{ items: ProductDoc[]; cursor: ProductCursor | null }> {
  const [field, dir] = sortArgs(filters.sort);

  let q = query(productsCol(), where("isActive", "==", true));
  if (filters.category) q = query(q, where("category", "==", filters.category));
  q = query(q, orderBy(field, dir), limit(ITEMS_PER_PAGE));
  if (cursor) q = query(q, startAfter(cursor));

  const snap = await getDocs(q);
  let items = snap.docs.map((d) => d.data());

  // Client-side secondary filters
  if (filters.size) {
    const size = filters.size;
    items = items.filter((p) => p.sizes.includes(size));
  }
  if (filters.audience) {
    const audience = filters.audience;
    items = items.filter((p) => p.targetAudience === audience);
  }
  if (filters.search) {
    const lower = filters.search.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(lower));
  }

  const nextCursor = snap.docs[snap.docs.length - 1] ?? null;
  return { items, cursor: nextCursor };
}

export async function getProductBySlug(slug: string): Promise<ProductDoc | null> {
  const q = query(
    productsCol(),
    where("slug", "==", slug),
    where("isActive", "==", true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0]?.data() ?? null;
}

export async function getRelatedProducts(
  category: string,
  excludeId: string
): Promise<ProductDoc[]> {
  const q = query(
    productsCol(),
    where("category", "==", category),
    where("isActive", "==", true),
    orderBy("soldCount", "desc"),
    limit(5)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data())
    .filter((p) => p.id !== excludeId)
    .slice(0, 4);
}
