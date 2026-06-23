import type { Timestamp } from "firebase/firestore";
import type { OrderStatusValue, PaymentMethodValue, PaymentStatusValue } from "@/constants";
import type { Role, TargetAudience } from "@/constants";

export interface UserDoc {
  uid: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  birthYear: number | null;
  avatarUrl: string | null;
  bio: string | null;
  phone: string | null;
  address: {
    line1: string;
    city: string;
    region: string;
    notes?: string;
    location?: { lat: number; lng: number } | null;
  } | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface AgeRange {
  min: number;
  max: number;
  unit: "months" | "years";
}

export interface ProductSeo {
  title: string;
  description: string;
  slug: string;
}

export interface ProductDoc {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  type: string;
  ageRange: AgeRange;
  targetAudience?: TargetAudience;
  sizes: string[];
  colors: ProductColor[];
  price: number;
  discountPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  description: string;
  images: string[];
  ratingAvg: number;
  ratingCount: number;
  soldCount: number;
  isActive: boolean;
  seo: ProductSeo;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ReviewDoc {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  sku: string;
  color: string;
  size: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderPayment {
  method: PaymentMethodValue;
  status: PaymentStatusValue;
  depositAmount: number;
  paidAmount: number;
  dueOnDelivery: number;
}

export interface OrderStatusHistory {
  status: string;
  at: Timestamp;
  by: string;
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  notes?: string | null;
  location?: { lat: number; lng: number } | null;
}

export interface OrderDoc {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  customer: OrderCustomer;
  payment: OrderPayment;
  status: OrderStatusValue;
  statusHistory: OrderStatusHistory[];
  telegramMessageId?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BlogPostDoc {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  authorId: string;
  authorName: string;
  isPublished: boolean;
  seo: ProductSeo;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ContactDoc {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  handled: boolean;
  createdAt: Timestamp;
}

export interface StatsAggregates {
  totalRevenue: number;
  totalOrders: number;
  statusCounts: Record<OrderStatusValue, number>;
  updatedAt: Timestamp;
}

/* Cart types (client-only) */
export interface CartItem {
  productId: string;
  name: string;
  image: string;
  sku: string;
  slug: string;
  color: string;
  colorHex: string;
  size: string;
  qty: number;
  unitPrice: number;
  stock: number;
}

/* App-level user (from auth + Firestore) */
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: Role;
}
