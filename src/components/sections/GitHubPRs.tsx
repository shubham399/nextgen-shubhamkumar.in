import { Icon } from "@iconify/react";
import AnimateOnScroll from "../ui/AnimateOnScroll";
import PRWeeklyChart from "../ui/PRWeeklyChart";
import type { GitHubCommitsData } from "@/lib/github";

interface GitHubPRsProps {
  data: GitHubCommitsData | null;
}

function tile(value: string, label: string, cls?: string) {
  return (
    <div className="bg-surface-container-low rounded-xl p-4 h-full">
      <p className="mb-1 font-label text-xs font-medium text-content-subtle">
        {label}
      </p>
      <p className={`font-headline font-bold text-2xl tracking-tight mb-0.5 ${cls ?? "text-on-surface"}`}>
        {value}
      </p>
    </div>
  );
}

export default function GitHubPRs({ data }: GitHubPRsProps) {
  if (!data || data.error) {
    return null;
  }

  const deltaTxt =
    data.delta === null ? "\u2014" : `${data.delta > 0 ? "+" : ""}${data.delta}%`;
  const deltaCls =
    data.delta === null
      ? "text-on-surface"
      : data.delta > 0
        ? "text-tertiary"
        : data.delta < 0
          ? "text-error"
          : "text-on-surface";

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <AnimateOnScroll>
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="ion:logo-github" width={16} className="text-primary" />
          <h2 className="signal-label">Commit activity</h2>
        </div>
        <p className="font-body text-sm text-content-muted mb-6">
          {data.totalCommits ?? 0} commits in the 13-week window
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <AnimateOnScroll>{tile((data.totalCommits ?? 0).toLocaleString(), "Total commits")}</AnimateOnScroll>
        <AnimateOnScroll delay={0.02}>
          {tile(data.activeDays.toString(), "Active days, 13 weeks")}
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.04}>
          {tile(data.last30.toString(), "Commits, last 30 days")}
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.06}>{tile(deltaTxt, "Last 7 vs previous 7 days", deltaCls)}</AnimateOnScroll>
      </div>

      <AnimateOnScroll delay={0.08}>
        <div className="bg-surface-container-low rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline font-semibold text-sm tracking-tight text-on-surface flex items-center gap-2">
              <Icon icon="ion:bar-chart-outline" width={14} className="text-primary" />
              Commits per week
            </h3>
            <div className="flex gap-3 text-xs text-content-muted">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-sm bg-tertiary" />
                full 7 days
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-sm bg-secondary" />
                current, partial
              </span>
            </div>
          </div>
          <PRWeeklyChart buckets={data.buckets} />
          <p className="mt-2 font-label text-xs text-content-subtle">{data.partialNote}</p>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
