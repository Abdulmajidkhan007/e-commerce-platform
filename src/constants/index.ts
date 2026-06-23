export * from "./categories";
export * from "./sizes";
export * from "./orderStatuses";

export const ROLES = ["user", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const TARGET_AUDIENCES = ["boys", "girls", "unisex"] as const;
export type TargetAudience = (typeof TARGET_AUDIENCES)[number];

export const SUPPORTED_LOCALES = ["uz", "en", "ru"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "uz";

export const ITEMS_PER_PAGE = 12;
export const LOW_STOCK_DEFAULT_THRESHOLD = 5;
export const MAX_CART_QTY = 10;
export const MAX_REVIEW_RATING = 5;
export const MAX_PRODUCT_IMAGES = 10;
