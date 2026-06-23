import { z } from "zod";
import { CATEGORIES, SIZES } from "@/constants";

/* ---- Env validatsiya ---- */
export const clientEnvSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
  VITE_ADMIN_EMAIL: z.string().email().optional(),
});

/* ---- Mahsulot sxemasi ---- */
export const productColorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Rang kodi noto'g'ri (masalan: #ff0000)"),
});

export const ageRangeSchema = z.object({
  min: z.number().int().min(0),
  max: z.number().int().min(0),
  unit: z.enum(["months", "years"]),
});

const categoryValues = CATEGORIES.map((c) => c.value) as [string, ...string[]];
const sizeValues = [...SIZES] as [string, ...string[]];

export const productFormSchema = z.object({
  name: z.string().min(2, "Nom kamida 2 ta belgidan iborat bo'lishi kerak"),
  sku: z.string().min(2, "SKU kamida 2 ta belgidan iborat bo'lishi kerak"),
  category: z.enum(categoryValues, "Kategoriya tanlang"),
  type: z.string().min(1, "Tur kiriting"),
  ageRange: ageRangeSchema,
  targetAudience: z.enum(["boys", "girls", "unisex"]).optional(),
  sizes: z.array(z.enum(sizeValues)).min(1, "Kamida bitta o'lcham tanlang"),
  colors: z.array(productColorSchema).min(1, "Kamida bitta rang qo'shing"),
  price: z.number().int().min(1000, "Narx kamida 1 000 so'm"),
  discountPrice: z.number().int().nullable().optional(),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(1),
  description: z.string().min(10, "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak"),
  images: z.array(z.string().url()).max(10, "Maksimal 10 ta rasm"),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().min(1),
  }),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

/* ---- Buyurtma sxemasi ---- */
export const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  lastName: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z.string().regex(/^\+?[0-9]{9,13}$/, "Telefon raqami noto'g'ri"),
  address: z.string().min(5, "Manzil kamida 5 ta belgidan iborat bo'lishi kerak"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash", "partial_online"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

/* ---- Profil sxemasi ---- */
export const profileFormSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgi"),
  lastName: z.string().min(2, "Familiya kamida 2 ta belgi"),
  phone: z.string().regex(/^\+?[0-9]{9,13}$/, "Telefon noto'g'ri").optional().or(z.literal("")),
  bio: z.string().max(300, "Bio 300 ta belgidan oshmasin").optional().or(z.literal("")),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()).nullable().optional(),
  address: z.object({
    line1: z.string().min(1),
    city: z.string().min(1),
    region: z.string().min(1),
    notes: z.string().optional(),
  }).nullable().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/* ---- Auth sxemalari ---- */
export const loginSchema = z.object({
  email: z.string().email("Email noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 ta belgi"),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "Ism kamida 2 ta belgi"),
    lastName: z.string().min(2, "Familiya kamida 2 ta belgi"),
    email: z.string().email("Email noto'g'ri"),
    password: z.string().min(6, "Parol kamida 6 ta belgi"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmaydi",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

/* ---- Aloqa sxemasi ---- */
export const contactFormSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgi"),
  email: z.string().email("Email noto'g'ri"),
  phone: z.string().optional(),
  message: z.string().min(10, "Xabar kamida 10 ta belgi"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/* ---- Blog sxemasi ---- */
export const blogFormSchema = z.object({
  title: z.string().min(3, "Sarlavha kamida 3 ta belgi"),
  slug: z.string().min(2),
  excerpt: z.string().min(10, "Qisqacha tavsif kamida 10 ta belgi").max(300),
  content: z.string().min(50, "Maqola matni kamida 50 ta belgi"),
  coverImage: z.string().url("Rasm URL noto'g'ri"),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean(),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().min(1),
  }),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

/* ---- Sharh sxemasi ---- */
export const reviewFormSchema = z.object({
  rating: z.number().int().min(1).max(5, "Baho 1 dan 5 gacha bo'lishi kerak"),
  comment: z.string().min(5, "Sharh kamida 5 ta belgi").max(500, "Sharh 500 ta belgidan oshmasin"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
