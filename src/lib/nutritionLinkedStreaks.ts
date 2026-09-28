import { macroStatus, totalMacros, type FoodEntry, type NutritionTargets } from "@/lib/nutrition";

/** "Close to goal" reuses the same on-track band already used everywhere
 * else in the app (90%-110% of the calorie target) — not a new threshold
 * invented just for this. Deliberately calories-only: a "Healthy meal"
 * streak is about eating reasonably, not hitting every macro. */
export function isNutritionCloseToGoal(food: FoodEntry[], date: string, targets: NutritionTargets): boolean {
  const totals = totalMacros(food.filter((f) => f.date === date));
  return macroStatus(totals.calories, targets.calories, "ceiling") === "on-track";
}

/** A deterministic id (not a random one) so the sync effect can tell
 * whether it already created today's auto-entry without extra state, and
 * so re-running it (StrictMode, a refresh) is naturally idempotent. */
export function nutritionAutoEntryId(practiceId: string, date: string): string {
  return `nutrition-auto-${practiceId}-${date}`;
}
