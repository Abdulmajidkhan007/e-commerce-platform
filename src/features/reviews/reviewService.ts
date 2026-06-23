import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/firebase";
import { reviewsCol } from "@/firebase/collections";
import type { ReviewDoc } from "@/types";
import type { ReviewFormValues } from "@/services/schemas";

export async function addReview(
  productId: string,
  userId: string,
  userName: string,
  userAvatar: string | null,
  values: ReviewFormValues
): Promise<void> {
  // Use raw collection to avoid converter id requirement on addDoc
  await addDoc(collection(db, "products", productId, "reviews"), {
    userId,
    userName,
    userAvatar,
    rating: values.rating,
    comment: values.comment,
    createdAt: serverTimestamp(),
  });
}

export async function hasUserReviewed(
  productId: string,
  userId: string
): Promise<boolean> {
  const q = query(reviewsCol(productId), where("userId", "==", userId), limit(1));
  const snap = await getDocs(q);
  return !snap.empty;
}

export function subscribeReviews(
  productId: string,
  onData: (reviews: ReviewDoc[]) => void,
  onErr?: (e: Error) => void
): Unsubscribe {
  const q = query(
    reviewsCol(productId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => d.data())),
    (e) => onErr?.(e)
  );
}
