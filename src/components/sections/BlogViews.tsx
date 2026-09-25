import { getBlogViewsSummary } from "@/lib/api";
import AnimateOnScroll from "../ui/AnimateOnScroll";
import { Icon } from "@iconify/react";
import DailyViewsChart from "../ui/DailyViewsChart";

export default async function BlogViews() {
  let total = 0;
  let daily: Record<string, number> = {};
  try {
    const summary = await getBlogViewsSummary();
    total = summary.total;
    daily = summary.daily;
  } catch {}

  const today = new Date().toISOString().slice(0, 10);
  const todayViews = daily[today] ?? 0;

  const days = Object.keys(daily)
    .sort()
    .slice(-7)
    .map((date) => ({ date, views: daily[date] }));

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <AnimateOnScroll>
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="ion:eye-outline" width={16} className="text-primary" />
          <h2 className="signal-label">Realtime blog views</h2>
        </div>
        <p className="mb-6 font-body text-sm text-content-muted">
           Views today
         </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <AnimateOnScroll className="md:col-span-2">
          <div className="surface-card flex h-full flex-col justify-center p-6 text-center">
             <p className="mb-1 font-headline text-5xl font-bold tracking-tighter text-primary sm:text-6xl">
              {todayViews.toLocaleString()}
            </p>
            <p className="font-label text-xs text-content-muted">
              views today
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll className="md:col-span-3" delay={0.05}>
          <div className="surface-card flex h-full flex-col p-5">
            <h3 className="font-headline font-semibold text-sm tracking-tight text-on-surface mb-2 flex items-center gap-2">
              <Icon icon="ion:bar-chart-outline" width={14} className="text-primary" />
              Views, last 7 days
            </h3>
            <div className="flex-1 min-h-0">
              <DailyViewsChart days={days} />
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
