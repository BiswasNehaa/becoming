import type { Practice } from "@/lib/practices";
import { lastDateIds } from "@/lib/streaks";
import type { TimeEntry } from "@/lib/types";

export type HeatmapCell = { date: string; intensity: number };
export type HeatmapColumn = HeatmapCell[];

/** How much of a day's plan got done — 1 with no target (a plain yes/no,
 * since there's nothing to measure a fraction against), otherwise minutes
 * logged over target, capped at 1 so overshooting doesn't distort the
 * color scale. */
function dayIntensity(minutes: number, targetMinutes: number | undefined): number {
  if (minutes <= 0) return 0;
  if (!targetMinutes) return 1;
  return Math.min(1, minutes / targetMinutes);
}

/** Trailing `totalDays` days chunked into 7-day columns, oldest first,
 * ending today — a simplified contribution-graph layout that doesn't
 * bother aligning to real calendar weeks, since spotting the pattern
 * matters more here than matching a specific weekday grid. */
export function buildPracticeHeatmap(practice: Practice, entries: TimeEntry[], totalDays: number): HeatmapColumn[] {
  const days = lastDateIds(totalDays);
  const minutesByDate = new Map<string, number>();
  for (const e of entries) {
    if (e.categoryId !== practice.id) continue;
    minutesByDate.set(e.date, (minutesByDate.get(e.date) ?? 0) + Math.max(0, e.endMin - e.startMin));
  }

  const cells: HeatmapCell[] = days.map((date) => ({ date, intensity: dayIntensity(minutesByDate.get(date) ?? 0, practice.targetMinutes) }));

  const columns: HeatmapColumn[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }
  return columns;
}
