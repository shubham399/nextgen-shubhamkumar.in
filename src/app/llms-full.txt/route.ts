import { NextResponse } from "next/server";
import {
  getMe,
  getExperience,
  getSkills,
  getServices,
  getTestimonials,
  getCertificates,
} from "@/lib/api";
import { wisp } from "@/lib/wisp";

export const dynamic = "force-dynamic";

export async function GET() {
  const [
    me,
    experience,
    skills,
    services,
    testimonials,
    certificates,
    blogResult,
  ] = await Promise.all([
    getMe(),
    getExperience(),
    getSkills(),
    getServices(),
    getTestimonials(),
    getCertificates(),
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
    `# ${me.name} - Full Portfolio`,
    "",
    "## About",
    me.about,
    "",
    `Location: ${me.location}`,
    `Website: ${me.personalWebsiteUrl}`,
    "",
    "## Experience",
    "",
    ...experience
      .filter((e) => !e.skip)
      .flatMap((e) => [
        `### ${e.title} at ${e.company}`,
        `Period: ${e.start} – ${e.end ?? "Present"}`,
        `Location: ${e.location}`,
        `Badges: ${e.badges.join(", ")}`,
        "",
        ...e.description.map((d) => `- ${d}`),
        "",
      ]),
    "## Skills",
    "",
    ...Object.entries(skillsByCategory).flatMap(([cat, items]) => [
      `### ${cat}`,
      ...items.map((s) => `- ${s}`),
      "",
    ]),
    "## Services",
    "",
    ...services.flatMap((s) => [
      `### ${s.title}`,
      s.description,
      "",
    ]),
    "## Testimonials",
    "",
    ...testimonials.map(
      (t) => `- **${t.name}**: "${t.text}"`,
    ),
    "",
    "## Certificates",
    "",
    ...certificates.map(
      (c) => `- **${c.title}** by ${c.issuer} (${c.issuedAt})`,
    ),
    "",
    "## Blog Posts",
    "",
    ...blogResult.posts.flatMap((p) => [
      `### ${p.title}`,
      `URL: https://www.shubhkumar.in/blogs/${p.slug}`,
      `Published: ${p.publishedAt || "unknown"}`,
      `Tags: ${p.tags.map((t) => t.name).join(", ") || "none"}`,
      p.description || "",
      "",
    ]),
  ];

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
