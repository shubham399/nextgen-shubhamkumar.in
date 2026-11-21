"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { StaggerContainer, StaggerItem } from "../ui/AnimateOnScroll";
import type { GetPostsResult, GetTagsResult } from "@/lib/wisp";

interface BlogListClientProps {
  initialPosts: GetPostsResult["posts"];
  initialPagination: GetPostsResult["pagination"];
  allTags: GetTagsResult["tags"];
  initialLoadFailed: boolean;
}

export default function BlogListClient({ initialPosts, initialPagination, allTags, initialLoadFailed }: BlogListClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filtersReady, setFiltersReady] = useState(false);
  const [error, setError] = useState(initialLoadFailed ? "Posts could not be loaded. Try again." : "");
  const [retryCount, setRetryCount] = useState(0);
  const loadingRef = useRef(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isFirstRender = useRef(true);
  const requestRef = useRef(0);

  useEffect(() => {
    const restoreFilters = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("query") ?? "");
      const tag = params.get("tag");
      setSelectedTags(tag ? [tag] : []);
    };
    restoreFilters();
    setFiltersReady(true);
    window.addEventListener("popstate", restoreFilters);
    return () => window.removeEventListener("popstate", restoreFilters);
  }, []);

  const updateUrl = (query: string, tags: string[]) => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("query", query.trim());
    else url.searchParams.delete("query");
    if (tags[0]) url.searchParams.set("tag", tags[0]);
    else url.searchParams.delete("tag");
    window.history.replaceState(window.history.state, "", url);
  };

  const buildFilterParams = useCallback((page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "6");
    if (searchQuery.trim()) params.set("query", searchQuery.trim());
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
    if (!filtersReady) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!window.location.search) return;
    }
    const request = ++requestRef.current;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setInitialLoading(true);
      setError("");
      setPosts([]);
      fetchPosts(1).then((data) => {
        if (request !== requestRef.current) return;
        setPosts(data.posts);
        setPagination(data.pagination);
      }).catch(() => {
        if (request === requestRef.current) setError("Posts could not be loaded. Try again.");
      }).finally(() => {
        if (request === requestRef.current) setInitialLoading(false);
      });
    }, 300);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [searchQuery, selectedTags, fetchPosts, filtersReady, retryCount]);

  const loadMore = async () => {
    if (!pagination.nextPage || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError("");
    const request = requestRef.current;
    try {
      const data = await fetchPosts(pagination.nextPage);
      if (request !== requestRef.current) return;
      setPosts((prev) => [...prev, ...data.posts]);
      setPagination(data.pagination);
    } catch {
      if (request === requestRef.current) setError("More posts could not be loaded. Try again.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag) ? [] : [tag];
    setSelectedTags(next);
    updateUrl(searchQuery, next);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    updateUrl("", []);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  return (
    <>
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Icon
            icon="ion:search"
            width={16}
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-subtle"
          />
          <label htmlFor="blog-search" className="sr-only">
            Search posts
          </label>
          <input
            id="blog-search"
            name="query"
            type="search"
            autoComplete="off"
            placeholder="Search posts…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateUrl(e.target.value, selectedTags);
            }}
            className="form-control min-h-11 rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); updateUrl("", selectedTags); }}
              className="absolute right-2 top-1/2 inline-flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-surface-container hover:text-on-surface"
              aria-label="Clear post search"
            >
              <Icon icon="ion:close" width={16} aria-hidden="true" />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <details className="group rounded-xl bg-surface-container-low px-4 py-2">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-label text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 break-words">{selectedTags[0] ? `Topic: #${selectedTags[0]}` : "Filter by topic"}</span>
              <Icon icon="ion:chevron-down" width={16} aria-hidden="true" className="shrink-0 transition-transform duration-150 group-open:rotate-180" />
            </summary>
            <div className="flex flex-wrap gap-2 pb-2 pt-3">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  aria-pressed={selectedTags.includes(tag.name)}
                  onClick={() => toggleTag(tag.name)}
                  className={`min-h-11 rounded-lg px-3 py-2 font-label text-xs transition-colors ${
                    selectedTags.includes(tag.name)
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-container text-content-muted hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </details>
        )}
      </div>

      {initialLoading ? (
        <div className="flex justify-center py-20" role="status" aria-live="polite">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading posts…</span>
        </div>
      ) : error && posts.length === 0 ? (
        <div className="py-20 text-center" role="alert">
          <p className="font-body text-sm text-error">{error}</p>
          <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="btn-ghost mt-4">Try again</button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <Icon icon="ion:document-text-outline" width={48} className="mx-auto text-content-subtle mb-4" aria-hidden="true" />
          <p className="font-body text-content-muted">
            {hasActiveFilters ? "No posts match your filters." : "No posts yet. Check back soon."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 min-h-11 rounded-lg px-3 font-label text-sm text-primary transition-colors hover:bg-primary/10"
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
                  className="group flex flex-col overflow-hidden rounded-2xl bg-surface-container-low transition-colors duration-300 hover:bg-surface-container sm:flex-row"
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
                      <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                        <Icon icon="ion:document-text-outline" width={40} className="text-primary/40" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label text-xs text-content-muted">
                        {Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                          new Date(post.publishedAt || post.updatedAt)
                        )}
                      </span>
                      {post.tags.length > 0 && (
                        <>
                          <span className="w-0.5 h-0.5 rounded-full bg-outline-variant/40" />
                          {post.tags.map((tag, i) => (
                            <span key={tag.id} className="break-words font-label text-xs text-primary/70">
                              #{tag.name}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                    <h2 className="break-words font-headline text-lg font-bold leading-snug tracking-tight text-on-surface transition-colors group-hover:text-primary group-focus-visible:text-primary">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="font-body text-sm text-content-muted leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-primary text-xs font-headline font-semibold mt-auto pt-1">
                      Read more
                      <Icon icon="ion:arrow-forward" width={12} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {pagination.nextPage && (
            <div className="flex justify-center py-8">
              <button type="button" onClick={() => void loadMore()} disabled={loading} className="btn-ghost">
                {loading ? "Loading…" : "Load more posts"}
              </button>
            </div>
          )}

          {!pagination.nextPage && posts.length > 0 && (
            <p className="text-center font-body text-sm text-content-muted py-8">
              You&apos;ve reached the end
            </p>
          )}
        </>
      )}
      {error && posts.length > 0 && <p role="alert" className="py-4 text-center font-body text-sm text-error">{error}</p>}
    </>
  );
}
