import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { productsCol } from "@/firebase/collections";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/feedback/Spinner";
import { createProduct, updateProduct } from "@/features/admin/adminService";
import { productFormSchema, type ProductFormValues } from "@/services/schemas";
import { CATEGORIES, SIZES, TARGET_AUDIENCES, AGE_RANGES } from "@/constants";
import { PATHS } from "@/routes/paths";
import { cn } from "@/utils/cn";

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fetchingProduct, setFetchingProduct] = useState(isEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "tops",
      type: "",
      ageRange: { min: 0, max: 3, unit: "months" },
      targetAudience: "unisex",
      sizes: [],
      colors: [{ name: "", hex: "#000000" }],
      price: 0,
      discountPrice: null,
      stock: 0,
      lowStockThreshold: 5,
      description: "",
      images: [],
      seo: { title: "", description: "", slug: "" },
    },
  });

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: "colors",
  });

  const selectedSizes = watch("sizes");

  useEffect(() => {
    if (!isEdit || !id) return;
    setFetchingProduct(true);
    getDoc(doc(productsCol(), id))
      .then((snap) => {
        if (!snap.exists()) {
          toast.error("Mahsulot topilmadi");
          navigate(PATHS.ADMIN_PRODUCTS);
          return;
        }
        const data = snap.data();
        setIsActive(data.isActive);
        setImageUrls(data.images);
        reset({
          name: data.name,
          sku: data.sku,
          category: data.category,
          type: data.type,
          ageRange: data.ageRange,
          targetAudience: data.targetAudience,
          sizes: data.sizes,
          colors: data.colors,
          price: data.price,
          discountPrice: data.discountPrice ?? null,
          stock: data.stock,
          lowStockThreshold: data.lowStockThreshold,
          description: data.description,
          images: data.images,
          seo: data.seo,
        });
      })
      .catch(() => toast.error("Mahsulot yuklanmadi"))
      .finally(() => setFetchingProduct(false));
  }, [id, isEdit, navigate, reset]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const totalImages = imageUrls.length + pendingFiles.length + files.length;
    if (totalImages > 10) {
      toast.error("Maksimal 10 ta rasm yuklash mumkin");
      return;
    }
    setPendingFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeExistingImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function removePendingFile(index: number) {
    URL.revokeObjectURL(previewUrls[index] ?? "");
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleSize(size: string) {
    const current = selectedSizes ?? [];
    if (current.includes(size as never)) {
      setValue(
        "sizes",
        current.filter((s) => s !== size) as ProductFormValues["sizes"],
        { shouldValidate: true }
      );
    } else {
      setValue("sizes", [...current, size as never] as ProductFormValues["sizes"], {
        shouldValidate: true,
      });
    }
  }

  async function onSubmit(values: ProductFormValues) {
    const allImageUrls = [...imageUrls];
    values = { ...values, images: allImageUrls };
    try {
      if (isEdit && id) {
        await updateProduct(id, values, pendingFiles, isActive);
        toast.success("Mahsulot yangilandi");
      } else {
        await createProduct(values, pendingFiles, isActive);
        toast.success("Mahsulot yaratildi");
      }
      navigate(PATHS.ADMIN_PRODUCTS);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xatolik yuz berdi");
    }
  }

  if (fetchingProduct) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Seo title={isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot"} noIndex />
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(PATHS.ADMIN_PRODUCTS)}
            className="text-sm text-ink-light hover:text-ink dark:hover:text-cream"
          >
            ← Orqaga
          </button>
          <h1 className="text-2xl font-bold text-ink dark:text-cream">
            {isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Basic info */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-ink dark:text-cream">Asosiy ma'lumotlar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mahsulot nomi"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input label="SKU" error={errors.sku?.message} {...register("sku")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-ink dark:text-cream">Kategoriya</label>
                <select
                  className="rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-brand-400"
                  {...register("category")}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-error">{errors.category.message}</p>
                )}
              </div>
              <Input label="Tur (masalan: futbolka)" error={errors.type?.message} {...register("type")} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink dark:text-cream">
                Maqsadli auditoriya
              </label>
              <select
                className="rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-brand-400"
                {...register("targetAudience")}
              >
                {TARGET_AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Age range */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink dark:text-cream">Yosh oralig'i</label>
              <div className="flex items-center gap-2 flex-wrap">
                {AGE_RANGES.map((range) => {
                  const current = watch("ageRange");
                  const isSelected =
                    current?.min === range.min &&
                    current?.max === range.max &&
                    current?.unit === range.unit;
                  return (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() =>
                        setValue("ageRange", {
                          min: range.min,
                          max: range.max,
                          unit: range.unit,
                        })
                      }
                      className={cn(
                        "px-3 py-1 rounded-btn text-xs font-medium border-2 transition-colors",
                        isSelected
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600"
                          : "border-cream-dark dark:border-ink-light/30 text-ink-light hover:border-brand-300"
                      )}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sizes */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-ink dark:text-cream">O'lchamlar</h2>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const isSelected = selectedSizes?.includes(size as never);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "w-14 h-9 rounded-btn text-xs font-medium border-2 transition-colors",
                      isSelected
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600"
                        : "border-cream-dark dark:border-ink-light/30 text-ink-light hover:border-brand-300"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {errors.sizes && <p className="text-xs text-error">{errors.sizes.message}</p>}
          </section>

          {/* Colors */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-ink dark:text-cream">Ranglar</h2>
            {colorFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-3">
                <Input
                  {...(index === 0 ? { label: "Rang nomi" } : {})}
                  placeholder="masalan: Qizil"
                  error={errors.colors?.[index]?.name?.message}
                  {...register(`colors.${index}.name`)}
                  className="flex-1"
                />
                <div className="flex flex-col gap-1">
                  {index === 0 && (
                    <label className="text-sm font-medium text-ink dark:text-cream">HEX</label>
                  )}
                  <input
                    type="color"
                    {...register(`colors.${index}.hex`)}
                    className="h-10 w-14 rounded-btn border border-cream-dark cursor-pointer"
                  />
                </div>
                {colorFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="mb-0.5 text-error text-sm hover:underline"
                  >
                    O'chirish
                  </button>
                )}
              </div>
            ))}
            {errors.colors && (
              <p className="text-xs text-error">{errors.colors.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendColor({ name: "", hex: "#000000" })}
              className="w-fit"
            >
              + Rang qo'shish
            </Button>
          </section>

          {/* Pricing & stock */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-ink dark:text-cream">Narx va ombor</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Controller
                control={control}
                name="price"
                render={({ field }) => (
                  <Input
                    label="Narx (so'm)"
                    type="number"
                    error={errors.price?.message}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <Controller
                control={control}
                name="discountPrice"
                render={({ field }) => (
                  <Input
                    label="Chegirma narxi"
                    type="number"
                    placeholder="ixtiyoriy"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? null : Number(e.target.value))
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="stock"
                render={({ field }) => (
                  <Input
                    label="Qoldiq (dona)"
                    type="number"
                    error={errors.stock?.message}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <Controller
                control={control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <Input
                    label="Kam qolish chegarasi"
                    type="number"
                    error={errors.lowStockThreshold?.message}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </div>
          </section>

          {/* Description */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-ink dark:text-cream">Tavsif</h2>
            <textarea
              rows={5}
              placeholder="Mahsulot haqida batafsil ma'lumot..."
              className="w-full rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-3 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-error">{errors.description.message}</p>
            )}
          </section>

          {/* Images */}
          <section className="rounded-card border border-cream-dark dark:border-ink-light/20 p-5 flex flex-col gap-4">
            <h2 className="font-semibold text-ink dark:text-cream">
              Rasmlar ({imageUrls.length + pendingFiles.length}/10)
            </h2>
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url, i) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`rasm-${i}`}
                    className="w-20 h-24 object-cover rounded-btn bg-cream"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              {previewUrls.map((url, i) => (
                <div key={`pending-${i}`} className="relative group">
                  <img
                    src={url}
                    alt={`yangi-rasm-${i}`}
                    className="w-20 h-24 object-cover rounded-btn bg-cream opacity-70"
                  />
                  <span className="absolute bottom-1 left-0 right-0 text-center text-white text-xs bg-ink/50">
                    Yangi
                  </span>
                  <button
                    type="button"
                    onClick={() => removePendingFile(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              {imageUrls.length + pendingFiles.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-24 rounded-btn border-2 border-dashed border-cream-dark dark:border-ink-light/30 flex items-center justify-center text-ink-light hover:border-brand-400 hover:text-brand-400 transition-colors text-2xl"
                >
                  +
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
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

          {/* Active toggle + submit */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsActive((v) => !v)}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                  isActive ? "bg-brand-500" : "bg-ink-light/30"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                    isActive ? "translate-x-6" : "translate-x-0.5"
                  )}
                />
              </div>
              <span className="text-sm font-medium text-ink dark:text-cream">
                {isActive ? "Faol (ko'rinadigan)" : "Nofaol (yashirin)"}
              </span>
            </label>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(PATHS.ADMIN_PRODUCTS)}
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
