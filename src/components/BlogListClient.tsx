"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { StaggerContainer, StaggerItem } from "./AnimateOnScroll";
import type { GetPostsResult } from "@/lib/wisp";

interface BlogListClientProps {
  initialPosts: GetPostsResult["posts"];
  initialPagination: GetPostsResult["pagination"];
}

export default function BlogListClient({ initialPosts, initialPagination }: BlogListClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && pagination.nextPage && !loadingRef.current) {
          loadingRef.current = true;
          setLoading(true);

          fetch(`/api/wisp/posts?page=${pagination.nextPage}&limit=${pagination.limit}`)
            .then((res) => {
              if (!res.ok) throw new Error("fetch failed");
              return res.json();
            })
            .then((data: GetPostsResult) => {
              setPosts((prev) => [...prev, ...data.posts]);
              setPagination(data.pagination);
            })
            .catch(() => {})
            .finally(() => {
              loadingRef.current = false;
              setLoading(false);
            });
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pagination.nextPage, pagination.limit]);

  return (
    <>
      <StaggerContainer className="flex flex-col gap-5 lg:gap-6">
        {posts.map((post) => (
          <StaggerItem key={post.id}>
            <Link
              href={`/blogs/${post.slug}`}
              className="group flex flex-col sm:flex-row bg-surface-container-low rounded-2xl overflow-hidden inner-glow hover:bg-surface-container hover:shadow-glow transition-all duration-300"
            >
              <div className="relative w-full sm:w-56 lg:w-72 aspect-video sm:min-h-full overflow-hidden bg-surface-container flex-shrink-0">
                {post.image ? (
                  <Image
                    alt={post.title}
                    src={post.image}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-gradient-subtle">
                    <Icon icon="ion:document-text-outline" width={40} className="text-primary/40" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-label text-[11px] text-on-surface-variant/60">
                    {Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                      new Date(post.publishedAt || post.updatedAt)
                    )}
                  </span>
                  {post.tags.length > 0 && (
                    <>
                      <span className="w-0.5 h-0.5 rounded-full bg-outline-variant/40" />
                      {post.tags.map((tag, i) => (
                        <span key={tag.id} className="font-label text-[11px] text-primary/70">
                          #{tag.name}
                        </span>
                      ))}
                    </>
                  )}
                </div>
                <h2 className="font-headline font-bold text-lg tracking-tighter text-on-surface group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-primary text-xs font-headline font-semibold mt-auto pt-1">
                  Read more
                  <Icon icon="ion:arrow-forward" width={12} />
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div ref={sentinelRef} className="h-10" />

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!pagination.nextPage && posts.length > 0 && (
        <p className="text-center font-body text-sm text-on-surface-variant/60 py-8">
          You&apos;ve reached the end
        </p>
      )}
    </>
  );
}
