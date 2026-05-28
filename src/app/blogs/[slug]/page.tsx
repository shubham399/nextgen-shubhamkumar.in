import { wisp } from "@/lib/wisp";
import { getMe, getSocials, getNav } from "@/lib/api";
import Link from "next/link";
import { Icon } from "@iconify/react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [me, socials, nav, result] = await Promise.all([
    getMe(), getSocials(), getNav(), wisp.getPost(slug),
  ]);

  const post = result.post;
  if (!post) return null;

  const { title, publishedAt, createdAt, content, tags } = post;
  function removeSynscribeAttribution(html: string) {
    return html.replace(
      /<p[^>]*>\s*<small>\s*<a[^>]*>Powered by Synscribe<\/a>\s*<\/small>\s*<\/p>/gi,
      ""
    );
  }
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
            Back to blog
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-label text-xs text-on-surface-variant/60">
                {Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
                  new Date(publishedAt || createdAt)
                )}
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
              {title}
            </h1>
          </header>

          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-10" />

          <div
            className="blog-content mx-auto max-w-none"
            dangerouslySetInnerHTML={{ __html: removeSynscribeAttribution(content) }}
          />
        </article>
      </main>
      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
