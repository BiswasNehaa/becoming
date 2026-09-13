import type { TimeEntry } from "@/lib/types";

export const MINUTES_IN_DAY = 24 * 60;

export function timeStringToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatClock(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h24 < 12 ? "am" : "pm";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, "0")}${period}`;
}

/** True if [aStart, aEnd) overlaps [bStart, bEnd). */
export function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function findOverlap(entries: TimeEntry[], startMin: number, endMin: number, excludeId?: string): TimeEntry | undefined {
  return entries.find((e) => e.id !== excludeId && rangesOverlap(startMin, endMin, e.startMin, e.endMin));
}

export function sortByStart(entries: TimeEntry[]): TimeEntry[] {
  return [...entries].sort((a, b) => a.startMin - b.startMin);
}

export function totalsByCategory(entries: TimeEntry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const entry of entries) {
    const duration = Math.max(0, entry.endMin - entry.startMin);
    totals[entry.categoryId] = (totals[entry.categoryId] ?? 0) + duration;
  }
  return totals;
}

export function unaccountedMinutes(entries: TimeEntry[]): number {
  const logged = entries.reduce((sum, e) => sum + Math.max(0, e.endMin - e.startMin), 0);
  return Math.max(0, MINUTES_IN_DAY - logged);
}

/** Gaps (as [start, end) pairs) in the day not covered by any entry. */
export function findGaps(entries: TimeEntry[]): { start: number; end: number }[] {
  const sorted = sortByStart(entries);
  const gaps: { start: number; end: number }[] = [];
  let cursor = 0;
  for (const entry of sorted) {
    if (entry.startMin > cursor) {
      gaps.push({ start: cursor, end: entry.startMin });
    }
    cursor = Math.max(cursor, entry.endMin);
  }
  if (cursor < MINUTES_IN_DAY) {
    gaps.push({ start: cursor, end: MINUTES_IN_DAY });
  }
  return gaps;
}
