import { fetchAPI, getWorkouts, getWorkoutSummary, getMe, getSocials, getNav } from "@/lib/api";
import { wisp, GetPostsResult } from "@/lib/wisp";
import { Resend } from "resend";
import WorkoutDashboard from "@/components/sections/WorkoutDashboard";
import SocialMetrics from "@/components/sections/SocialMetrics";
import BlogViews from "@/components/sections/BlogViews";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";

async function getGitHubStats() {
  try {
    const res = await fetch("https://api.github.com/users/shubham399", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { followers: data.followers as number, publicRepos: data.public_repos as number };
  } catch {
    return null;
  }
}

async function getTwitterFollowers(): Promise<number> {
  try {
    const res = await fetch("https://api.vxtwitter.com/shubhkumar01", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.followers_count ?? 0;
  } catch {
    return 0;
  }
}

async function getSubscriberCount(): Promise<number> {
  try {
    const key = process.env.RESEND_KEY;
    if (!key) return 0;
    const resend = new Resend(key);
    const segmentId = process.env.RESEND_SEGMENT_ID;
    const { data, error } = await resend.contacts.list({
      ...(segmentId ? { segmentId } : {}),
      limit: 100,
    });
    if (error || !data) return 0;
    return data.data.length;
  } catch {
    return 0;
  }
}

async function getTotalBlogViews(slugs: string[]): Promise<number> {
  try {
    const results = await Promise.all(
      slugs.map((slug) =>
        fetchAPI<{ total: number }>(`/api/blog/views/${slug}?readonly=true`).catch(() => ({ total: 0 }))
      )
    );
    return results.reduce((sum, r) => sum + (r.total || 0), 0);
  } catch {
    return 0;
  }
}

export default async function Dashboard() {
  let allPosts: GetPostsResult = { posts: [], pagination: { page: 1, limit: 100, totalPages: 0, totalPosts: 0, nextPage: null, prevPage: null } };
  try {
    allPosts = await wisp.getPosts({ limit: 100 });
  } catch {}

  const [workouts, summary, me, socials, nav, github, twitterFollowers, subscribers] = await Promise.all([
    getWorkouts(),
    getWorkoutSummary(),
    getMe(),
    getSocials(),
    getNav(),
    getGitHubStats(),
    getTwitterFollowers(),
    getSubscriberCount(),
  ]);

  const slugs = allPosts.posts.filter((p) => p.slug).map((p) => p.slug);
  const totalViews = slugs.length > 0 ? await getTotalBlogViews(slugs) : 0;

  const blogTitles: Record<string, string> = {};
  for (const p of allPosts.posts) {
    if (p.slug) blogTitles[p.slug] = p.title;
  }

  return (
    <>
      <Navigation me={me} nav={nav} socials={socials} />
      <main>
        <WorkoutDashboard workouts={workouts} summary={summary} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>
        <BlogViews slugs={slugs} blogTitles={blogTitles} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>
        <SocialMetrics
          socials={socials}
          blogCount={allPosts.pagination.totalPosts}
          totalViews={totalViews}
          github={github}
          twitterFollowers={twitterFollowers}
          subscribers={subscribers}
        />
      </main>
      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
