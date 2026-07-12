import { NextRequest } from "next/server";
import {
  getMe,
  getSocials,
  getContacts,
  getNav,
  getExperience,
  getSkills,
  getServices,
  getTestimonials,
  getCertificates,
  getWorkouts,
  getWorkoutSummary,
} from "@/lib/api";
import { wisp } from "@/lib/wisp";

// ─── ANSI ────────────────────────────────────────────────

const C = {
  r: "\x1b[0m", b: "\x1b[1m", d: "\x1b[2m", i: "\x1b[3m",
  cyan: "\x1b[36m", grn: "\x1b[32m", yel: "\x1b[33m", mag: "\x1b[35m",
  blu: "\x1b[34m", wht: "\x1b[37m",
  bCyan: "\x1b[96m", bGrn: "\x1b[92m", bYel: "\x1b[93m", bMag: "\x1b[95m",
};

const W = 64;
const hr = (ch = "\u2500", n = W) => ch.repeat(n);

function hdr(text: string) {
  const p = W - text.length - 4;
  return `\n${C.cyan}\u250c${hr()}\u2510${C.r}\n${C.cyan}\u2502${C.r}  ${C.b}${C.bCyan}${text}${C.r}${" ".repeat(Math.max(0, p - 2))}${C.cyan}\u2502${C.r}\n${C.cyan}\u2514${hr()}\u2518${C.r}`;
}

function sub(text: string) {
  const p = W - text.length - 2;
  return `${C.cyan}\u251c${hr("\u2500", W - 2)}\u2524${C.r}\n${C.cyan}\u2502${C.r} ${C.b}${text}${C.r}${" ".repeat(Math.max(0, p))}${C.cyan}\u2502${C.r}\n${C.cyan}\u2514${hr("\u2500", W - 2)}\u2518${C.r}`;
}

function wrap(pfx: string, text: string, max = W) {
  const w = text.split(" "); const L: string[] = []; let l = pfx;
  for (const x of w) { if (l.length + x.length + 1 > max) { L.push(l); l = pfx + x + " "; } else l += x + " "; }
  if (l.trim()) L.push(l); return L;
}

function sep() { return `${C.d}${hr("\u2500")}${C.r}`; }

function banner() {
  return [
    "",
    `${C.b}${C.bCyan} ____  _  _  ____ _____ _     ___ _   _  ____  ${C.r}`,
    `${C.b}${C.bCyan}/ ___|| || |/ ___|_   _| |   |_ _| \\ | |/ ___| ${C.r}`,
    `${C.b}${C.bCyan}\\___ \\| __ }\\___ \\ | | | |    | ||  \\| | |  _  ${C.r}`,
    `${C.b}${C.bCyan}____) | |_| |___) || | | |___| || |\\  | |_| | ${C.r}`,
    `${C.b}${C.bCyan}|____/ \\___/|____/ |_| |_|____|___|_| \\_|\\____| ${C.r}`,
    "",
  ].join("\n");
}

function footer(me: any, nav: any) {
  return [sep(), `  ${C.d}${me.cta.btn}: ${me.cal}${C.r}`, nav.resume ? `  ${C.d}Resume: ${nav.resume}${C.r}` : "", sep(), ""].join("\n");
}

function blogNav() {
  return [
    `${C.d}  /blogs        Blog listing${C.r}`,
    `${C.d}  /blogs/<slug> Read a post${C.r}`,
    `${C.d}  /dashboard    Analytics${C.r}`,
    `${C.d}  /health       Workouts${C.r}`,
  ].join("\n");
}

// ─── Builders ────────────────────────────────────────────

