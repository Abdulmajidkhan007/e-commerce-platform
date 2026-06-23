import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type DocumentData,
  type CollectionReference,
  type QueryConstraint,
  type DocumentSnapshot,
  type QuerySnapshot,
  serverTimestamp,
  type FieldValue,
} from "firebase/firestore";

export { serverTimestamp };
export type { FieldValue };

/* Hujjat o'qish */
export async function getDocument<T extends DocumentData>(
  colRef: CollectionReference<T>,
  id: string
): Promise<T | null> {
  const snap = await getDoc(doc(colRef, id));
  return snap.exists() ? snap.data() : null;
}

/* Kolleksiya o'qish */
export async function getCollection<T extends DocumentData>(
  colRef: CollectionReference<T>,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(colRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

/* Hujjat yaratish/ustiga yozish */
export async function setDocument<T extends DocumentData>(
  colRef: CollectionReference<T>,
  id: string,
  data: Omit<T, "id">
): Promise<void> {
  await setDoc(doc(colRef, id), data as DocumentData);
}

/* Hujjat yangilash */
export async function updateDocument<T extends DocumentData>(
  colRef: CollectionReference<T>,
  id: string,
  data: Partial<Omit<T, "id">>
): Promise<void> {
  await updateDoc(doc(colRef, id), data as DocumentData);
}

/* Hujjat o'chirish */
export async function deleteDocument<T extends DocumentData>(
  colRef: CollectionReference<T>,
  id: string
): Promise<void> {
  await deleteDoc(doc(colRef, id));
}

/* Sahifalash yordamchilari */
export { query, where, orderBy, limit, startAfter };
export type { DocumentSnapshot, QuerySnapshot, QueryConstraint };
