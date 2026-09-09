import { Icon } from "@iconify/react";
import AnimateOnScroll from "../ui/AnimateOnScroll";
import PRWeeklyChart from "../ui/PRWeeklyChart";

interface PRBucket {
  label: string;
  count: number;
  full: boolean;
  days: number;
}

interface GitHubPRsData {
  login: string;
  totalPRs: number;
  activeDays: number;
  merged: number;
  open: number;
  last30: number;
  last7: number;
  prev7: number;
  delta: number | null;
  buckets: PRBucket[];
  partialNote: string;
  error?: string;
}

async function getGitHubPRs(): Promise<GitHubPRsData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/github/prs`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function tile(value: string, label: string, cls?: string) {
  return (
    <div className="bg-surface-container-low rounded-xl p-4 inner-glow h-full">
      <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`font-headline font-bold text-2xl tracking-tight mb-0.5 ${cls ?? "text-on-surface"}`}>
        {value}
      </p>
    </div>
  );
}

export default async function GitHubPRs() {
  const data = await getGitHubPRs();

  if (!data || data.error) {
    return null;
  }

  const deltaTxt =
    data.delta === null ? "\u2014" : `${data.delta > 0 ? "+" : ""}${data.delta}%`;
  const deltaCls =
    data.delta === null
      ? "text-on-surface"
      : data.delta > 0
        ? "text-[#33a852]"
        : data.delta < 0
          ? "text-[#f0776c]"
          : "text-on-surface";

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <AnimateOnScroll>
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="ion:logo-github" width={16} className="text-primary" />
          <p className="text-primary font-label text-xs font-semibold tracking-widest uppercase">
            Pull Request Activity
          </p>
        </div>
        <p className="font-body text-sm text-on-surface-variant/70 mb-6">
          {data.merged} merged &middot; {data.open} still open &middot; {data.totalPRs} PRs in
          the 13-week window
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <AnimateOnScroll>{tile(data.totalPRs.toLocaleString(), "Total PRs Authored")}</AnimateOnScroll>
        <AnimateOnScroll delay={0.02}>
          {tile(data.activeDays.toString(), "Active Days (13wk)")}
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.04}>
          {tile(data.last30.toString(), "PRs Last 30 Days")}
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.06}>{tile(deltaTxt, "Last 7d vs Prev 7d", deltaCls)}</AnimateOnScroll>
      </div>

      <AnimateOnScroll delay={0.08}>
        <div className="bg-surface-container-low rounded-2xl p-5 inner-glow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline font-semibold text-sm tracking-tight text-on-surface flex items-center gap-2">
              <Icon icon="ion:bar-chart-outline" width={14} className="text-primary" />
              PRs Opened Per Week
            </h3>
            <div className="flex gap-3 text-xs text-on-surface-variant/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#33a852] inline-block" />
                full 7 days
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#7a72e8] inline-block" />
                current, partial
              </span>
            </div>
          </div>
          <PRWeeklyChart buckets={data.buckets} />
          <p className="text-on-surface-variant/40 font-label text-[11px] mt-2">{data.partialNote}</p>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
