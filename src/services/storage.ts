import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  type UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "@/firebase";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

function validateImage(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new StorageError("Faqat JPEG, PNG, WebP yoki GIF rasm yuklanadi");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new StorageError("Rasm hajmi 5MB dan oshmasligi kerak");
  }
}

/* Canvas orqali rasm o'lchamini qisqartirish */
async function resizeImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new StorageError("Canvas qo'llab-quvvatlanmaydi")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new StorageError("Rasm qayta ishlashda xato")); return; }
          resolve(blob);
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new StorageError("Rasm o'qishda xato"));
    img.src = url;
  });
}

/* Mahsulot rasmi yuklash */
export async function uploadProductImage(
  file: File,
  productId: string,
  index: number,
  onProgress?: (progress: number) => void
): Promise<string> {
  validateImage(file);
  const resized = await resizeImage(file, 1200, 1200);
  const path = `product-images/${productId}/${index}.webp`;
  const storageRef = ref(storage, path);

  if (onProgress) {
    const task = uploadBytesResumable(storageRef, resized, { contentType: "image/webp" });
    return new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        (snap: UploadTaskSnapshot) => {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        },
        reject,
        async () => resolve(await getDownloadURL(task.snapshot.ref))
      );
    });
  }

  await uploadBytes(storageRef, resized, { contentType: "image/webp" });
  return getDownloadURL(storageRef);
}

/* Avatar yuklash */
export async function uploadAvatar(file: File, uid: string): Promise<string> {
  validateImage(file);
  const resized = await resizeImage(file, 400, 400, 0.9);
  const path = `avatars/${uid}.webp`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, resized, { contentType: "image/webp" });
  return getDownloadURL(storageRef);
}

/* Fayl o'chirish */
export async function deleteFile(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // URL noto'g'ri bo'lsa e'tibor bermaslik
  }
}
