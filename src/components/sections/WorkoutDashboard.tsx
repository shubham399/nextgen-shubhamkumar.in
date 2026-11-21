import type { Workout, WorkoutSummary } from "@/types";
import { themeVar, themeVarAlpha } from "@/lib/theme";
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

// Live role references rather than hexes, so the calendar grid re-themes with
// the rest of the page. Keyed by role name, not by colour string, because each
// cell needs the same role twice: once solid for the label, once washed for the
// background. A role name is the only thing that can carry both.
const TYPE_ROLES: Record<string, string> = {
  gym: "data-1",
  cardio: "data-2",
  calisthenics: "data-4",
  rest: "data-3",
};

function getTypeRole(type: string): string {
  return TYPE_ROLES[type.toLowerCase()] ?? TYPE_ROLES.gym;
}

function getTypeColor(type: string): string {
  return themeVar(getTypeRole(type));
}

export default function WorkoutDashboard({ workouts, summary }: WorkoutDashboardProps) {
  const intro = (
    <AnimateOnScroll className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Icon icon="ion:fitness-outline" width={16} className="text-primary" aria-hidden="true" />
        <p className="signal-label">Open dashboard</p>
      </div>
      <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tighter text-on-surface mb-2">
        Workout tracker
      </h1>
      <p className="font-body text-sm text-content-muted">
        A private record of training sessions, streaks, and health metrics.
      </p>
    </AnimateOnScroll>
  );

  if (!summary) {
    return (
      <section className="section-base pt-24 pb-16 md:pt-32 md:pb-20">
        {intro}
        <p className="surface-card p-6 font-body text-sm text-on-surface-variant">
          Workout data is unavailable right now. Try again later.
        </p>
      </section>
    );
  }
  const { year, month, cells } = getMonthGrid(summary.calendar, workouts);
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) => cells.slice(index * 7, index * 7 + 7));
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
      {intro}

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

            {weeks.length ? (
              <table className="w-full table-fixed border-separate border-spacing-1 tabular-nums">
                <caption className="sr-only">{MONTH_NAMES[month - 1]} {year} workout calendar</caption>
                <thead>
                  <tr>
                    {DAY_HEADERS.map((day) => (
                      <th key={day} scope="col" className="pb-2 text-center font-label text-xs font-semibold uppercase text-content-subtle">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const cell = week[dayIndex];
                        if (!cell?.day) return <td key={dayIndex} />;
                        const status = cell.type ?? (cell.skipped ? "No workout logged" : "No entry");
                        return (
                          <td key={dayIndex} className="py-0.5 text-center">
                            <span
                              className="mx-auto flex h-7 w-7 items-center justify-center rounded-full font-label text-xs"
                              title={`${MONTH_NAMES[month - 1]} ${cell.day}: ${status}`}
                              style={{
                                backgroundColor: cell.skipped
                                  ? themeVarAlpha("error", 0.125)
                                  : cell.type
                                    ? themeVarAlpha(getTypeRole(cell.type), 0.125)
                                    : "transparent",
                                color: cell.skipped
                                  ? themeVar("error")
                                  : cell.type
                                    ? getTypeColor(cell.type)
                                    : themeVar("content-subtle"),
                              }}
                            >
                              <span aria-hidden="true">{cell.day}</span>
                              <span className="sr-only">{MONTH_NAMES[month - 1]} {cell.day}: {status}</span>
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="py-8 text-center font-body text-sm text-content-muted">No workout sessions to show yet.</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4">
              <span className="font-label text-xs font-medium text-content-subtle">Legend</span>
              {Object.entries(TYPE_ROLES).map(([type, role]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeVar(role) }} />
                  <span className="font-label text-xs capitalize text-content-subtle">{type}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-error" aria-hidden="true" />
                <span className="font-label text-xs text-content-subtle">No workout</span>
              </div>
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
                <p className="mb-0.5 font-headline text-xl font-bold tracking-tight text-on-surface tabular-nums sm:text-2xl">
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
