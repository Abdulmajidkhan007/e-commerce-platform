import {
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  type DocumentSnapshot,
} from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { blogPostsCol } from "@/firebase/collections";
import type { BlogPostDoc } from "@/types";

export const POSTS_PER_PAGE = 9;

export interface BlogFilters {
  tag?: string | undefined;
  search?: string | undefined;
}

export async function fetchBlogPosts(
  filters: BlogFilters = {},
  cursor?: DocumentSnapshot
): Promise<{ items: BlogPostDoc[]; cursor: DocumentSnapshot | null }> {
  let q = query(
    blogPostsCol(),
    where("isPublished", "==", true),
    orderBy("publishedAt", "desc"),
    limit(POSTS_PER_PAGE)
  );

  if (cursor) {
    q = query(
      blogPostsCol(),
      where("isPublished", "==", true),
      orderBy("publishedAt", "desc"),
      startAfter(cursor),
      limit(POSTS_PER_PAGE)
    );
  }

  const snap = await getDocs(q);
  let items = snap.docs.map((d) => d.data());

  if (filters.tag) {
    items = items.filter((p) => p.tags.includes(filters.tag!));
  }

  if (filters.search) {
    const q2 = filters.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q2) ||
        p.excerpt.toLowerCase().includes(q2)
    );
  }

  const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
  return { items, cursor: snap.docs.length < POSTS_PER_PAGE ? null : lastDoc };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDoc | null> {
  const snap = await getDocs(
    query(blogPostsCol(), where("slug", "==", slug), where("isPublished", "==", true), limit(1))
  );
  return snap.empty ? null : (snap.docs[0]?.data() ?? null);
}

export async function getRelatedPosts(
  tags: string[],
  excludeId: string
): Promise<BlogPostDoc[]> {
  if (!tags.length) return [];
  const snap = await getDocs(
    query(blogPostsCol(), where("isPublished", "==", true), orderBy("publishedAt", "desc"), limit(10))
  );
  return snap.docs
    .map((d) => d.data())
    .filter((p) => p.id !== excludeId && p.tags.some((t) => tags.includes(t)))
    .slice(0, 3);
}

export async function submitContactForm(values: {
  name: string;
  email: string;
  phone?: string | undefined;
  message: string;
}): Promise<void> {
  const payload: Record<string, unknown> = {
    name: values.name,
    email: values.email,
    message: values.message,
    handled: false,
    createdAt: serverTimestamp(),
  };
  if (values.phone) payload["phone"] = values.phone;
  await addDoc(collection(db, "contactMessages"), payload);
}
