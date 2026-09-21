/** One workout/activity logged for a day — calories burned is a manual
 * estimate (same trust model as food calories: you know your effort better
 * than a generic formula would), not computed from a MET table. */
export type ExerciseEntry = {
  id: string;
  date: string;
  activity: string;
  durationMin: number;
  caloriesBurned: number;
  notes?: string;
};

export const COMMON_ACTIVITIES = ["Walk", "Run", "Gym", "Yoga", "Cycling", "Swimming", "Sports"];

export function totalCaloriesBurned(entries: ExerciseEntry[]): number {
  return entries.reduce((sum, e) => sum + e.caloriesBurned, 0);
}

export function totalExerciseMinutes(entries: ExerciseEntry[]): number {
  return entries.reduce((sum, e) => sum + e.durationMin, 0);
}

/** One value per day, not additive like exercise — a step count is a
 * running daily total you check/update, not a series of small events. `id`
 * is the date itself so saving today's count again just overwrites it. */
export type StepsLog = {
  id: string;
  date: string;
  steps: number;
};

export type HealthTargets = {
  /** Always "default" — same single-doc-per-user pattern as NutritionTargets. */
  id: "default";
  stepsGoal: number;
};

export const DEFAULT_HEALTH_TARGETS: HealthTargets = {
  id: "default",
  stepsGoal: 8000,
};
