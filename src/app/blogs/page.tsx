import { wisp } from "@/lib/wisp";
import { getMe, getSocials, getNav } from "@/lib/api";
import { Icon } from "@iconify/react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import BlogListClient from "@/components/BlogListClient";

export const revalidate = 3600;

export default async function BlogListing() {
  const [me, socials, nav, result] = await Promise.all([
    getMe(), getSocials(), getNav(), wisp.getPosts({ page: 1, limit: 6 }),
  ]);

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
            />
          )}
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>
      </main>
      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
