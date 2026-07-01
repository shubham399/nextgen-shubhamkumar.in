import { getWorkouts, getWorkoutSummary, getMe, getSocials, getNav, BASE_URL } from "@/lib/api";
import { wisp } from "@/lib/wisp";
import WorkoutDashboard from "@/components/WorkoutDashboard";
import SocialMetrics from "@/components/SocialMetrics";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

async function getTotalBlogViews(slugs: string[]): Promise<number> {
  try {
    const results = await Promise.all(
      slugs.map((slug) =>
        fetch(`${BASE_URL}/api/blog/views/${slug}?readonly=true`, {
          headers: { Accept: "application/json" },
          next: { revalidate: 600 },
        }).then((r) => (r.ok ? r.json() : { total: 0 }))
      )
    );
    return results.reduce((sum: number, r: { total: number }) => sum + (r.total || 0), 0);
  } catch {
    return 0;
  }
}

export default async function Dashboard() {
  const [allPosts, workouts, summary, me, socials, nav, github, twitterFollowers] = await Promise.all([
    wisp.getPosts({ limit: 100 }),
    getWorkouts(),
    getWorkoutSummary(),
    getMe(),
    getSocials(),
    getNav(),
    getGitHubStats(),
    getTwitterFollowers(),
  ]);

  const slugs = allPosts.posts.filter((p) => p.slug).map((p) => p.slug);
  const totalViews = slugs.length > 0 ? await getTotalBlogViews(slugs) : 0;

  return (
    <>
      <Navigation me={me} nav={nav} socials={socials} />
      <main>
        <WorkoutDashboard workouts={workouts} summary={summary} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>
        <SocialMetrics
          socials={socials}
          blogCount={allPosts.pagination.totalPosts}
          totalViews={totalViews}
          github={github}
          twitterFollowers={twitterFollowers}
        />
      </main>
      <Footer socials={socials} nav={nav} me={me} />
    </>
  );
}
