import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { StarRating } from "@/features/products/components/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import type { ReviewDoc } from "@/types";

interface ReviewListProps {
  reviews: ReviewDoc[];
  loading: boolean;
}

export function ReviewList({ reviews, loading }: ReviewListProps) {
  const { t } = useTranslation("shop");

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-10 h-10 rounded-full bg-cream-dark dark:bg-ink-light/20 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 w-32 bg-cream-dark dark:bg-ink-light/20 rounded" />
              <div className="h-3 w-full bg-cream-dark dark:bg-ink-light/20 rounded" />
              <div className="h-3 w-2/3 bg-cream-dark dark:bg-ink-light/20 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-ink-light dark:text-cream/60 py-4 text-center">
        {t("product.noReviews")}
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-cream-dark dark:divide-ink-light/20">
      {reviews.map((review) => (
        <div key={review.id} className="py-4 flex gap-3">
          <Avatar
            src={review.userAvatar}
            firstName={review.userName.split(" ")[0] ?? ""}
            lastName={review.userName.split(" ")[1] ?? ""}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <span className="font-medium text-sm text-ink dark:text-cream">
                {review.userName}
              </span>
              <span className="text-xs text-ink-light shrink-0">
                {dayjs(review.createdAt.toDate()).format("DD.MM.YYYY")}
              </span>
            </div>
            <StarRating value={review.rating} size="sm" className="mt-1" />
            <p className="mt-2 text-sm text-ink dark:text-cream/90 leading-relaxed">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
