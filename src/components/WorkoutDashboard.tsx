import type { Workout, WorkoutSummary } from "@/types";
import AnimateOnScroll from "./AnimateOnScroll";
import { Icon } from "@iconify/react";

interface WorkoutDashboardProps {
  workouts: Workout[];
  summary: WorkoutSummary;
}

function getMonthGrid(calendar: Record<string, boolean>, workouts: Workout[]) {
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

  const dateTypeMap = new Map<string, string>();
  for (const w of workouts) {
    if (w.createdAt && !dateTypeMap.has(w.createdAt)) dateTypeMap.set(w.createdAt, w.type);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = (new Date(year, month - 1, 1).getDay() + 6) % 7;

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const cells: { day: number; type: string | null; skipped: boolean }[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push({ day: 0, type: null, skipped: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const hasWorkout = !!calendar[dateStr];
    cells.push({
      day: d,
      type: hasWorkout ? (dateTypeMap.get(dateStr) ?? "gym") : null,
      skipped: !hasWorkout && dateStr < todayStr,
    });
  }
  return { year, month, cells };
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_HEADERS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const TYPE_COLORS: Record<string, string> = {
  gym: "#a5e7ff",
  cardio: "#73daca",
  calisthenics: "#bb9af7",
  rest: "#6fd4ee",
};

function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] ?? TYPE_COLORS.gym;
}

export default function WorkoutDashboard({ workouts, summary }: WorkoutDashboardProps) {
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
          <p className="text-primary font-label text-xs font-semibold tracking-widest uppercase">
            Open Dashboard
          </p>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface mb-2">
          Workout Tracker
        </h1>
        <p className="font-body text-sm text-on-surface-variant/70">
          tracks my workout sessions, health & fitness
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnimateOnScroll>
          <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 inner-glow h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-headline font-semibold text-sm tracking-tight text-on-surface">
                {MONTH_NAMES[month - 1]} {year}
              </h3>
              {!isCurrentMonth && (
                <span className="badge text-[10px]">Previous month</span>
              )}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAY_HEADERS.map((d) => (
                <div key={d} className="font-label text-[10px] font-semibold text-on-surface-variant/30 text-center uppercase pb-2">
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

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/10">
              <span className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider">Legend</span>
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-label text-[10px] text-on-surface-variant/50 capitalize">{type}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f87171" }} />
                <span className="font-label text-[10px] text-on-surface-variant/50 capitalize">skipped</span>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 gap-3 h-full">
          {allStats.map((stat) => (
            <AnimateOnScroll key={stat.label} delay={0.03}>
              <div className="bg-surface-container-low rounded-2xl p-5 inner-glow h-full flex flex-col justify-center">
                <p className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider mb-1.5">
                  {stat.label}
                </p>
                <p className="font-headline font-bold text-xl sm:text-2xl tracking-tight text-on-surface mb-0.5">
                  {stat.value}
                </p>
                <p className="font-label text-xs text-on-surface-variant/40">
                  {stat.sub}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
