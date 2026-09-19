import type { DailyReflection } from "@/lib/reflections";
import type { FoodEntry } from "@/lib/nutrition";
import type { Practice } from "@/lib/practices";
import { computeCategoryStreak, lastDateIds } from "@/lib/streaks";
import type { TimeEntry } from "@/lib/types";

export type WeeklyBar = { id: string; label: string; pct: number; color: string };

/** Each practice's "how many of the last 7 days" as a 0-100 bar — the same
 * number already shown on the Streaks card, just presented as a percent. */
export function practiceWeeklyBars(practices: Practice[], entries: TimeEntry[]): WeeklyBar[] {
  return practices.map((p) => {
    const streak = computeCategoryStreak(p.id, entries);
    return { id: p.id, label: p.label, pct: Math.round((streak.last7Count / 7) * 100), color: p.color };
  });
}

function daysWithAny7(dateHasEntry: (date: string) => boolean): number {
  return lastDateIds(7).filter(dateHasEntry).length;
}

export function reflectionWeeklyPct(reflections: DailyReflection[]): number {
  const has = (d: string) => {
    const r = reflections.find((x) => x.date === d);
    return !!r && (r.mood !== null || Object.values(r.checks).some(Boolean) || !!r.learned || !!r.improveTomorrow);
  };
  return Math.round((daysWithAny7(has) / 7) * 100);
}

export function nutritionWeeklyPct(food: FoodEntry[]): number {
  const has = (d: string) => food.some((f) => f.date === d);
  return Math.round((daysWithAny7(has) / 7) * 100);
}

/** Total logged minutes this week vs. the 7 days before — for a simple,
 * honest "trending up/down/steady" signal instead of a fabricated insight. */
export function weeklyMinutesTrend(entries: TimeEntry[]): { thisWeek: number; lastWeek: number } {
  const thisWeekDays = new Set(lastDateIds(7));
  const lastWeekDays = new Set(lastDateIds(14).slice(0, 7));
  let thisWeek = 0;
  let lastWeek = 0;
  for (const e of entries) {
    const minutes = Math.max(0, e.endMin - e.startMin);
    if (thisWeekDays.has(e.date)) thisWeek += minutes;
    else if (lastWeekDays.has(e.date)) lastWeek += minutes;
  }
  return { thisWeek, lastWeek };
}

export function personalGrowthScore(practiceBars: WeeklyBar[], reflectionPct: number, nutritionPct: number) {
  const practiceAvg = practiceBars.length > 0 ? practiceBars.reduce((sum, b) => sum + b.pct, 0) / practiceBars.length : 0;
  const overall = Math.round((practiceAvg + reflectionPct + nutritionPct) / 3);
  return { overall, practiceAvg: Math.round(practiceAvg), reflectionPct, nutritionPct };
}
