import { wisp, GetPostsResult } from "@/lib/wisp";
import { getMe, getSocials, getNav } from "@/lib/api";
import { Icon } from "@iconify/react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import BlogListClient from "@/components/BlogListClient";
import BlogCtaSection from "@/components/BlogCtaSection";

export const revalidate = 3600;

export default async function BlogListing() {
  const [me, socials, nav] = await Promise.all([
    getMe(), getSocials(), getNav(),
  ]);

  let result = { posts: [], pagination: { page: 1, limit: 6, totalPages: 0, totalPosts: 0, nextPage: null, prevPage: null } } as GetPostsResult;
  let publishedTags: { id: string; name: string; description: string | null }[] = [];
  try {
    result = await wisp.getPosts({ page: 1, limit: 6 });
    const allPublished = await wisp.getPosts({ limit: "all" });
    const tagMap = new Map<string, { id: string; name: string; description: string | null }>();
    for (const post of allPublished.posts) {
      for (const tag of post.tags) {
        if (!tagMap.has(tag.id)) tagMap.set(tag.id, { id: tag.id, name: tag.name, description: null });
      }
    }
    publishedTags = Array.from(tagMap.values());
  } catch {}

  return (
    <>
      <Navigation me={me} nav={nav} socials={socials} />
      <main>
        <section className="section-base pt-36">
          <SectionHeader
            label="Blog"
            title="Thoughts & Insights"
            description="Tales from the trenches of backend engineering, system design, and building at scale."
          />

          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-14" />

          {result.posts.length === 0 ? (
            <AnimateOnScroll>
              <div className="text-center py-20">
                <Icon icon="ion:document-text-outline" width={48} className="mx-auto text-on-surface-variant/40 mb-4" />
                <p className="font-body text-on-surface-variant">No posts yet. Check back soon.</p>
              </div>
            </AnimateOnScroll>
          ) : (
            <BlogListClient
              initialPosts={result.posts}
              initialPagination={result.pagination}
              allTags={publishedTags}
            />
          )}
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        <BlogCtaSection />
      </main>
      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
