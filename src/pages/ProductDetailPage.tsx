import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { Spinner } from "@/components/feedback/Spinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/features/products/components/StarRating";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useReviews } from "@/features/reviews/hooks/useReviews";
import { useAppDispatch, useAppSelector } from "@/store";
import { addItem } from "@/features/cart/cartSlice";
import { selectUser } from "@/features/auth/authSlice";
import { PATHS } from "@/routes/paths";
import { cn } from "@/utils/cn";

export default function ProductDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { t } = useTranslation(["shop", "common"]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const { product, related, loading, error } = useProduct(slug);
  const { reviews, loading: reviewsLoading, alreadyReviewed } = useReviews(
    product?.id ?? "",
    user?.uid
  );

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);

  if (loading) {
    return (
      <Container className="py-20 flex justify-center">
        <Spinner size="lg" />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-20">
        <EmptyState
          title={t("common:errors.notFound")}
          description={error ?? ""}
          icon={<span className="text-4xl">🔍</span>}
        />
      </Container>
    );
  }

  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = product.discountPrice ?? product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - displayPrice / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const images = product.images.length > 0 ? product.images : ["/placeholder-product.svg"];

  const activeColor = selectedColor || (product.colors[0]?.name ?? "");
  const activeSize = selectedSize || (product.sizes[0] ?? "");

  function handleAddToCart() {
    if (!product) return;
    const colorObj = product.colors.find((c) => c.name === activeColor) ?? product.colors[0];
    if (!colorObj || !activeSize) {
      toast.error("Rang va o'lcham tanlang");
      return;
    }
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        image: images[0] ?? "",
        sku: product.sku,
        slug: product.slug,
        color: colorObj.name,
        colorHex: colorObj.hex,
        size: activeSize,
        qty,
        unitPrice: displayPrice,
        stock: product.stock,
      })
    );
    toast.success(t("common:btn.addToCart"));
  }

  return (
    <>
      <Seo
        title={product.seo.title || product.name}
        description={product.seo.description || product.description}
      />
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink-light mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to={PATHS.SHOP} className="hover:text-brand-600 transition-colors">
            {t("shop:title")}
          </Link>
          <span>/</span>
          <span className="text-ink dark:text-cream">{product.name}</span>
        </nav>

        {/* Product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* Image gallery */}
          <div className="flex flex-col gap-3">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className="w-full rounded-card overflow-hidden aspect-square bg-cream"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`${product.name} - ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {images.length > 1 && (
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbsSwiper}
                watchSlidesProgress
                slidesPerView={4}
                spaceBetween={8}
                freeMode
                className="w-full"
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i} className="cursor-pointer">
                    <img
                      src={img}
                      alt={`thumb ${i + 1}`}
                      className="w-full aspect-square object-cover rounded border-2 border-transparent [.swiper-slide-thumb-active_&]:border-brand-500"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs text-ink-light uppercase tracking-wider mb-1">
                {t(`common:categories.${product.category}`)}
              </p>
              <h1 className="text-2xl font-bold text-ink dark:text-cream leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-ink-light mt-1">{t("shop:product.sku")}: {product.sku}</p>
            </div>

            {/* Rating */}
            {product.ratingCount > 0 && (
              <div className="flex items-center gap-2">
                <StarRating value={product.ratingAvg} size="md" />
                <span className="text-sm text-ink-light">
                  {product.ratingAvg.toFixed(1)} ({product.ratingCount} sharh)
                </span>
                <span className="text-xs text-ink-light">·</span>
                <span className="text-xs text-ink-light">
                  {t("shop:product.soldCount", { count: product.soldCount })}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-ink dark:text-cream">
                {displayPrice.toLocaleString()} so'm
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-ink-light line-through">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-error bg-error/10 px-2 py-0.5 rounded-full">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            {isOutOfStock ? (
              <p className="text-error font-medium">{t("shop:product.outOfStock")}</p>
            ) : isLowStock ? (
              <p className="text-amber-600 font-medium text-sm">
                {t("shop:product.lowStock", { count: product.stock })}
              </p>
            ) : (
              <p className="text-success text-sm">{t("shop:product.inStock")}</p>
            )}

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-ink dark:text-cream mb-2">
                  {t("shop:product.selectColor")}: <span className="text-brand-600">{activeColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        activeColor === c.name
                          ? "border-brand-500 scale-110 shadow-md"
                          : "border-transparent hover:border-ink-light/50"
                      )}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                      aria-pressed={activeColor === c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-ink dark:text-cream mb-2">
                  {t("shop:product.selectSize")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={cn(
                        "min-w-[2.75rem] px-3 py-1.5 text-sm font-medium rounded border-2 transition-colors",
                        activeSize === s
                          ? "bg-brand-500 text-white border-brand-500"
                          : "border-cream-dark dark:border-ink-light/40 text-ink dark:text-cream hover:border-brand-400"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-cream-dark dark:border-ink-light/40 rounded-btn overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-ink dark:text-cream hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium text-ink dark:text-cream">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(q + 1, product.stock))}
                  disabled={isOutOfStock}
                  className="w-10 h-10 flex items-center justify-center text-ink dark:text-cream hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1"
              >
                {t("shop:product.addToCart")}
              </Button>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-cream-dark dark:border-ink-light/20">
              <h3 className="font-semibold text-ink dark:text-cream mb-2">
                {t("shop:product.description")}
              </h3>
              <p className="text-sm text-ink dark:text-cream/80 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <section className="border-t border-cream-dark dark:border-ink-light/20 pt-10 mb-14">
          <h2 className="text-xl font-bold text-ink dark:text-cream mb-6">
            {t("shop:product.reviews")}
            {reviews.length > 0 && (
              <span className="ml-2 text-sm font-normal text-ink-light">({reviews.length})</span>
            )}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            <ReviewList reviews={reviews} loading={reviewsLoading} />
            <div>
              <h3 className="font-semibold text-ink dark:text-cream mb-4">
                {t("shop:review.title")}
              </h3>
              <ReviewForm
                productId={product.id}
                user={user}
                alreadyReviewed={alreadyReviewed}
              />
            </div>
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-ink dark:text-cream mb-6">
              {t("shop:product.related")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
