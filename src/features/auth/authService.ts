import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getIdTokenResult,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { userConverter } from "@/firebase/converters";
import type { AppUser, UserDoc } from "@/types";
import type { Role } from "@/constants";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/* Firebase User → AppUser */
export async function toAppUser(user: User): Promise<AppUser> {
  const tokenResult = await getIdTokenResult(user, false);
  const role = (tokenResult.claims["role"] as Role | undefined) ?? "user";
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role,
  };
}

/* Yangi foydalanuvchi Firestore hujjatini yaratish */
export async function createUserDoc(
  user: User,
  firstName: string,
  lastName: string
): Promise<void> {
  const userRef = doc(db, "users", user.uid).withConverter(userConverter);
  const existing = await getDoc(userRef);
  if (existing.exists()) return;

  const newUser: Omit<UserDoc, "id"> = {
    uid: user.uid,
    email: user.email ?? "",
    role: "user",
    firstName,
    lastName,
    birthYear: null,
    avatarUrl: user.photoURL ?? null,
    bio: null,
    phone: null,
    address: null,
    createdAt: serverTimestamp() as never,
    updatedAt: serverTimestamp() as never,
  };

  await setDoc(userRef, newUser as UserDoc);
}

/* Foydalanuvchi ma'lumotlarini Firestore dan olish */
export async function getUserDoc(uid: string): Promise<UserDoc | null> {
  const userRef = doc(db, "users", uid).withConverter(userConverter);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

/* Email/parol bilan ro'yxatdan o'tish */
export async function registerWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AppUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDoc(cred.user, firstName, lastName);
  return toAppUser(cred.user);
}

/* Email/parol bilan kirish */
export async function loginWithEmail(email: string, password: string): Promise<AppUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return toAppUser(cred.user);
}

/* Google bilan kirish */
export async function loginWithGoogle(): Promise<AppUser> {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;
  const names = user.displayName?.split(" ") ?? ["", ""];
  await createUserDoc(user, names[0] ?? "", names.slice(1).join(" ") ?? "");
  return toAppUser(user);
}

/* Chiqish */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/* Token yangilash (custom claim o'rnatilgandan keyin) */
export async function refreshUserClaims(user: User): Promise<AppUser> {
  await getIdTokenResult(user, true); // force refresh
  return toAppUser(user);
}
