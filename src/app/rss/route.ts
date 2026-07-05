import { NextRequest, NextResponse } from "next/server";
import RSS from "rss";
import { wisp } from "@/lib/wisp";
import { getMe } from "@/lib/api";
import { removeSynscribeAttribution } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const [me, result] = await Promise.all([
    getMe(),
    wisp.getPosts({ limit: 10 }),
  ]);

  const baseUrl = new URL(request.url).origin;

  const postsWithContent = (await Promise.allSettled(
    result.posts.map((post) => wisp.getPost(post.slug))
  )).filter((r) => r.status === "fulfilled").map((r) => r.value);

  const feed = new RSS({
    title: `${me.name} - Blog`,
    description: "Tales from the trenches of backend engineering, system design, and building at scale.",
    site_url: baseUrl,
    feed_url: `${baseUrl}/rss`,
    language: "en",
    pubDate: new Date(),
  });

  postsWithContent.forEach(({ post }) => {
    if (!post) return;
    const cleaned = removeSynscribeAttribution(post.content);
    const fullHtml = `${cleaned}<hr /><p><a href="${baseUrl}/blogs/${post.slug}">You can also read it on shubhkumar.in</a></p>`;
    feed.item({
      title: post.title,
      description: fullHtml,
      url: `${baseUrl}/blogs/${post.slug}`,
      date: post.publishedAt || post.updatedAt,
      categories: post.tags.map((t) => t.name),
    });
  });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
