import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { userConverter } from "@/firebase/converters";
import { uploadAvatar } from "@/services/storage";
import type { UserDoc } from "@/types";
import type { ProfileFormValues } from "@/services/schemas";

export async function getProfile(uid: string): Promise<UserDoc | null> {
  const ref = doc(db, "users", uid).withConverter(userConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateProfile(
  uid: string,
  values: ProfileFormValues,
  gpsLocation?: { lat: number; lng: number } | null
): Promise<void> {
  const ref = doc(db, "users", uid);

  const address = values.address
    ? { ...values.address, ...(gpsLocation ? { location: gpsLocation } : {}) }
    : null;

  const updateData: Record<string, unknown> = {
    firstName: values.firstName,
    lastName: values.lastName,
    phone: values.phone ?? null,
    bio: values.bio ?? null,
    birthYear: values.birthYear ?? null,
    address,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(ref, updateData);
}

export async function updateAvatar(uid: string, file: File): Promise<string> {
  const url = await uploadAvatar(file, uid);
  await updateDoc(doc(db, "users", uid), {
    avatarUrl: url,
    updatedAt: serverTimestamp(),
  });
  return url;
}

export async function getUserLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000 }
    );
  });
}
