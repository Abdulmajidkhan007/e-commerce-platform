export const CATEGORIES = [
  { value: "tops", labelKey: "categories.tops" },
  { value: "bottoms", labelKey: "categories.bottoms" },
  { value: "dresses", labelKey: "categories.dresses" },
  { value: "outerwear", labelKey: "categories.outerwear" },
  { value: "sleepwear", labelKey: "categories.sleepwear" },
  { value: "underwear", labelKey: "categories.underwear" },
  { value: "swimwear", labelKey: "categories.swimwear" },
  { value: "accessories", labelKey: "categories.accessories" },
  { value: "shoes", labelKey: "categories.shoes" },
  { value: "sets", labelKey: "categories.sets" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
