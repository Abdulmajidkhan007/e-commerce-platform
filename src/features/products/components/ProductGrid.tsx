import { useTranslation } from "react-i18next";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/feedback/Spinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import type { ProductDoc } from "@/types";

interface ProductGridProps {
  items: ProductDoc[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const SKELETON_COUNT = 8;

export function ProductGrid({ items, loading, loadingMore, hasMore, onLoadMore }: ProductGridProps) {
  const { t } = useTranslation("shop");

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={t("noResults")}
        description={t("noResultsDesc")}
        icon={<span className="text-4xl">🔍</span>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            isLoading={loadingMore}
          >
            {t("loadMore")}
          </Button>
        </div>
      )}

      {loadingMore && !hasMore && (
        <div className="flex justify-center py-4">
          <Spinner size="md" />
        </div>
      )}
    </div>
  );
}
