import { useTranslation } from "react-i18next";
import { CATEGORIES } from "@/constants";
import { SIZES } from "@/constants";
import { TARGET_AUDIENCES } from "@/constants";
import { cn } from "@/utils/cn";
import type { SortOption } from "../productService";

interface ProductFiltersProps {
  category: string;
  size: string;
  audience: string;
  sort: SortOption;
  search: string;
  onCategory: (v: string) => void;
  onSize: (v: string) => void;
  onAudience: (v: string) => void;
  onSort: (v: SortOption) => void;
  onSearch: (v: string) => void;
  onClear: () => void;
  className?: string;
}

const SORT_OPTIONS: { value: SortOption; key: string }[] = [
  { value: "new", key: "sort.new" },
  { value: "popular", key: "sort.popular" },
  { value: "price_asc", key: "sort.price_asc" },
  { value: "price_desc", key: "sort.price_desc" },
  { value: "rating", key: "sort.rating" },
];

export function ProductFilterPanel({
  category,
  size,
  audience,
  sort,
  search,
  onCategory,
  onSize,
  onAudience,
  onSort,
  onSearch,
  onClear,
  className,
}: ProductFiltersProps) {
  const { t } = useTranslation(["shop", "common"]);

  const hasFilters = !!(category || size || audience || search || sort !== "new");

  return (
    <aside className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ink dark:text-cream">{t("shop:filters.title")}</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-brand-600 hover:underline"
          >
            {t("shop:filters.clear")}
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t("shop:search")}
          className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-ink-light uppercase tracking-wider mb-2">
          {t("shop:filters.sort")}
        </p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSort(opt.value)}
              className={cn(
                "text-left text-sm px-2 py-1.5 rounded-btn transition-colors",
                sort === opt.value
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 font-medium"
                  : "text-ink-light hover:bg-brand-50 dark:hover:bg-brand-900/10"
              )}
            >
              {t(`shop:${opt.key}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-ink-light uppercase tracking-wider mb-2">
          {t("shop:filters.category")}
        </p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onCategory("")}
            className={cn(
              "text-left text-sm px-2 py-1.5 rounded-btn transition-colors",
              !category
                ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 font-medium"
                : "text-ink-light hover:bg-brand-50 dark:hover:bg-brand-900/10"
            )}
          >
            {t("shop:filters.all")}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onCategory(cat.value)}
              className={cn(
                "text-left text-sm px-2 py-1.5 rounded-btn transition-colors",
                category === cat.value
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 font-medium"
                  : "text-ink-light hover:bg-brand-50 dark:hover:bg-brand-900/10"
              )}
            >
              {t(`common:categories.${cat.value}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Audience */}
      <div>
        <p className="text-xs font-semibold text-ink-light uppercase tracking-wider mb-2">
          {t("shop:filters.audience")}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onAudience("")}
            className={cn(
              "px-3 py-1 text-sm rounded-full border transition-colors",
              !audience
                ? "bg-brand-500 text-white border-brand-500"
                : "border-cream-dark dark:border-ink-light/40 text-ink-light hover:border-brand-400"
            )}
          >
            {t("shop:filters.all")}
          </button>
          {TARGET_AUDIENCES.map((aud) => (
            <button
              key={aud}
              type="button"
              onClick={() => onAudience(aud)}
              className={cn(
                "px-3 py-1 text-sm rounded-full border transition-colors",
                audience === aud
                  ? "bg-brand-500 text-white border-brand-500"
                  : "border-cream-dark dark:border-ink-light/40 text-ink-light hover:border-brand-400"
              )}
            >
              {t(`shop:audience.${aud}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-xs font-semibold text-ink-light uppercase tracking-wider mb-2">
          {t("shop:filters.size")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSize(size === s ? "" : s)}
              className={cn(
                "min-w-[2.5rem] px-2 py-1 text-xs font-medium rounded border transition-colors",
                size === s
                  ? "bg-brand-500 text-white border-brand-500"
                  : "border-cream-dark dark:border-ink-light/40 text-ink dark:text-cream hover:border-brand-400"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