async function tuiHome() {
  const [me, socials, contacts, nav, experience, skills, services, testimonials, certificates] =
    await Promise.all([getMe(), getSocials(), getContacts(), getNav(), getExperience(), getSkills(), getServices(), getTestimonials(), getCertificates()]);
  const L: string[] = [banner(), `  ${C.d}${me.location}${C.r}`, ""];
  L.push(hdr("ABOUT"), "", `  ${C.b}${C.wht}${me.name}${C.r}`, "", ...wrap("  ", me.summary), "", ...wrap("  ", me.about), "");
  L.push(hdr("EXPERIENCE"), "");
  for (const e of experience.filter((x) => !x.skip)) {
    L.push(`  ${C.b}${C.bCyan}${e.title}${C.r}`, `  ${C.grn}${e.company}${C.r} ${C.d}| ${e.start} \u2013 ${e.end ?? "Present"}${C.r}`, `  ${C.d}${e.location}${C.r}`);
    for (const d of e.description) L.push(`  ${C.wht}\u2022 ${d}${C.r}`);
    L.push("");
  }
  L.push(hdr("SKILLS"), "");
  const by: Record<string, string[]> = {}; for (const s of skills) (by[s.category] ??= []).push(s.skill);
  for (const [c, items] of Object.entries(by)) { L.push(`  ${C.b}${C.bYel}${c}${C.r}`, `  ${C.d}${items.join(" \u2022 ")}${C.r}`, ""); }
  L.push(hdr("SERVICES"), "");
  for (const s of services) L.push(`  ${C.b}${C.bMag}${s.title}${C.r}`, `  ${C.wht}${s.description}${C.r}`, "");
  L.push(hdr("TESTIMONIALS"), "");
  for (const t of testimonials) {
    L.push(`  ${C.b}${C.bGrn}${t.name}${C.r} ${C.d}(${t.destination})${C.r}`, `  ${C.d}${t.date}${C.r}`);
    L.push(...wrap('  \u201c', t.text, 56).map(l => `${C.wht}${l}${C.r}`));
    if (t.link) L.push(`  ${C.blu}${t.link}${C.r}`);
    L.push("");
  }
  L.push(hdr("CERTIFICATES"), "");
  for (const c of certificates) { L.push(`  ${C.b}${C.bCyan}${c.title}${C.r}`, `  ${C.grn}${c.issuer}${C.r} ${C.d}| ${c.issuedAt}${C.r}`); if (c.link) L.push(`  ${C.blu}${c.link}${C.r}`); L.push(""); }
  L.push(hdr("CONTACT"), "");
  for (const c of contacts) L.push(`  ${C.b}${C.bCyan}${c.title}${C.r} ${C.wht}${c.text}${C.r}`);
  L.push("", hdr("SOCIALS"), "");
  for (const s of socials) L.push(`  ${C.grn}${s.name}${C.r} ${C.d}${s.username ?? ""}${C.r}`, `  ${C.blu}${s.href}${C.r}`);
  L.push("", blogNav(), "", footer(me, nav));
  return L.join("\n");
}

async function tuiBlogList() {
  const [me, nav, posts] = await Promise.all([getMe(), getNav(), wisp.getPosts({ limit: 100 })]);
  const L: string[] = [banner(), hdr("BLOG"), "", `${C.i}${C.d}Tales from the trenches of backend engineering,${C.r}`, `${C.i}${C.d}system design, and building at scale.${C.r}`, ""];
  if (!posts.posts?.length) L.push(`  ${C.d}No posts yet.${C.r}`);
  else for (const p of posts.posts) {
    const d = p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
    L.push(`  ${C.b}${C.bCyan}${p.title}${C.r}`, `  ${C.d}${d}${C.r}`);
    if (p.description) L.push(...wrap("  ", p.description, 56));
    L.push(`  ${C.blu}/blogs/${p.slug}${C.r}`, "");
  }
  L.push(sep(), `  ${C.d}Total: ${posts.pagination?.totalPosts ?? 0} posts${C.r}`, sep(), "", footer(me, nav));
  return L.join("\n");
}

async function tuiBlogPost(slug: string) {
  const [me, nav, res] = await Promise.all([getMe(), getNav(), wisp.getPost(slug)]);
  const post = res.post; if (!post) return `Post not found: ${slug}`;
  const txt = (post.content ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wc = txt.split(/\s+/).length, rm = Math.max(1, Math.round(wc / 200));
  const d = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  const L: string[] = [banner(), `  ${C.d}/blogs/${slug}${C.r}`, "", hdr(post.title.replace(/\u2014/g, "-")), "", `  ${C.d}${d}  \u2022  ${rm} min read  \u2022  ${wc} words${C.r}`];
  if (post.tags?.length) L.push(`  ${C.d}Tags: ${post.tags.map((t) => t.name).join(", ")}${C.r}`);
  L.push("", sep(), "", ...wrap("  ", txt, 56), "", sep(), "", blogNav(), "", footer(me, nav));
  return L.join("\n");
}

async function tuiDashboard() {
  const [me, nav, posts, gh] = await Promise.all([
    getMe(), getNav(), wisp.getPosts({ limit: 100 }),
    fetch("https://api.github.com/users/shubham399", { next: { revalidate: 3600 } } as any).then(r => r.ok ? r.json() : null).catch(() => null),
  ]);
  let workouts: any[] = [], summary: any = null;
  try { [workouts, summary] = await Promise.all([getWorkouts(), getWorkoutSummary()]); } catch {}
  const L: string[] = [banner(), hdr("DASHBOARD"), ""];
  L.push(sub("SOCIAL"), "", `  ${C.b}${C.bGrn}Blog Posts${C.r}    ${posts.pagination?.totalPosts ?? 0}`, `  ${C.b}${C.bGrn}GitHub${C.r}        ${gh?.followers ?? "?"} followers \u2022 ${gh?.public_repos ?? "?"} repos`, `  ${C.b}${C.bGrn}Twitter${C.r}       @shubhkumar01`, "");
  if (summary) {
    L.push(sub("WORKOUTS"), "", `  ${C.b}${C.bYel}Total Workouts${C.r}   ${summary.totalWorkouts}`, `  ${C.b}${C.bYel}Total Duration${C.r}   ${Math.round(summary.totalDurationMinutes / 60)}h ${summary.totalDurationMinutes % 60}m`, `  ${C.b}${C.bYel}Total Volume${C.r}     ${summary.totalVolumeKg} kg`, `  ${C.b}${C.bYel}Streak${C.r}           ${summary.streakWeeks} weeks`, `  ${C.b}${C.bYel}Last Workout${C.r}     ${summary.lastWorkout?.daysAgo ?? "?"} days ago (${summary.lastWorkout?.type ?? ""})`, "");
    if (workouts.length) { L.push(`  ${C.d}Recent:${C.r}`); for (const w of workouts.slice(0, 10)) { const dd = new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }); L.push(`    ${C.wht}\u2022 ${dd} ${C.bCyan}${w.workout}${C.r} ${C.d}${w.durationMinutes}m${C.r}`); } L.push(""); }
  }
  L.push(hdr("BLOG VIEWS"), "");
  if (posts.posts?.length) for (const p of posts.posts) L.push(`  ${C.wht}\u2022 ${p.title}${C.r}`);
  L.push("", sep(), `  ${C.d}Resume: ${nav.resume}${C.r}`, sep(), "");
  return L.join("\n");
}

