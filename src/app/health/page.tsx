import { getWorkouts, getWorkoutSummary } from "@/lib/api";
import WorkoutDashboard from "@/components/sections/WorkoutDashboard";

export default async function Health() {
  const [workouts, summary] = await Promise.all([
    getWorkouts(),
    getWorkoutSummary(),
  ]);

  return <WorkoutDashboard workouts={workouts} summary={summary} />;
}
