import { useState, useEffect } from "react";
import { getBlogPostBySlug, getRelatedPosts } from "../blogService";
import type { BlogPostDoc } from "@/types";

export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPostDoc | null>(null);
  const [related, setRelated] = useState<BlogPostDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    getBlogPostBySlug(slug)
      .then(async (data) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        setPost(data);
        const rel = await getRelatedPosts(data.tags, data.id);
        setRelated(rel);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, related, loading, notFound };
}
