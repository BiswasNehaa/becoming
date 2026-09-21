import { totalWaterMl, type FoodEntry, type NutritionTargets, type WaterEntry } from "@/lib/nutrition";

export type NutritionWeekStats = {
  avgCalories: number;
  avgProteinG: number;
  avgWaterMl: number;
  daysLogged: number;
  daysCalorieOnTrack: number;
  daysProteinGoalReached: number;
  daysWaterGoalReached: number;
};

function dayTotals(food: FoodEntry[], water: WaterEntry[], date: string) {
  const dayFood = food.filter((f) => f.date === date);
  const dayWater = water.filter((w) => w.date === date);
  return {
    calories: dayFood.reduce((sum, f) => sum + f.calories, 0),
    proteinG: dayFood.reduce((sum, f) => sum + f.proteinG, 0),
    waterMl: totalWaterMl(dayWater),
    logged: dayFood.length > 0 || dayWater.length > 0,
  };
}

export function computeNutritionWeekStats(food: FoodEntry[], water: WaterEntry[], days: string[], targets: NutritionTargets): NutritionWeekStats {
  let sumCalories = 0;
  let sumProtein = 0;
  let sumWater = 0;
  let daysLogged = 0;
  let daysCalorieOnTrack = 0;
  let daysProteinGoalReached = 0;
  let daysWaterGoalReached = 0;

  for (const date of days) {
    const t = dayTotals(food, water, date);
    sumCalories += t.calories;
    sumProtein += t.proteinG;
    sumWater += t.waterMl;
    if (t.logged) daysLogged++;
    if (targets.calories > 0 && t.calories >= targets.calories * 0.9 && t.calories <= targets.calories * 1.1) daysCalorieOnTrack++;
    if (targets.proteinG > 0 && t.proteinG >= targets.proteinG) daysProteinGoalReached++;
    if (targets.waterMl > 0 && t.waterMl >= targets.waterMl) daysWaterGoalReached++;
  }

  const n = days.length || 1;
  return {
    avgCalories: sumCalories / n,
    avgProteinG: sumProtein / n,
    avgWaterMl: sumWater / n,
    daysLogged,
    daysCalorieOnTrack,
    daysProteinGoalReached,
    daysWaterGoalReached,
  };
}

export type ReviewPoint = { label: string; detail: string };
export type WeeklyGoal = { label: string; achieved: number; total: number };

export type NutritionWeeklyReview = {
  headline: string;
  improved: ReviewPoint[];
  workOn: ReviewPoint[];
  goals: WeeklyGoal[];
};

/** How close the average is to target — for calories (a ceiling you don't
 * want to drift too far from either side), not "more is better." */
function calorieGoodness(avg: number, target: number): number {
  if (target <= 0) return 1;
  return Math.max(0, 1 - Math.abs(avg - target) / target);
}

/** For protein/water — more is better, up to the target. */
function goalGoodness(avg: number, target: number): number {
  if (target <= 0) return 1;
  return Math.min(1, avg / target);
}

/** Real week-over-week comparison, not a scripted insight — null when
 * there's simply nothing logged in either week to compare. */
export function generateNutritionWeeklyReview(
  thisWeek: NutritionWeekStats,
  lastWeek: NutritionWeekStats,
  targets: NutritionTargets,
  daysInWeek: number,
): NutritionWeeklyReview | null {
  if (thisWeek.daysLogged === 0 && lastWeek.daysLogged === 0) return null;

  const metrics = [
    {
      label: "Calories",
      unit: "kcal",
      thisGoodness: calorieGoodness(thisWeek.avgCalories, targets.calories),
      lastGoodness: calorieGoodness(lastWeek.avgCalories, targets.calories),
      thisAvg: thisWeek.avgCalories,
      lastAvg: lastWeek.avgCalories,
    },
    {
      label: "Protein",
      unit: "g",
      thisGoodness: goalGoodness(thisWeek.avgProteinG, targets.proteinG),
      lastGoodness: goalGoodness(lastWeek.avgProteinG, targets.proteinG),
      thisAvg: thisWeek.avgProteinG,
      lastAvg: lastWeek.avgProteinG,
    },
    {
      label: "Water",
      unit: "ml",
      thisGoodness: goalGoodness(thisWeek.avgWaterMl, targets.waterMl),
      lastGoodness: goalGoodness(lastWeek.avgWaterMl, targets.waterMl),
      thisAvg: thisWeek.avgWaterMl,
      lastAvg: lastWeek.avgWaterMl,
    },
  ];

  const improved: ReviewPoint[] = [];
  for (const m of metrics) {
    if (m.thisGoodness - m.lastGoodness > 0.03) {
      improved.push({ label: m.label, detail: `Averaging ${Math.round(m.thisAvg)}${m.unit}/day this week, up from ${Math.round(m.lastAvg)}${m.unit} last week.` });
    }
  }

  const workOn: ReviewPoint[] = [];
  const worst = [...metrics].sort((a, b) => a.thisGoodness - b.thisGoodness)[0];
  if (worst.thisGoodness < 0.85) {
    workOn.push({ label: worst.label, detail: `Averaging ${Math.round(worst.thisAvg)}${worst.unit}/day this week — furthest from target of the three.` });
  }

  const goals: WeeklyGoal[] = [
    { label: "Calories on track", achieved: thisWeek.daysCalorieOnTrack, total: daysInWeek },
    { label: "Protein goal reached", achieved: thisWeek.daysProteinGoalReached, total: daysInWeek },
    { label: "Water goal reached", achieved: thisWeek.daysWaterGoalReached, total: daysInWeek },
  ];

  const headline =
    improved.length > 0 && workOn.length > 0
      ? `${improved[0].label} improved this week — ${workOn[0].label.toLowerCase()} could use more attention.`
      : improved.length > 0
        ? `${improved.map((i) => i.label).join(" and ")} trending up this week.`
        : workOn.length > 0
          ? `${workOn[0].label} is the one to focus on this week.`
          : "Nutrition logging has been steady this week.";

  return { headline, improved, workOn, goals };
}
