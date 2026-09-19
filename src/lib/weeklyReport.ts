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

export type PracticeMover = { id: string; label: string; color: string; thisWeekCount: number; lastWeekCount: number; deltaPct: number };

function daysLoggedInRange(practiceId: string, entries: TimeEntry[], days: string[]): number {
  const dates = new Set(entries.filter((e) => e.categoryId === practiceId).map((e) => e.date));
  return days.filter((d) => dates.has(d)).length;
}

/** Each practice's this-week-vs-last-week day count, as the basis for a
 * real "X is up, Y is down" insight instead of a scripted one. */
export function practiceWeekOverWeek(practices: Practice[], entries: TimeEntry[]): PracticeMover[] {
  const thisWeek = lastDateIds(7);
  const lastWeek = lastDateIds(14).slice(0, 7);
  return practices.map((p) => {
    const tw = daysLoggedInRange(p.id, entries, thisWeek);
    const lw = daysLoggedInRange(p.id, entries, lastWeek);
    return { id: p.id, label: p.label, color: p.color, thisWeekCount: tw, lastWeekCount: lw, deltaPct: Math.round(((tw - lw) / 7) * 100) };
  });
}

export type InsightPill = { label: string; tone: "up" | "down" | "steady" };
export type WeeklyInsight = { headline: string; detail: string; pills: InsightPill[] };

/** Picks the biggest riser and biggest faller among practices with any
 * history at all and turns that into one sentence — null when there
 * simply isn't enough logged yet to say anything real. */
export function generateWeeklyInsight(movers: PracticeMover[]): WeeklyInsight | null {
  const withHistory = movers.filter((m) => m.thisWeekCount > 0 || m.lastWeekCount > 0);
  if (withHistory.length === 0) return null;

  const ranked = [...withHistory].sort((a, b) => b.deltaPct - a.deltaPct);
  const riser = ranked[0];
  const faller = ranked[ranked.length - 1];
  const pills: InsightPill[] = [];

  if (riser.deltaPct > 0 && faller.deltaPct < 0 && riser.id !== faller.id) {
    pills.push({ label: `${riser.label} ↑${riser.deltaPct}%`, tone: "up" }, { label: `${faller.label} ↓${Math.abs(faller.deltaPct)}%`, tone: "down" });
    return {
      headline: `${riser.label} is improving, but ${faller.label} dropped this week.`,
      detail: `${riser.label} reached ${riser.thisWeekCount} of 7 days, up from ${riser.lastWeekCount}. ${faller.label} slipped to ${faller.thisWeekCount} of 7, down from ${faller.lastWeekCount}.`,
      pills,
    };
  }
  if (riser.deltaPct > 0) {
    pills.push({ label: `${riser.label} ↑${riser.deltaPct}%`, tone: "up" });
    return {
      headline: `${riser.label} is trending up this week.`,
      detail: `Now at ${riser.thisWeekCount} of 7 days, up from ${riser.lastWeekCount} last week.`,
      pills,
    };
  }
  if (faller.deltaPct < 0) {
    pills.push({ label: `${faller.label} ↓${Math.abs(faller.deltaPct)}%`, tone: "down" });
    return {
      headline: `${faller.label} slipped a bit this week.`,
      detail: `Down to ${faller.thisWeekCount} of 7 days, from ${faller.lastWeekCount} last week. A light session could bring it back.`,
      pills,
    };
  }
  return {
    headline: "Your week has been steady.",
    detail: "No big swings up or down across your streaks in the last 7 days.",
    pills: [{ label: "Steady", tone: "steady" }],
  };
}
