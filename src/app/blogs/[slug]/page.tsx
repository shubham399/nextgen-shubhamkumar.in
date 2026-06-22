import { wisp, GetCtasResult } from "@/lib/wisp";
import { getMe, getSocials, getNav } from "@/lib/api";
import { generateTableOfContents } from "@wisp-cms/table-of-content";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimateOnScroll, { StaggerContainer, StaggerItem } from "@/components/AnimateOnScroll";
import CommentSection from "@/components/CommentSection";
import BlogCtaSection from "@/components/BlogCtaSection";
import BlogToc from "@/components/BlogToc";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [me, socials, nav, result, related, commentsResult, ctasResult] = await Promise.all([
    getMe(), getSocials(), getNav(), wisp.getPost(slug), wisp.getRelatedPosts({ slug, limit: 3 }), wisp.getComments({ slug, page: 1, limit: "all" }), wisp.getCtas({ slug, limit: 1 })
  ]);
  function getReadTime(html: string) {
    const text = html.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).length;

    return Math.max(1, Math.round(words / 200));
  }
  const post = result.post;
  const relatedPosts = related.posts;
  if (!post) return null;

  const { title, publishedAt, createdAt, content, tags } = post;
  function removeSynscribeAttribution(html: string) {
    return html.replace(
      /<p[^>]*>\s*<small>\s*<a[^>]*>Powered by Synscribe<\/a>\s*<\/small>\s*<\/p>/gi,
      ""
    ).replace(/—/g, '-');
  }
  const cleanedContent = removeSynscribeAttribution(content);
  const { modifiedHtml, tableOfContents } = generateTableOfContents(cleanedContent);
  return (
    <>
      <Navigation me={me} nav={nav} socials={socials} />
      <main>
        <article className="section-base pt-36">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-body text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
          >
            <Icon icon="ion:arrow-back" width={14} />
            Back to Thoughts & Insights
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-label text-xs text-on-surface-variant/60">
                {Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
                  new Date(publishedAt || createdAt)
                )}
              </span>
              <span className="font-label text-xs text-on-surface-variant/60">•</span>
              <span className="font-label text-xs text-on-surface-variant/60">
                About {getReadTime(content)} min read
              </span>
              {tags.length > 0 && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-outline-variant/40" />
                  {tags.map((tag) => (
                    <span key={tag.id} className="badge text-[10px] px-2 py-0.5">
                      #{tag.name}
                    </span>
                  ))}
                </>
              )}
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-on-surface leading-[1.1]">
              {title.replace(/—/g, '-')}
            </h1>
          </header>

          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div
              className="blog-content max-w-none lg:col-span-3"
              dangerouslySetInnerHTML={{ __html: modifiedHtml }}
            />
            <aside className="hidden lg:block">
              <BlogToc items={tableOfContents} />
            </aside>
          </div>
        </article>

        <BlogCtaSection cta={ctasResult.ctas[0] || null} />

        <section className="section-base">
          <AnimateOnScroll>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface mb-8">
              Related Thoughts
            </h2>
          </AnimateOnScroll>
          {relatedPosts.length === 0 ? (
            <AnimateOnScroll>
              <div className="text-center py-20">
                <Icon icon="ion:document-text-outline" width={48} className="mx-auto text-on-surface-variant/40 mb-4" />
                <p className="font-body text-on-surface-variant">No related posts found.</p>
              </div>
            </AnimateOnScroll>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((post) => (
                <StaggerItem key={post.id}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="group flex flex-col bg-surface-container-low rounded-2xl overflow-hidden inner-glow hover:bg-surface-container hover:shadow-glow transition-all duration-300 h-full"
                  >
                    <div className="relative w-full aspect-video overflow-hidden bg-surface-container">
                      {post.image ? (
                        <Image
                          alt={post.title}
                          src={post.image}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon icon="ion:document-text-outline" width={40} className="text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-5 flex flex-col gap-3">
                      <span className="font-label text-[11px] text-on-surface-variant/60">
                        {Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                          new Date(post.publishedAt || post.createdAt)
                        )}
                      </span>
                      <h3 className="font-headline font-bold text-base tracking-tighter text-on-surface group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-2">
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

        <CommentSection slug={slug} initialData={commentsResult} />
      </main>
      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
