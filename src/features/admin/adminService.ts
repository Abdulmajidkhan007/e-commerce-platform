import {
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/firebase";
import { productsCol, ordersCol, blogPostsCol } from "@/firebase/collections";
import { uploadProductImage } from "@/services/storage";
import { slugify } from "@/utils/slugify";
import type { ProductDoc, OrderDoc, BlogPostDoc } from "@/types";
import type { ProductFormValues, BlogFormValues } from "@/services/schemas";
import type { OrderStatusValue } from "@/constants";

/* ===== Dashboard ===== */
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeProducts: number;
  lowStockProducts: ProductDoc[];
  recentOrders: OrderDoc[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [ordersSnap, productsSnap] = await Promise.all([
    getDocs(query(ordersCol(), orderBy("createdAt", "desc"))),
    getDocs(productsCol()),
  ]);

  const orders = ordersSnap.docs.map((d) => d.data());
  const products = productsSnap.docs.map((d) => d.data());

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const lowStockProducts = products
    .filter((p) => p.isActive && p.stock <= p.lowStockThreshold)
    .slice(0, 6);

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders,
    activeProducts,
    lowStockProducts,
    recentOrders: orders.slice(0, 10),
  };
}

/* ===== Products ===== */
export function subscribeAdminProducts(
  onData: (products: ProductDoc[]) => void,
  onErr?: (e: Error) => void
): Unsubscribe {
  const q = query(productsCol(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => d.data())),
    (e) => onErr?.(e)
  );
}

export async function createProduct(
  values: ProductFormValues,
  pendingFiles: File[],
  isActive: boolean
): Promise<string> {
  const docRef = doc(collection(db, "products"));
  const productId = docRef.id;

  const uploadedUrls = await Promise.all(
    pendingFiles.map((file, i) =>
      uploadProductImage(file, productId, values.images.length + i)
    )
  );

  const allImages = [...values.images, ...uploadedUrls];
  const slug = values.seo.slug || slugify(values.name);

  await setDoc(docRef, {
    ...values,
    id: productId,
    slug,
    images: allImages,
    ratingAvg: 0,
    ratingCount: 0,
    soldCount: 0,
    isActive,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return productId;
}

export async function updateProduct(
  id: string,
  values: ProductFormValues,
  pendingFiles: File[],
  isActive: boolean
): Promise<void> {
  const uploadedUrls = await Promise.all(
    pendingFiles.map((file, i) =>
      uploadProductImage(file, id, values.images.length + i)
    )
  );

  const allImages = [...values.images, ...uploadedUrls];
  const slug = values.seo.slug || slugify(values.name);

  await updateDoc(doc(db, "products", id), {
    ...values,
    slug,
    images: allImages,
    isActive,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

export async function toggleProductActive(
  id: string,
  isActive: boolean
): Promise<void> {
  await updateDoc(doc(db, "products", id), {
    isActive,
    updatedAt: serverTimestamp(),
  });
}

/* ===== Orders ===== */
export function subscribeAdminOrders(
  onData: (orders: OrderDoc[]) => void,
  onErr?: (e: Error) => void
): Unsubscribe {
  const q = query(ordersCol(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => d.data())),
    (e) => onErr?.(e)
  );
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatusValue,
  adminId: string
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), {
    status,
    statusHistory: arrayUnion({ status, at: Timestamp.now(), by: adminId }),
    updatedAt: serverTimestamp(),
  });
}

/* ===== Blog ===== */
export function subscribeAdminBlog(
  onData: (posts: BlogPostDoc[]) => void,
  onErr?: (e: Error) => void
): Unsubscribe {
  const q = query(blogPostsCol(), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => d.data())),
    (e) => onErr?.(e)
  );
}

export async function createBlogPost(
  values: BlogFormValues,
  authorId: string,
  authorName: string
): Promise<string> {
  const docRef = doc(collection(db, "blogPosts"));
  const id = docRef.id;
  const slug = values.seo.slug || slugify(values.title);

  await setDoc(docRef, {
    ...values,
    id,
    slug,
    authorId,
    authorName,
    seo: { ...values.seo, slug },
    publishedAt: values.isPublished ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return id;
}

export async function updateBlogPost(
  id: string,
  values: BlogFormValues
): Promise<void> {
  const slug = values.seo.slug || slugify(values.title);
  await updateDoc(doc(db, "blogPosts", id), {
    ...values,
    slug,
    seo: { ...values.seo, slug },
    publishedAt: values.isPublished ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogPosts", id));
}
