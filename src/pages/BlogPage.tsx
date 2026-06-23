import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Seo } from "@/components/seo/Seo";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/feedback/Spinner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useBlogPosts } from "@/features/blog/hooks/useBlogPosts";
import { useBlogPost } from "@/features/blog/hooks/useBlogPost";
import { PATHS } from "@/routes/paths";

/* ── Karta komponenti ─────────────────────────────── */
function PostCard({ post }: { post: import("@/types").BlogPostDoc }) {
  const { t } = useTranslation("blog");
  const date = post.publishedAt
    ? dayjs(post.publishedAt.toDate()).format("DD.MM.YYYY")
    : "";

  return (
    <Link
      to={PATHS.BLOG_POST(post.slug)}
      className="group flex flex-col rounded-card border border-cream-dark dark:border-ink-light/20 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative overflow-hidden bg-cream aspect-video">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-ink-light/30">
            📝
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4 flex-1">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <h2 className="font-semibold text-ink dark:text-cream line-clamp-2 group-hover:text-brand-600 transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-ink-light line-clamp-2 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-ink-light mt-1">
          <span>{t("by", { name: post.authorName })}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Blog ro'yxat sahifasi ───────────────────────── */
function BlogListPage() {
  const { t } = useTranslation("blog");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | undefined>();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { posts, loading, loadingMore, hasMore, loadMore } = useBlogPosts({
    tag: activeTag,
    search: debouncedSearch,
  });

  function handleSearch(val: string) {
    setSearch(val);
    clearTimeout((handleSearch as unknown as { _t: ReturnType<typeof setTimeout> })._t);
    const t = setTimeout(() => setDebouncedSearch(val), 400);
    (handleSearch as unknown as { _t: ReturnType<typeof setTimeout> })._t = t;
  }

  const allTags = [...new Set(posts.flatMap((p) => p.tags))].slice(0, 12);

  return (
    <>
      <Seo title={t("title")} description={t("subtitle")} />
      <Container className="py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-ink dark:text-cream mb-2">{t("title")}</h1>
          <p className="text-ink-light">{t("subtitle")}</p>
        </div>

        {/* Search + tag filter */}
        <div className="flex flex-col gap-4 mb-8">
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("search")}
            className="w-full max-w-md mx-auto block rounded-btn border border-cream-dark dark:border-ink-light/40 bg-white dark:bg-ink px-4 py-2 text-sm text-ink dark:text-cream placeholder:text-ink-light/60 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />

          {allTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTag(undefined)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  !activeTag
                    ? "bg-brand-500 text-white"
                    : "border border-cream-dark dark:border-ink-light/30 text-ink-light hover:border-brand-300"
                }`}
              >
                {t("allPosts")}
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? undefined : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeTag === tag
                      ? "bg-brand-500 text-white"
                      : "border border-cream-dark dark:border-ink-light/30 text-ink-light hover:border-brand-300"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title={t("empty")}
            description={t("emptyDesc")}
            icon={<span className="text-4xl">📝</span>}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  isLoading={loadingMore}
                >
                  {t("loadMore")}
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}

/* ── Maqola detail sahifasi ──────────────────────── */
function BlogPostPage({ slug }: { slug: string }) {
  const { t } = useTranslation("blog");
  const { post, related, loading, notFound } = useBlogPost(slug);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <Container className="py-20">
        <EmptyState
          title={t("notFound")}
          description={t("notFoundDesc")}
          icon={<span className="text-4xl">📭</span>}
          action={
            <Link to={PATHS.BLOG}>
              <Button variant="outline">{t("backToBlog")}</Button>
            </Link>
          }
        />
      </Container>
    );
  }

  const date = post.publishedAt
    ? dayjs(post.publishedAt.toDate()).format("DD MMMM YYYY")
    : "";

  return (
    <>
      <Seo
        title={post.seo.title || post.title}
        description={post.seo.description || post.excerpt}
      />
      <Container className="py-10 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink-light flex items-center gap-2 mb-6">
          <Link to={PATHS.BLOG} className="hover:text-brand-600">
            {t("title")}
          </Link>
          <span>→</span>
          <span className="text-ink dark:text-cream line-clamp-1">{post.title}</span>
        </nav>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`${PATHS.BLOG}?tag=${tag}`}
                className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 text-xs font-medium hover:bg-brand-100 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold text-ink dark:text-cream mb-3 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-ink-light mb-6">
          <span>{t("by", { name: post.authorName })}</span>
          <span>·</span>
          <span>{t("publishedAt", { date })}</span>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="rounded-card overflow-hidden mb-8 aspect-video bg-cream">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-sm max-w-none text-ink dark:text-cream
            prose-headings:text-ink dark:prose-headings:text-cream
            prose-a:text-brand-600 prose-strong:text-ink dark:prose-strong:text-cream
            prose-p:leading-relaxed whitespace-pre-wrap"
        >
          {post.content}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-cream-dark dark:border-ink-light/20">
            <h2 className="text-xl font-bold text-ink dark:text-cream mb-5">{t("related")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to={PATHS.BLOG}>
            <Button variant="outline" size="sm">
              ← {t("backToBlog")}
            </Button>
          </Link>
        </div>
      </Container>
    </>
  );
}

/* ── Asosiy eksport: ro'yxat yoki detail ─────────── */
export default function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <BlogPostPage slug={slug} /> : <BlogListPage />;
}
