export const ORDER_STATUSES = [
  {
    value: "pending",
    labelKey: "order.status.pending",
    color: "#ca8a04",
    bgColor: "#fef9c3",
    order: 0,
  },
  {
    value: "confirmed",
    labelKey: "order.status.confirmed",
    color: "#2563eb",
    bgColor: "#dbeafe",
    order: 1,
  },
  {
    value: "packing",
    labelKey: "order.status.packing",
    color: "#7c3aed",
    bgColor: "#ede9fe",
    order: 2,
  },
  {
    value: "shipped",
    labelKey: "order.status.shipped",
    color: "#0891b2",
    bgColor: "#cffafe",
    order: 3,
  },
  {
    value: "delivered",
    labelKey: "order.status.delivered",
    color: "#16a34a",
    bgColor: "#dcfce7",
    order: 4,
  },
  {
    value: "cancelled",
    labelKey: "order.status.cancelled",
    color: "#dc2626",
    bgColor: "#fee2e2",
    order: -1,
  },
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number]["value"];

export const PAYMENT_METHODS = [
  { value: "cash", labelKey: "payment.cash" },
  { value: "partial_online", labelKey: "payment.partial_online" },
] as const;

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"];

export const PAYMENT_STATUSES = [
  { value: "unpaid", labelKey: "payment.status.unpaid" },
  { value: "deposit_paid", labelKey: "payment.status.deposit_paid" },
  { value: "paid", labelKey: "payment.status.paid" },
] as const;

export type PaymentStatusValue = (typeof PAYMENT_STATUSES)[number]["value"];
