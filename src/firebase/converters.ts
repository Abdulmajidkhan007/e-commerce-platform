import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import type {
  UserDoc,
  ProductDoc,
  ReviewDoc,
  OrderDoc,
  BlogPostDoc,
  ContactDoc,
} from "@/types";

function makeConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(snap: QueryDocumentSnapshot, options: SnapshotOptions): T {
      return { id: snap.id, ...snap.data(options) } as unknown as T;
    },
  };
}

export const userConverter = makeConverter<UserDoc>();
export const productConverter = makeConverter<ProductDoc>();
export const reviewConverter = makeConverter<ReviewDoc>();
export const orderConverter = makeConverter<OrderDoc>();
export const blogPostConverter = makeConverter<BlogPostDoc>();
export const contactConverter = makeConverter<ContactDoc>();

/* Firestore Timestamp → Date yordamchi */
export function tsToDate(ts: Timestamp | null | undefined): Date | null {
  if (!ts) return null;
  return ts.toDate();
}

export function nowTimestamp(): Timestamp {
  return Timestamp.now();
}
