import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { StarRating } from "@/features/products/components/StarRating";
import { Button } from "@/components/ui/Button";
import { reviewFormSchema, type ReviewFormValues } from "@/services/schemas";
import { addReview } from "../reviewService";
import { PATHS } from "@/routes/paths";
import type { AppUser } from "@/types";

interface ReviewFormProps {
  productId: string;
  user: AppUser | null;
  alreadyReviewed: boolean;
}

export function ReviewForm({ productId, user, alreadyReviewed }: ReviewFormProps) {
  const { t } = useTranslation("shop");
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  async function onSubmit(values: ReviewFormValues) {
    if (!user) return;
    await addReview(
      productId,
      user.uid,
      user.displayName ?? user.email ?? "Anonim",
      user.photoURL,
      values
    );
    toast.success(t("review.success"));
    setSubmitted(true);
  }

  if (!user) {
    return (
      <p className="text-sm text-ink-light">
        {t("review.loginRequired")}{" "}
        <Link to={PATHS.LOGIN} className="text-brand-600 hover:underline">
          {t("nav.login", { ns: "common" })}
        </Link>
      </p>
    );
  }

  if (alreadyReviewed || submitted) {
    return (
      <p className="text-sm text-success">{t("review.alreadyReviewed")}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-ink dark:text-cream block mb-2">
          {t("review.rating")}
        </label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <StarRating value={field.value} onChange={field.onChange} size="lg" />
          )}
        />
        {errors.rating && (
          <p className="text-xs text-error mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-ink dark:text-cream block mb-1">
          {t("review.comment")}
        </label>
        <textarea
          rows={4}
          placeholder={t("review.placeholder")}
          className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          {...register("comment")}
        />
        {errors.comment && (
          <p className="text-xs text-error mt-1">{errors.comment.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="self-start">
        {t("review.submit")}
      </Button>
    </form>
  );
}
