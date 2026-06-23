import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const measurementId = import.meta.env["VITE_FIREBASE_MEASUREMENT_ID"] as string | undefined;

const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] as string,
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] as string,
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] as string,
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] as string,
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] as string,
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] as string,
  ...(measurementId !== undefined ? { measurementId } : {}),
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const useEmulators = import.meta.env["VITE_USE_EMULATORS"] === "true";

if (useEmulators) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}

export default app;
