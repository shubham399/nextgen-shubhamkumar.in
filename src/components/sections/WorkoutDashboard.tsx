import type { Workout, WorkoutSummary } from "@/types";
import AnimateOnScroll from "../ui/AnimateOnScroll";
import { Icon } from "@iconify/react";

interface WorkoutDashboardProps {
  workouts: Workout[];
  summary: WorkoutSummary | null;
}

function getMonthGrid(calendar: Record<string, string>, workouts: Workout[]) {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  const calKeys = Object.keys(calendar);
  if (!calKeys.length) return { year, month, cells: [] as { day: number; type: string | null; skipped: boolean }[] };

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

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = (new Date(year, month - 1, 1).getDay() + 6) % 7;

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const cells: { day: number; type: string | null; skipped: boolean }[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push({ day: 0, type: null, skipped: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const calValue = calendar[dateStr];
    cells.push({
      day: d,
      type: calValue ?? null,
      skipped: !calValue && dateStr < todayStr,
    });
  }
  return { year, month, cells };
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_HEADERS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const TYPE_COLORS: Record<string, string> = {
  gym: "#c4eef2",
  cardio: "#b8d6a3",
  calisthenics: "#f1b35c",
  rest: "#70d5df",
};

function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] ?? TYPE_COLORS.gym;
}

export default function WorkoutDashboard({ workouts, summary }: WorkoutDashboardProps) {
  if (!summary) return null;
  const { year, month, cells } = getMonthGrid(summary.calendar, workouts);
  const monthWorkouts = workouts.filter(w => {
    if (!w.createdAt) return false;
    const d = new Date(w.createdAt);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
  const monthDuration = monthWorkouts.reduce((s, w) => s + (w.durationMinutes ?? 0), 0);
  const monthHrs = Math.floor(monthDuration / 60);

  const allStats = [
    { label: "Workouts", value: monthWorkouts.length.toString(), sub: "this month" },
    { label: "Gym visit", value: `${summary.percentDays}%`, sub: "of days" },
    { label: "Streak", value: `${summary.streakWeeks}w`, sub: "consistent" },
    { label: "Trained", value: `${monthHrs}h ${monthDuration % 60}m`, sub: "this month" },
    { label: "Last workout", value: summary.lastWorkout.daysAgo === 0 ? "Today" : `${summary.lastWorkout.daysAgo} days ago`, sub: `at ${summary.lastWorkout.type}` },
    { label: "Preferred time", value: summary.preferredTimeOfDay, sub: "workout" },
    ...(summary.totalSets > 0 ? [{ label: "Sets", value: summary.totalSets.toString(), sub: "total" }] : []),
    ...(summary.totalVolumeKg > 0 ? [{ label: "Volume", value: `${summary.totalVolumeKg}kg`, sub: "total" }] : []),
  ];

  const today = new Date();
  const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear();

  return (
    <section className="section-base pt-24 pb-16 md:pt-32 md:pb-20">
      <AnimateOnScroll className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="ion:fitness-outline" width={16} className="text-primary" />
          <p className="signal-label">Open dashboard</p>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface mb-2">
          Workout tracker
        </h1>
        <p className="font-body text-sm text-content-muted">
          A private record of training sessions, streaks, and health metrics.
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnimateOnScroll>
          <div className="surface-card h-full p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-headline font-semibold text-sm tracking-tight text-on-surface">
                {MONTH_NAMES[month - 1]} {year}
              </h2>
              {!isCurrentMonth && (
                <span className="badge">Previous month</span>
              )}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAY_HEADERS.map((d) => (
                <div key={d} className="pb-2 text-center font-label text-xs font-semibold uppercase text-content-subtle">
                  {d}
                </div>
              ))}
              {cells.map((cell, i) => (
                <div key={i} className="aspect-square flex items-center justify-center">
                  {cell.day > 0 && (
                    <span
                      className="flex items-center justify-center w-7 h-7 text-xs font-label transition-all duration-200 rounded-full"
                      style={{
                        backgroundColor: cell.skipped ? "#f8717120" : cell.type ? `${getTypeColor(cell.type)}20` : "transparent",
                        color: cell.skipped ? "#f87171" : cell.type ? getTypeColor(cell.type) : "#bbc9cf",
                        opacity: cell.skipped || cell.type ? 1 : 0.2,
                      }}
                    >
                      {cell.day}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4">
              <span className="font-label text-xs font-medium text-content-subtle">Legend</span>
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-label text-xs capitalize text-content-subtle">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-2xl bg-divider">
          {allStats.map((stat) => (
            <AnimateOnScroll key={stat.label} delay={0.03}>
              <div className="flex h-full flex-col justify-center bg-surface-container-low p-4">
                <p className="mb-1.5 font-label text-xs font-medium text-content-subtle">
                  {stat.label}
                </p>
                <p className="mb-0.5 font-headline text-xl font-bold tracking-tight text-on-surface sm:text-2xl">
                  {stat.value}
                </p>
                <p className="font-label text-xs text-content-subtle">{stat.sub}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
