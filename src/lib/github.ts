const BUCKETS = 13;
const DAY = 86_400_000;

export interface Bucket {
  start: number;
  end: number;
  days: number;
  full: boolean;
  count: number;
  label: string;
}

export interface GitHubCommitsData {
  login: string;
  totalCommits: number;
  activeDays: number;
  last30: number;
  last7: number;
  prev7: number;
  delta: number | null;
  buckets: Bucket[];
  partialNote: string;
  error?: string;
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function utcDay(d: Date) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtLabel(ts: number) {
  const d = new Date(ts);
  return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function buildBuckets(now: Date): Bucket[] {
  const today = utcDay(now);
  const dow = (new Date(today).getUTCDay() + 6) % 7;
  const thisMonday = today - dow * DAY;
  const out: Bucket[] = [];
  for (let i = BUCKETS - 1; i >= 0; i--) {
    const start = thisMonday - i * DAY * 7;
    const full = i > 0;
    out.push({
      start,
      end: full ? start + 7 * DAY : today + DAY,
      days: full ? 7 : dow + 1,
      full,
      count: 0,
      label: fmtLabel(start),
    });
  }
  return out;
}

interface GhSearchItem {
  created_at: string;
}

async function ghSearch(
  query: string,
  token: string,
  page: number,
): Promise<{ items: GhSearchItem[]; total_count: number }> {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100&page=${page}&sort=created&order=desc`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let msg = `${res.status} ${res.statusText}`;
    try {
      const j = JSON.parse(body);
      if (j.message) msg += ` — ${j.message}`;
    } catch {}
    if (res.status === 401) msg += " (bad or expired token)";
    if (res.status === 403 && /rate limit/i.test(body))
      msg = "Search rate limit hit. Retry later.";
    throw new Error(msg);
  }
  return res.json();
}

async function fetchAllCommits(
  login: string,
  token: string,
  windowStart: string,
): Promise<GhSearchItem[]> {
  const query = `author:${login} is:commit created:>=${windowStart}`;
  const items: GhSearchItem[] = [];
  for (let page = 1; page <= 10; page++) {
    const { items: pageItems, total_count } = await ghSearch(query, token, page);
    items.push(...pageItems);
    if (items.length >= total_count || pageItems.length < 100) break;
  }
  return items;
}

export async function getGitHubCommits(): Promise<GitHubCommitsData | null> {
  const token = process.env.GITHUB_PAT;
  if (!token) return { error: "GITHUB_PAT not configured" } as GitHubCommitsData;

  try {
    const now = new Date();
    const bs = buildBuckets(now);
    const windowStart = iso(new Date(bs[0].start));

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!userRes.ok) return { error: "Failed to authenticate with GitHub" } as GitHubCommitsData;
    const user = await userRes.json();
    const login: string = user.login;

    const items = await fetchAllCommits(login, token, windowStart);

    const days = new Set<string>();
    let last30 = 0;
    let last7 = 0;
    let prev7 = 0;
    const todayEnd = utcDay(now) + DAY;

    for (const it of items) {
      const t = Date.parse(it.created_at);
      const b = bs.find((x) => t >= x.start && t < x.end);
      if (b) b.count++;
      days.add(iso(new Date(t)));
      if (t >= todayEnd - 30 * DAY) last30++;
      if (t >= todayEnd - 7 * DAY) last7++;
      else if (t >= todayEnd - 14 * DAY) prev7++;
    }

    const delta =
      prev7 === 0 ? (last7 ? null : 0) : Math.round(((last7 - prev7) / prev7) * 100);

    const partial = bs[bs.length - 1];

    return {
      login,
      totalCommits: items.length,
      activeDays: days.size,
      last30,
      last7,
      prev7,
      delta,
      buckets: bs.map((b) => ({
        label: b.label,
        count: b.count,
        full: b.full,
        days: b.days,
        start: b.start,
        end: b.end,
      })),
      partialNote: `* The ${partial.label} bucket ends on ${fmtLabel(partial.end - DAY)}, so it covers ${partial.days} day${partial.days === 1 ? "" : "s"}.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { error: msg } as GitHubCommitsData;
  }
}
