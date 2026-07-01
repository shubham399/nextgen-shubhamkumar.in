import type { Workout, WorkoutSummary } from "@/types";
import AnimateOnScroll from "./AnimateOnScroll";

interface WorkoutDashboardProps {
  workouts: Workout[];
  summary: WorkoutSummary;
}

function getMonthGrid(calendar: Record<string, boolean>, workouts: Workout[]) {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  const calKeys = Object.keys(calendar);
  if (!calKeys.length) return { year, month, cells: [] as { day: number; type: string | null }[] };

  const currentPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const hasCurrentMonthData = calKeys.some(k => k.startsWith(currentPrefix));

  if (!hasCurrentMonthData && workouts.length > 0) {
    const lastDate = workouts.reduce((a, b) => a.createdAt > b.createdAt ? a : b).createdAt;
    const daysSince = Math.floor((now.getTime() - new Date(lastDate).getTime()) / 86400000);
    if (daysSince <= 7) {
      const d = new Date(lastDate);
      year = d.getFullYear();
      month = d.getMonth() + 1;
    }
  }

  const dateTypeMap = new Map<string, string>();
  for (const w of workouts) {
    if (!dateTypeMap.has(w.createdAt)) dateTypeMap.set(w.createdAt, w.type);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const cells: { day: number; type: string | null }[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push({ day: 0, type: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, type: calendar[dateStr] ? (dateTypeMap.get(dateStr) ?? "gym") : null });
  }
  return { year, month, cells };
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_HEADERS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function WorkoutDashboard({ workouts, summary }: WorkoutDashboardProps) {
  const { year, month, cells } = getMonthGrid(summary.calendar, workouts);
  const totalHrs = Math.floor(summary.totalDurationMinutes / 60);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <AnimateOnScroll className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-primary font-label text-xs font-semibold tracking-widest uppercase">
            Open Dashboard
          </p>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface mb-1">
            Workout Tracker
          </h1>
          <p className="font-body text-sm text-on-surface-variant/70">
            tracks my workout sessions, health &amp; fitness
          </p>
        </div>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <AnimateOnScroll className="md:col-span-3">
          <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 inner-glow">
            <h3 className="font-headline font-semibold text-xs tracking-tight text-on-surface/60 mb-4 uppercase">
              {MONTH_NAMES[month - 1]} {year}
            </h3>

            <div className="grid grid-cols-7 gap-1">
              {DAY_HEADERS.map((d) => (
                <div key={d} className="font-label text-[10px] font-semibold text-on-surface-variant/30 text-center uppercase pb-1.5">
                  {d}
                </div>
              ))}
              {cells.map((cell, i) => (
                <div key={i} className="aspect-square flex items-center justify-center">
                  {cell.day > 0 && (
                    <span
                      className={`flex items-center justify-center w-7 h-7 text-xs font-label transition-all duration-200 ${
                        cell.type
                          ? "bg-primary text-on-primary font-semibold rounded-full"
                          : "text-on-surface-variant/20"
                      }`}
                    >
                      {cell.day}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          {[
            { label: "Last worked out", value: summary.lastWorkout.daysAgo === 0 ? "Today" : `${summary.lastWorkout.daysAgo} days ago`, sub: `at ${summary.lastWorkout.type}` },
            { label: "Gym visit", value: `${summary.percentDays}%`, sub: "of days" },
            { label: "Total workouts", value: summary.totalWorkouts.toString(), sub: "this month" },
            { label: "Workout streak", value: `${summary.streakWeeks} weeks`, sub: "consistent" },
            { label: "Total trained", value: `${totalHrs}h ${summary.totalDurationMinutes % 60}m`, sub: "this month" },
            { label: "Prefers", value: summary.preferredTimeOfDay, sub: "workout" },
            ...(summary.totalSets > 0 ? [{ label: "Sets" as const, value: summary.totalSets.toString(), sub: "this month" as const }] : []),
            ...(summary.totalVolumeKg > 0 ? [{ label: "Volume" as const, value: `${summary.totalVolumeKg}kg`, sub: "this month" as const }] : []),
          ].map((stat) => (
            <AnimateOnScroll key={stat.label} delay={0.03}>
              <div className="bg-surface-container-low rounded-2xl p-5 inner-glow h-full flex flex-col justify-center">
                <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="font-headline font-bold text-xl sm:text-2xl tracking-tight text-on-surface mb-0.5">{stat.value}</p>
                <p className="font-label text-xs text-on-surface-variant/40">{stat.sub}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
