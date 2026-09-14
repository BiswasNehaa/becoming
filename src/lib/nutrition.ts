export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

/**
 * One food logged against a meal. Calories/macros are approximate —
 * usually estimated by Claude from a plain description ("2 eggs, toast,
 * chai") rather than looked up, so treat totals as a useful estimate, not
 * a lab measurement.
 */
export type FoodEntry = {
  id: string;
  date: string;
  mealType: MealType;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  note?: string;
};

export type NutritionTargets = {
  /** Always "default" — one targets doc per user, kept as a single-item
   * collection so it fits the same generic id-based store as everything
   * else instead of needing its own special case. */
  id: "default";
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

export const DEFAULT_TARGETS: NutritionTargets = {
  id: "default",
  calories: 2000,
  proteinG: 100,
  carbsG: 250,
  fatG: 65,
  fiberG: 25,
};

export type MacroTotals = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

export function totalMacros(entries: FoodEntry[]): MacroTotals {
  return entries.reduce(
    (sum, e) => ({
      calories: sum.calories + e.calories,
      proteinG: sum.proteinG + e.proteinG,
      carbsG: sum.carbsG + e.carbsG,
      fatG: sum.fatG + e.fatG,
      fiberG: sum.fiberG + e.fiberG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 },
  );
}

export type MacroStatus = "below" | "on-track" | "goal-reached" | "above";

/**
 * Non-judgmental status for one macro vs. its target — "below target" /
 * "on track", never pass/fail language. Protein and fiber read as goals to
 * reach (more is fine); calories/carbs/fat read as a range to stay near.
 */
export function macroStatus(value: number, target: number, kind: "ceiling" | "goal"): MacroStatus {
  if (target <= 0) return "on-track";
  const pct = value / target;
  if (kind === "goal") {
    if (pct >= 1) return "goal-reached";
    if (pct >= 0.7) return "on-track";
    return "below";
  }
  if (pct > 1.1) return "above";
  if (pct < 0.9) return "below";
  return "on-track";
}

export const MACRO_STATUS_LABEL: Record<MacroStatus, string> = {
  below: "Below target",
  "on-track": "On track",
  "goal-reached": "Goal reached",
  above: "Above target",
};
