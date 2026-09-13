import { todayId } from "@/lib/store";
import type { TimeEntry } from "@/lib/types";

/** Last `count` date ids, oldest first, ending today. */
export function lastDateIds(count: number, from = new Date()): string[] {
  const ids: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(from);
    d.setDate(from.getDate() - i);
    ids.push(todayId(d));
  }
  return ids;
}

export type CategoryStreak = {
  categoryId: string;
  /** Consecutive days logged, walking back from today (today doesn't break
   * the streak if it's simply not logged yet — the day isn't over). */
  current: number;
  /** How many of the last 7 days (today inclusive) have an entry. */
  last7Count: number;
  /** Total minutes logged for this category in the last 7 days. */
  last7Minutes: number;
};

export function computeCategoryStreak(categoryId: string, entries: TimeEntry[], lookbackDays = 30): CategoryStreak {
  const days = lastDateIds(lookbackDays);
  const today = days[days.length - 1];

  const minutesByDate = new Map<string, number>();
  for (const entry of entries) {
    if (entry.categoryId !== categoryId) continue;
    const duration = Math.max(0, entry.endMin - entry.startMin);
    minutesByDate.set(entry.date, (minutesByDate.get(entry.date) ?? 0) + duration);
  }

  let idx = days.length - 1;
  if (days[idx] === today && !minutesByDate.has(today)) {
    idx--; // today not logged yet — don't count it as a break
  }
  let current = 0;
  for (; idx >= 0; idx--) {
    if (minutesByDate.has(days[idx])) current++;
    else break;
  }

  const last7 = days.slice(-7);
  const last7Count = last7.filter((d) => minutesByDate.has(d)).length;
  const last7Minutes = last7.reduce((sum, d) => sum + (minutesByDate.get(d) ?? 0), 0);

  return { categoryId, current, last7Count, last7Minutes };
}

export function loggedDatesForCategory(categoryId: string, entries: TimeEntry[]): Set<string> {
  const dates = new Set<string>();
  for (const entry of entries) {
    if (entry.categoryId === categoryId) dates.add(entry.date);
  }
  return dates;
}
