import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/feedback/Spinner";
import { createBlogPost, updateBlogPost } from "@/features/admin/adminService";
import { blogFormSchema, type BlogFormValues } from "@/services/schemas";
import { useAppSelector } from "@/store";
import { selectUser } from "@/features/auth/authSlice";
import { PATHS } from "@/routes/paths";
import { cn } from "@/utils/cn";

export default function BlogFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [fetchingPost, setFetchingPost] = useState(isEdit);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: [],
      isPublished: false,
      seo: { title: "", description: "", slug: "" },
    },
  });

  const tags = watch("tags") ?? [];
  const isPublished = watch("isPublished");

  useEffect(() => {
    if (!isEdit || !id) return;
    setFetchingPost(true);
    getDoc(doc(db, "blogPosts", id))
      .then((snap) => {
        if (!snap.exists()) {
          toast.error("Maqola topilmadi");
          navigate(PATHS.ADMIN_BLOG);
          return;
        }
        const data = snap.data() as BlogFormValues & { id: string };
        reset({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImage,
          tags: data.tags ?? [],
          isPublished: data.isPublished,
          seo: data.seo,
        });
      })
      .catch(() => toast.error("Maqola yuklanmadi"))
      .finally(() => setFetchingPost(false));
  }, [id, isEdit, navigate, reset]);

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || tags.includes(tag)) return;
    setValue("tags", [...tags, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setValue("tags", tags.filter((t) => t !== tag));
  }

  async function onSubmit(values: BlogFormValues) {
    if (!user) return;
    try {
      if (isEdit && id) {
        await updateBlogPost(id, values);
        toast.success("Maqola yangilandi");
      } else {
        const authorName = `${user.displayName ?? user.email ?? "Admin"}`;
        await createBlogPost(values, user.uid, authorName);
        toast.success("Maqola yaratildi");
      }
      navigate(PATHS.ADMIN_BLOG);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xatolik yuz berdi");
    }
  }

  if (fetchingPost) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Seo title={isEdit ? "Maqolani tahrirlash" : "Yangi maqola"} noIndex />
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(PATHS.ADMIN_BLOG)}
            className="text-sm text-ink-light hover:text-ink dark:hover:text-cream"
          >
            ← Orqaga
          </button>
          <h1 className="text-2xl font-bold text-ink dark:text-cream">
            {isEdit ? "Maqolani tahrirlash" : "Yangi maqola"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Basic */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-ink dark:text-cream">Asosiy ma'lumotlar</h2>
            <Input
              label="Sarlavha"
              error={errors.title?.message}
              {...register("title")}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink dark:text-cream">
                Qisqacha tavsif
              </label>
              <textarea
                rows={3}
                placeholder="Maqolaning qisqacha tavsifi..."
                className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                {...register("excerpt")}
              />
              {errors.excerpt && (
                <p className="text-xs text-error">{errors.excerpt.message}</p>
              )}
            </div>
            <Input
              label="Muqova rasmi URL"
              placeholder="https://..."
              error={errors.coverImage?.message}
              {...register("coverImage")}
            />
          </section>

          {/* Content */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-ink dark:text-cream">Maqola matni</h2>
            <textarea
              rows={12}
              placeholder="Maqola matnini shu yerga kiriting..."
              className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none font-mono"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-error">{errors.content.message}</p>
            )}
          </section>

          {/* Tags */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-ink dark:text-cream">Teglar</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Teg qo'shing..."
                className="flex-1 rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                Qo'shish
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-brand-400 hover:text-brand-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* SEO */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-ink dark:text-cream">SEO</h2>
            <Input
              label="SEO sarlavhasi"
              error={errors.seo?.title?.message}
              {...register("seo.title")}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink dark:text-cream">SEO tavsifi</label>
              <textarea
                rows={2}
                className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                {...register("seo.description")}
              />
            </div>
            <Input
              label="Slug (URL)"
              placeholder="avto-yaratiladi"
              error={errors.seo?.slug?.message}
              {...register("seo.slug")}
            />
          </section>

          {/* Publish + submit */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Controller
              control={control}
              name="isPublished"
              render={({ field }) => (
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                      field.value ? "bg-brand-500" : "bg-ink-light/30"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                        field.value ? "translate-x-6" : "translate-x-0.5"
                      )}
                    />
                  </div>
                  <span className="text-sm font-medium text-ink dark:text-cream">
                    {isPublished ? "Chop etilgan" : "Qoralama"}
                  </span>
                </label>
              )}
            />

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(PATHS.ADMIN_BLOG)}
              >
                Bekor qilish
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {isEdit ? "Saqlash" : "Yaratish"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
