import { wisp } from "@/lib/wisp";
import { getMe, getSocials, getNav } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/AnimateOnScroll";

export const revalidate = 3600;

export default async function BlogListing() {
  const [me, socials, nav, result] = await Promise.all([
    getMe(), getSocials(), getNav(), wisp.getPosts({ limit: 12 }),
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
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {result.posts.map((post) => (
                <StaggerItem key={post.id}>
                  <Link href={`/blogs/${post.slug}`} className="group block surface-card inner-glow overflow-hidden transition-all duration-300 hover:shadow-glow-md">
                    <div className="aspect-[16/9] relative overflow-hidden bg-surface-container">
                      {post.image ? (
                        <Image
                          alt={post.title}
                          src={post.image}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-gradient-subtle">
                          <Icon icon="ion:document-text-outline" width={40} className="text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-label text-[11px] text-on-surface-variant/60">
                          {Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                            new Date(post.publishedAt || post.updatedAt)
                          )}
                        </span>
                        {post.tags.length > 0 && (
                          <>
                            <span className="w-0.5 h-0.5 rounded-full bg-outline-variant/40" />
                            <span className="font-label text-[11px] text-primary/70">
                              #{post.tags[0].name}
                            </span>
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
