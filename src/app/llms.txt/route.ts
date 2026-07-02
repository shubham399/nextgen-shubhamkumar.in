import { NextResponse } from "next/server";
import { getMe, getExperience, getSkills, getServices } from "@/lib/api";
import { wisp } from "@/lib/wisp";

export const dynamic = "force-dynamic";

export async function GET() {
  const [me, experience, skills, services, blogResult] = await Promise.all([
    getMe(),
    getExperience(),
    getSkills(),
    getServices(),
    wisp.getPosts({ limit: 100 }),
  ]);

  const skillsByCategory = skills.reduce(
    (acc, s) => {
      (acc[s.category] ??= []).push(s.skill);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const lines = [
    `# ${me.name}`,
    `> ${me.summary}`,
    "",
    "## About",
    me.about,
    "",
    "## Sections",
    `- [Home](https://www.shubhkumar.in): Portfolio landing page with hero, about, experience, skills, services, testimonials, certificates, and contact`,
    `- [Blog](https://www.shubhkumar.in/blogs): Technical articles on backend engineering, system design, and building at scale`,
    `- [Dashboard](https://www.shubhkumar.in/dashboard): Workout tracker, social metrics, and blog analytics`,
    `- [Health](https://www.shubhkumar.in/health): Workout session tracker with calendar, streaks, and stats`,
    `- [Consulting](https://www.shubhkumar.in/consulting): Booking page for consulting sessions`,
    "",
    "## Experience",
    ...experience
      .filter((e) => !e.skip)
      .map((e) => `- **${e.title}** at ${e.company} (${e.start}–${e.end ?? "Present"}): ${e.description.join(" ")}`),
    "",
    "## Skills",
    ...Object.entries(skillsByCategory).map(
      ([cat, items]) => `- **${cat}**: ${items.join(", ")}`,
    ),
    "",
    "## Services",
    ...services.map((s) => `- **${s.title}**: ${s.description}`),
    "",
    "## Blog Posts",
    ...blogResult.posts.map(
      (p) => `- [${p.title}](https://www.shubhkumar.in/blogs/${p.slug}): ${p.description || ""}`,
    ),
  ];

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
