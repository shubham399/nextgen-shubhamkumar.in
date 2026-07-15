import type { MetadataRoute } from "next";
import { wisp } from "@/lib/wisp";

const BASE_URL = "https://www.shubhkumar.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const { posts } = await wisp.getPosts({ limit: "all" });
    blogPosts = posts.map((post) => ({
      url: `${BASE_URL}/blogs/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt ?? post.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {}

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/health`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    },
    {
      url: `${BASE_URL}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...blogPosts,
  ];
}
