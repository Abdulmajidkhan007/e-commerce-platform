import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { ProductFilterPanel } from "@/features/products/components/ProductFilters";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { useProducts } from "@/features/products/hooks/useProducts";
import { type SortOption } from "@/features/products/productService";

function isSortOption(v: string): v is SortOption {
  return ["new", "popular", "price_asc", "price_desc", "rating"].includes(v);
}

export default function ShopPage() {
  const { t } = useTranslation("shop");
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get("category") ?? "";
  const size = params.get("size") ?? "";
  const audience = params.get("audience") ?? "";
  const rawSort = params.get("sort") ?? "new";
  const sort: SortOption = isSortOption(rawSort) ? rawSort : "new";
  const search = params.get("q") ?? "";

  function setParam(key: string, value: string) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    });
  }

  const onClear = useCallback(() => setParams({}), [setParams]);

  const filters = {
    ...(category ? { category } : {}),
    ...(size ? { size } : {}),
    ...(audience ? { audience } : {}),
    ...(sort !== "new" ? { sort } : {}),
    ...(search ? { search } : {}),
  };

  const { items, loading, loadingMore, hasMore, loadMore } = useProducts(filters);

  return (
    <>
      <Seo title={t("title")} />
      <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ink dark:text-cream">{t("title")}</h1>

          {/* Mobile filter toggle */}
          <button
            type="button"
            className="md:hidden flex items-center gap-2 text-sm font-medium text-brand-600 border border-brand-300 rounded-btn px-3 py-1.5"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zM6 12a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zM9 19a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
            </svg>
            {t("filters.title")}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <ProductFilterPanel
            category={category}
            size={size}
            audience={audience}
            sort={sort}
            search={search}
            onCategory={(v) => setParam("category", v)}
            onSize={(v) => setParam("size", v)}
            onAudience={(v) => setParam("audience", v)}
            onSort={(v) => setParam("sort", v === "new" ? "" : v)}
            onSearch={(v) => setParam("q", v)}
            onClear={onClear}
            className="hidden md:flex w-56 shrink-0"
          />

          {/* Mobile sidebar drawer */}
          {filtersOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-ink/30 md:hidden"
                onClick={() => setFiltersOpen(false)}
              />
              <div className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-ink shadow-2xl overflow-y-auto p-5 md:hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-ink dark:text-cream">{t("filters.title")}</span>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="text-ink-light hover:text-ink"
                  >
                    ✕
                  </button>
                </div>
                <ProductFilterPanel
                  category={category}
                  size={size}
                  audience={audience}
                  sort={sort}
                  search={search}
                  onCategory={(v) => { setParam("category", v); setFiltersOpen(false); }}
                  onSize={(v) => { setParam("size", v); setFiltersOpen(false); }}
                  onAudience={(v) => { setParam("audience", v); setFiltersOpen(false); }}
                  onSort={(v) => { setParam("sort", v === "new" ? "" : v); setFiltersOpen(false); }}
                  onSearch={(v) => setParam("q", v)}
                  onClear={() => { onClear(); setFiltersOpen(false); }}
                />
              </div>
            </>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {!loading && items.length > 0 && (
              <p className="text-sm text-ink-light mb-4">
                {t("resultsCount", { count: items.length })}
              </p>
            )}
            <ProductGrid
              items={items}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
