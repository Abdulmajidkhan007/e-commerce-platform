export const SIZES = [
  "56", "62", "68", "74", "80", "86", "92", "98", "104",
  "110", "116", "122", "128", "134", "140", "146", "152",
  "XS", "S", "M", "L", "XL",
] as const;

export type SizeValue = (typeof SIZES)[number];

export const AGE_RANGES = [
  { label: "0–3 oy", min: 0, max: 3, unit: "months" as const },
  { label: "3–6 oy", min: 3, max: 6, unit: "months" as const },
  { label: "6–12 oy", min: 6, max: 12, unit: "months" as const },
  { label: "1–2 yosh", min: 1, max: 2, unit: "years" as const },
  { label: "2–3 yosh", min: 2, max: 3, unit: "years" as const },
  { label: "3–5 yosh", min: 3, max: 5, unit: "years" as const },
  { label: "5–7 yosh", min: 5, max: 7, unit: "years" as const },
  { label: "7–10 yosh", min: 7, max: 10, unit: "years" as const },
  { label: "10–14 yosh", min: 10, max: 14, unit: "years" as const },
] as const;
