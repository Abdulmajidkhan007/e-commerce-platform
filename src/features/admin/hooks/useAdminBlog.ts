import { useState, useEffect } from "react";
import { subscribeAdminBlog } from "../adminService";
import type { BlogPostDoc } from "@/types";

export function useAdminBlog() {
  const [posts, setPosts] = useState<BlogPostDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAdminBlog(
      (data) => {
        setPosts(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { posts, loading };
}
