import type { ExerciseEntry, HealthTargets, StepsLog } from "@/lib/health";

function dayTotals(exercise: ExerciseEntry[], steps: StepsLog[], date: string) {
  const dayExercise = exercise.filter((e) => e.date === date);
  const daySteps = steps.find((s) => s.date === date)?.steps ?? 0;
  return {
    caloriesBurned: dayExercise.reduce((sum, e) => sum + e.caloriesBurned, 0),
    minutes: dayExercise.reduce((sum, e) => sum + e.durationMin, 0),
    steps: daySteps,
    active: dayExercise.length > 0,
  };
}

export type DayActivity = { date: string; caloriesBurned: number; steps: number };

/** Per-day totals over a date range, for the weekly activity chart — one
 * point per day regardless of whether anything was logged that day. */
export function dailyActivitySeries(exercise: ExerciseEntry[], steps: StepsLog[], days: string[]): DayActivity[] {
  return days.map((date) => {
    const t = dayTotals(exercise, steps, date);
    return { date, caloriesBurned: t.caloriesBurned, steps: t.steps };
  });
}

export type HealthWeekStats = {
  avgCaloriesBurned: number;
  avgExerciseMinutes: number;
  avgSteps: number;
  activeDays: number;
  daysStepsGoalReached: number;
};

export function computeHealthWeekStats(exercise: ExerciseEntry[], steps: StepsLog[], days: string[], targets: HealthTargets): HealthWeekStats {
  let sumCalories = 0;
  let sumMinutes = 0;
  let sumSteps = 0;
  let activeDays = 0;
  let daysStepsGoalReached = 0;

  for (const date of days) {
    const t = dayTotals(exercise, steps, date);
    sumCalories += t.caloriesBurned;
    sumMinutes += t.minutes;
    sumSteps += t.steps;
    if (t.active) activeDays++;
    if (targets.stepsGoal > 0 && t.steps >= targets.stepsGoal) daysStepsGoalReached++;
  }

  const n = days.length || 1;
  return {
    avgCaloriesBurned: sumCalories / n,
    avgExerciseMinutes: sumMinutes / n,
    avgSteps: sumSteps / n,
    activeDays,
    daysStepsGoalReached,
  };
}

export type ReviewPoint = { label: string; detail: string };
export type WeeklyGoal = { label: string; achieved: number; total: number };

export type HealthWeeklyReview = {
  headline: string;
  improved: ReviewPoint[];
  workOn: ReviewPoint[];
  goals: WeeklyGoal[];
};

/** Real week-over-week comparison, not a scripted insight — null when
 * there's nothing logged in either week to compare. */
export function generateHealthWeeklyReview(thisWeek: HealthWeekStats, lastWeek: HealthWeekStats, daysInWeek: number): HealthWeeklyReview | null {
  if (thisWeek.activeDays === 0 && lastWeek.activeDays === 0 && thisWeek.avgSteps === 0 && lastWeek.avgSteps === 0) return null;

  const improved: ReviewPoint[] = [];
  const workOn: ReviewPoint[] = [];

  if (thisWeek.activeDays > lastWeek.activeDays) {
    improved.push({ label: "Active days", detail: `${thisWeek.activeDays} of ${daysInWeek} days active this week, up from ${lastWeek.activeDays}.` });
  } else if (thisWeek.activeDays < lastWeek.activeDays) {
    workOn.push({ label: "Active days", detail: `${thisWeek.activeDays} of ${daysInWeek} days active this week, down from ${lastWeek.activeDays}.` });
  }

  if (lastWeek.avgCaloriesBurned > 0 || thisWeek.avgCaloriesBurned > 0) {
    if (thisWeek.avgCaloriesBurned > lastWeek.avgCaloriesBurned * 1.05) {
      improved.push({ label: "Calories burned", detail: `Averaging ${Math.round(thisWeek.avgCaloriesBurned)} kcal/day this week, up from ${Math.round(lastWeek.avgCaloriesBurned)}.` });
    } else if (thisWeek.avgCaloriesBurned < lastWeek.avgCaloriesBurned * 0.95) {
      workOn.push({ label: "Calories burned", detail: `Averaging ${Math.round(thisWeek.avgCaloriesBurned)} kcal/day this week, down from ${Math.round(lastWeek.avgCaloriesBurned)}.` });
    }
  }

  if (lastWeek.avgSteps > 0 || thisWeek.avgSteps > 0) {
    if (thisWeek.avgSteps > lastWeek.avgSteps * 1.05) {
      improved.push({ label: "Steps", detail: `Averaging ${Math.round(thisWeek.avgSteps).toLocaleString()} steps/day this week, up from ${Math.round(lastWeek.avgSteps).toLocaleString()}.` });
    } else if (thisWeek.avgSteps < lastWeek.avgSteps * 0.95) {
      workOn.push({ label: "Steps", detail: `Averaging ${Math.round(thisWeek.avgSteps).toLocaleString()} steps/day this week, down from ${Math.round(lastWeek.avgSteps).toLocaleString()}.` });
    }
  }

  const goals: WeeklyGoal[] = [
    { label: "Active days", achieved: thisWeek.activeDays, total: daysInWeek },
    { label: "Steps goal reached", achieved: thisWeek.daysStepsGoalReached, total: daysInWeek },
  ];

  const headline =
    improved.length > 0 && workOn.length > 0
      ? `${improved[0].label} improved this week — ${workOn[0].label.toLowerCase()} could use more attention.`
      : improved.length > 0
        ? `${improved.map((i) => i.label).join(" and ")} trending up this week.`
        : workOn.length > 0
          ? `${workOn[0].label} is the one to focus on this week.`
          : "Activity has been steady this week.";

  return { headline, improved, workOn, goals };
}
