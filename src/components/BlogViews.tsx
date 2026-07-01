import { fetchAPI } from "@/lib/api";
import AnimateOnScroll from "./AnimateOnScroll";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface BlogViewsProps {
  slugs: string[];
  blogTitles: Record<string, string>;
}

export default async function BlogViews({ slugs, blogTitles }: BlogViewsProps) {
  let viewsData: { slug: string; total: number; daily: number }[] = [];
  try {
    viewsData = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const data = await fetchAPI<{ total: number; daily: number }>(
            `/api/blog/views/${slug}?readonly=true`
          );
          return { slug, total: data.total, daily: data.daily };
        } catch {
          return { slug, total: 0, daily: 0 };
        }
      })
    );
  } catch {}
  const todayViews = viewsData.reduce((sum, v) => sum + v.daily, 0);
  const totalViews = viewsData.reduce((sum, v) => sum + v.total, 0);
  const sorted = [...viewsData].sort((a, b) => b.total - a.total).slice(0, 5);

  if (!viewsData.length) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <AnimateOnScroll>
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="ion:eye-outline" width={16} className="text-primary" />
          <p className="text-primary font-label text-xs font-semibold tracking-widest uppercase">
            Realtime Blog Views
          </p>
        </div>
        <p className="font-body text-sm text-on-surface-variant/70 mb-6">
          views today
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <AnimateOnScroll className="md:col-span-2">
          <div className="bg-surface-container-low rounded-2xl p-6 inner-glow h-full flex flex-col justify-center text-center">
            <p className="font-headline font-bold text-5xl sm:text-6xl tracking-tighter gradient-text mb-1">
              {todayViews.toLocaleString()}
            </p>
            <p className="font-label text-xs text-on-surface-variant/50 uppercase tracking-wider">
              views today
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll className="md:col-span-3" delay={0.05}>
          <div className="bg-surface-container-low rounded-2xl p-5 inner-glow">
            <h3 className="font-headline font-semibold text-sm tracking-tight text-on-surface mb-4 flex items-center gap-2">
              <Icon icon="ion:heart-outline" width={14} className="text-primary" />
              Most Popular Blogs
            </h3>
            <div className="space-y-2">
              {sorted.map((blog, i) => {
                const maxTotal = sorted[0].total || 1;
                const barWidth = (blog.total / maxTotal) * 100;
                return (
                  <Link
                    key={blog.slug}
                    href={`/blogs/${blog.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-3 py-1.5">
                      <span className="font-label text-xs text-on-surface-variant/40 w-4 text-right flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-label text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                            {blogTitles[blog.slug] || blog.slug}
                          </p>
                          <span className="font-label text-xs text-on-surface-variant/50 flex-shrink-0 ml-2 tabular-nums">
                            {blog.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/blogs"
              className="mt-4 inline-flex items-center gap-1 font-label text-xs text-primary/70 hover:text-primary transition-colors"
            >
              All Posts <Icon icon="ion:arrow-forward" width={12} />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
