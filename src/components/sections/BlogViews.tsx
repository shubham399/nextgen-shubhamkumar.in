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
          <p className="text-primary font-label text-xs font-semibold tracking-widest uppercase">
            Realtime Blog Views
          </p>
        </div>
        <p className="font-body text-sm text-on-surface-variant/70 mb-6">
          views today
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <AnimateOnScroll className="md:col-span-2">
          <div className="bg-surface-container-low rounded-2xl p-6 inner-glow h-full flex flex-col justify-center text-center">
            <p className="font-headline font-bold text-5xl sm:text-6xl tracking-tighter gradient-text mb-1">
              {todayViews.toLocaleString()}
            </p>
            <p className="font-label text-xs text-on-surface-variant/50 uppercase tracking-wider">
              views today
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll className="md:col-span-3" delay={0.05}>
          <div className="bg-surface-container-low rounded-2xl p-5 inner-glow h-full flex flex-col">
            <h3 className="font-headline font-semibold text-sm tracking-tight text-on-surface mb-2 flex items-center gap-2">
              <Icon icon="ion:bar-chart-outline" width={14} className="text-primary" />
              Views (Last 7 Days)
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