async function tuiHealth() {
  const [me, workouts, summary] = await Promise.all([getMe(), getWorkouts().catch(() => []), getWorkoutSummary().catch(() => null)]);
  const L: string[] = [banner(), hdr("HEALTH"), ""];
  if (!summary) L.push(`  ${C.d}No workout data available.${C.r}`);
  else {
    L.push(sub("SUMMARY"), "", `  ${C.b}${C.bGrn}Total Workouts${C.r}     ${summary.totalWorkouts}`, `  ${C.b}${C.bGrn}Total Duration${C.r}     ${Math.round(summary.totalDurationMinutes / 60)}h ${summary.totalDurationMinutes % 60}m`, `  ${C.b}${C.bGrn}Total Volume${C.r}       ${summary.totalVolumeKg} kg`, `  ${C.b}${C.bGrn}Total Sets${C.r}         ${summary.totalSets}`, `  ${C.b}${C.bGrn}Streak${C.r}             ${summary.streakWeeks} weeks`, `  ${C.b}${C.bGrn}Preferred Time${C.r}     ${summary.preferredTimeOfDay}`, `  ${C.b}${C.bGrn}Last Workout${C.r}       ${summary.lastWorkout?.daysAgo ?? "?"} days ago (${summary.lastWorkout?.type ?? ""})`, `  ${C.b}${C.bGrn}Active Days${C.r}        ${Object.values(summary.calendar ?? {}).filter(Boolean).length}%`, "");
    if (workouts.length) { L.push(sub("RECENT SESSIONS"), ""); for (const w of workouts.slice(0, 20)) { const d = new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }); L.push(`  ${C.wht}${d}  ${C.bCyan}${w.workout}${C.r}  ${C.d}${w.type} \u2022 ${w.durationMinutes}m${C.r}`); } L.push(""); }
  }
  L.push(sep(), "");
  return L.join("\n");
}

async function tuiConsulting() {
  const me = await getMe();
  const L: string[] = [banner(), hdr("CONSULTING"), ""];
  L.push(`  ${C.wht}Ship faster with expert engineering guidance.${C.r}`, "");
  L.push(`  ${C.b}${C.bCyan}Book a call:${C.r} ${me.cal}`, "");
  L.push(sub("SERVICES"), "");
  for (const s of ["System Architecture & Design", "Code Reviews & Quality", "Performance Optimization", "Cloud Infrastructure & DevOps", "Growth & Product Engineering", "Technical Strategy & Advisory"])
    L.push(`  ${C.wht}\u2022 ${s}${C.r}`);
  L.push("");
  L.push(sub("PRICING"), "");
  L.push(`  ${C.b}${C.bYel}Short Term${C.r}    $30/hr`);
  L.push(`  ${C.b}${C.bYel}Discounted${C.r}    $25/hr (repeat clients)`);
  L.push(`  ${C.b}${C.bYel}Enterprise${C.r}    Let's discuss`, "");
  L.push(`  ${C.d}1st hour free for all tiers${C.r}`, "");
  L.push(sep(), `  ${C.d}Resume: ${me.cal}${C.r}`, sep(), "");
  return L.join("\n");
}

// ─── Route ───────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = slug ? "/" + slug.join("/") : "/";

  let body: string;
  try {
    if (path === "/") body = await tuiHome();
    else if (path === "/blogs") body = await tuiBlogList();
    else if (path.startsWith("/blogs/")) body = await tuiBlogPost(path.split("/blogs/")[1]);
    else if (path === "/dashboard") body = await tuiDashboard();
    else if (path === "/health") body = await tuiHealth();
    else if (path === "/consulting") body = await tuiConsulting();
    else body = `Unknown route: ${path}`;
  } catch (e: any) {
    body = `Error: ${e.message}`;
  }

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
