import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/firebase";
import { ordersCol } from "@/firebase/collections";
import type { CartItem, OrderDoc } from "@/types";
import type { CheckoutFormValues } from "@/services/schemas";

export const SHIPPING_FEE = 25_000;
export const FREE_SHIPPING_THRESHOLD = 500_000;

export function calcShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export async function createOrder(
  userId: string,
  items: CartItem[],
  values: CheckoutFormValues,
  gpsLocation?: { lat: number; lng: number } | null
): Promise<string> {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const shippingFee = calcShippingFee(subtotal);
  const total = subtotal + shippingFee;
  const depositAmount =
    values.paymentMethod === "partial_online" ? Math.ceil(total * 0.5) : 0;

  const docRef = await addDoc(collection(db, "orders"), {
    userId,
    items: items.map((i) => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      sku: i.sku,
      color: i.color,
      size: i.size,
      qty: i.qty,
      unitPrice: i.unitPrice,
      lineTotal: i.unitPrice * i.qty,
    })),
    subtotal,
    shippingFee,
    total,
    customer: {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      address: values.address,
      notes: values.notes ?? null,
      ...(gpsLocation ? { location: gpsLocation } : {}),
    },
    payment: {
      method: values.paymentMethod,
      status:
        values.paymentMethod === "partial_online" ? "deposit_paid" : "unpaid",
      depositAmount,
      paidAmount: depositAmount,
      dueOnDelivery: total - depositAmount,
    },
    status: "pending",
    statusHistory: [{ status: "pending", at: Timestamp.now(), by: userId }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export function subscribeUserOrders(
  userId: string,
  onData: (orders: OrderDoc[]) => void,
  onErr?: (e: Error) => void
): Unsubscribe {
  const q = query(
    ordersCol(),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => d.data())),
    (e) => onErr?.(e)
  );
}
