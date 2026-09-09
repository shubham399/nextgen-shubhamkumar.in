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


async function fetchAllCommits(
  login: string,
  token: string,
  windowStart: string,
): Promise<GhSearchItem[]> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const sinceISO = `${windowStart}T00:00:00Z`;

  const repos: { full_name: string; updated_at: string }[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&type=owner&sort=pushed&direction=desc`,
      { headers },
    );
    if (!res.ok) break;
    const data = await res.json();
    for (const r of data) {
      if (r.updated_at >= windowStart) repos.push({ full_name: r.full_name, updated_at: r.updated_at });
    }
    if (data.length < 100) break;
  }

  const items: GhSearchItem[] = [];
  const batchSize = 10;
  for (let i = 0; i < repos.length; i += batchSize) {
    const batch = repos.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (repo) => {
        const res = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?author=${login}&since=${sinceISO}&per_page=100`,
          { headers },
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data
          .map((c: any) => c.commit?.author?.date)
          .filter(Boolean)
          .map((date: string) => ({ created_at: date }));
      }),
    );
    for (const r of results) items.push(...r);
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
