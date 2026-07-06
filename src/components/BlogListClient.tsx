"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { StaggerContainer, StaggerItem } from "./AnimateOnScroll";
import type { GetPostsResult, GetTagsResult } from "@/lib/wisp";

interface BlogListClientProps {
  initialPosts: GetPostsResult["posts"];
  initialPagination: GetPostsResult["pagination"];
  allTags: GetTagsResult["tags"];
}

export default function BlogListClient({ initialPosts, initialPagination, allTags }: BlogListClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isFirstRender = useRef(true);

  const buildFilterParams = useCallback((page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "6");
    if (searchQuery) params.set("query", searchQuery);
    if (selectedTags.length === 1) params.set("tag", selectedTags[0]);
    return params;
  }, [searchQuery, selectedTags]);

  const fetchPosts = useCallback(async (page: number) => {
    const params = buildFilterParams(page);
    const res = await fetch(`/api/wisp/posts?${params}`);
    if (!res.ok) throw new Error("fetch failed");
    return res.json() as Promise<GetPostsResult>;
  }, [buildFilterParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setInitialLoading(true);
      setPosts([]);
      fetchPosts(1).then((data) => {
        setPosts(data.posts);
        setPagination(data.pagination);
      }).catch(() => {}).finally(() => setInitialLoading(false));
    }, 300);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery, selectedTags, fetchPosts]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && pagination.nextPage && !loadingRef.current) {
          loadingRef.current = true;
          setLoading(true);

          fetchPosts(pagination.nextPage)
            .then((data) => {
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
  }, [pagination.nextPage, pagination.limit, fetchPosts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? [] : [tag]
    );
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  return (
    <>
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Icon
            icon="ion:search"
            width={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
          />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl border-none outline-none font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
            >
              <Icon icon="ion:close" width={16} />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.name)}
                className={`font-label text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  selectedTags.includes(tag.name)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant/60 hover:border-outline-variant/40 hover:text-on-surface-variant"
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {initialLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <Icon icon="ion:document-text-outline" width={48} className="mx-auto text-on-surface-variant/40 mb-4" />
          <p className="font-body text-on-surface-variant">
            {hasActiveFilters ? "No posts match your filters." : "No posts yet. Check back soon."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => { setSearchQuery(""); setSelectedTags([]); }}
              className="mt-4 font-label text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
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
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
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
      )}
    </>
  );
}
