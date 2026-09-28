import { useEffect } from "react";

import { isNutritionCloseToGoal, nutritionAutoEntryId } from "@/lib/nutritionLinkedStreaks";
import type { FoodEntry, NutritionTargets } from "@/lib/nutrition";
import type { Practice } from "@/lib/practices";
import { todayId } from "@/lib/store";
import type { TimeEntry } from "@/lib/types";

/**
 * Keeps today's auto-generated time entry in sync for any nutrition-linked
 * streak: adds a nominal entry when today's Nutrition logging is close to
 * target, removes it if logging later falls out of range (e.g. an edited
 * food entry). Only ever touches today — a nutrition-linked streak doesn't
 * retroactively change past days just because you reopen the app.
 */
export function useNutritionLinkedStreaks(
  practices: Practice[],
  food: FoodEntry[],
  targets: NutritionTargets,
  setEntries: (updater: (prev: TimeEntry[]) => TimeEntry[]) => void,
) {
  const linked = practices.filter((p) => p.nutritionLinked);
  const linkedIds = linked.map((p) => p.id).join(",");
  const today = todayId();
  const closeToGoal = isNutritionCloseToGoal(food, today, targets);

  useEffect(() => {
    if (linked.length === 0) return;

    setEntries((prev) => {
      let changed = false;
      let next = prev;
      for (const practice of linked) {
        const autoId = nutritionAutoEntryId(practice.id, today);
        const hasAuto = next.some((e) => e.id === autoId);
        if (closeToGoal && !hasAuto) {
          next = [...next, { id: autoId, date: today, startMin: 0, endMin: 1, categoryId: practice.id, note: "Auto-completed from Nutrition" }];
          changed = true;
        } else if (!closeToGoal && hasAuto) {
          next = next.filter((e) => e.id !== autoId);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
    // linkedIds (not `linked`, a new array each render) keeps this from
    // re-running every render — only when which streaks are linked, or
    // whether today's nutrition crosses the goal line, actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedIds, today, closeToGoal, setEntries]);
}
