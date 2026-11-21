import { getWorkouts, getWorkoutSummary } from "@/lib/api";
import WorkoutDashboard from "@/components/sections/WorkoutDashboard";

export default async function Health() {
  const [workouts, summary] = await Promise.all([
    getWorkouts(),
    getWorkoutSummary(),
  ]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <main id="main-content" tabIndex={-1}>
        <WorkoutDashboard workouts={workouts} summary={summary} />
      </main>
    </>
  );
}
