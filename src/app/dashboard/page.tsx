import type { Metadata } from "next";
import { getWorkouts, getWorkoutSummary, getMe, getSocials, getNav, getBlogViewsSummary } from "@/lib/api";
import { wisp, GetPostsResult } from "@/lib/wisp";
import { Resend } from "resend";
import WorkoutDashboard from "@/components/sections/WorkoutDashboard";
import SocialMetrics from "@/components/sections/SocialMetrics";
import BlogViews from "@/components/sections/BlogViews";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard — Shubham Kumar",
    description: "Personal dashboard with blog analytics, workout tracking, and social metrics.",
    robots: { index: false, follow: false },
  };
}

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

export default async function Dashboard() {
  let allPosts: GetPostsResult = { posts: [], pagination: { page: 1, limit: 100, totalPages: 0, totalPosts: 0, nextPage: null, prevPage: null } };
  try {
    allPosts = await wisp.getPosts({ limit: 100 });
  } catch {}

  const [workouts, summary, me, socials, nav, github, twitterFollowers, subscribers, blogViews] = await Promise.all([
    getWorkouts().catch(() => []),
    getWorkoutSummary().catch(() => null),
    getMe().catch(() => null),
    getSocials().catch(() => []),
    getNav().catch(() => null),
    getGitHubStats(),
    getTwitterFollowers(),
    getSubscriberCount(),
    getBlogViewsSummary().catch(() => ({ total: 0, daily: {} })),
  ]);

  return (
    <>
      {me && nav && socials && <Navigation me={me} nav={nav} socials={socials} />}
      <main>
        <WorkoutDashboard workouts={workouts} summary={summary} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>
        <BlogViews />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>
        <SocialMetrics
          socials={socials ?? []}
          blogCount={allPosts.pagination.totalPosts}
          totalViews={blogViews.total}
          github={github}
          twitterFollowers={twitterFollowers}
          subscribers={subscribers}
        />
      </main>
      {me && nav && socials && <Footer socials={socials} nav={nav} me={me} />}
    </>
  );
}
