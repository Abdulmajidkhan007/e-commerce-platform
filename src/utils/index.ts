import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/uz";
import "dayjs/locale/ru";

dayjs.extend(relativeTime);

export function formatMoney(amount: number, currency = "UZS"): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: Date | string | number,
  locale = "uz",
  format = "DD.MM.YYYY"
): string {
  return dayjs(date).locale(locale).format(format);
}

export function formatRelativeDate(date: Date | string | number, locale = "uz"): string {
  return dayjs(date).locale(locale).fromNow();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateDiscountPercent(price: number, discountPrice: number): number {
  if (price <= 0 || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KW-${timestamp}-${random}`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
