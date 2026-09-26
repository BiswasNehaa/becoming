import type { Book, ReadingSession } from "@/lib/reading";
import type { ExerciseEntry, StepsLog } from "@/lib/health";
import type { FoodEntry, WaterEntry } from "@/lib/nutrition";
import type { Practice } from "@/lib/practices";
import type { DailyReflection } from "@/lib/reflections";
import { lastDateIds } from "@/lib/streaks";
import type { TimeEntry } from "@/lib/types";

export type AnalysisPeriod = "day" | "week" | "month";

export const PERIOD_DAYS: Record<AnalysisPeriod, number> = {
  day: 1,
  week: 7,
  month: 30,
};

export type AnalysisData = {
  entries: TimeEntry[];
  practices: Practice[];
  food: FoodEntry[];
  water: WaterEntry[];
  books: Book[];
  readingSessions: ReadingSession[];
  exercise: ExerciseEntry[];
  steps: StepsLog[];
  reflections: DailyReflection[];
};

export type DomainStat = {
  key: string;
  label: string;
  color: string;
  daysActive: number;
  totalDays: number;
  detail: string;
};

function hasReflectionContent(r: DailyReflection | undefined): boolean {
  return !!r && (r.mood !== null || Object.values(r.checks).some(Boolean) || !!r.learned || !!r.improveTomorrow);
}

export function computeDomainStats(days: string[], data: AnalysisData): DomainStat[] {
  const daySet = new Set(days);
  const practiceIds = new Set(data.practices.map((p) => p.id));

  const practiceDates = new Set(data.entries.filter((e) => daySet.has(e.date) && practiceIds.has(e.categoryId)).map((e) => e.date));
  const learningMinutes = data.entries.filter((e) => daySet.has(e.date) && e.categoryId === "learning").reduce((sum, e) => sum + Math.max(0, e.endMin - e.startMin), 0);
  const learningDates = new Set(data.entries.filter((e) => daySet.has(e.date) && e.categoryId === "learning").map((e) => e.date));

  const foodInRange = data.food.filter((f) => daySet.has(f.date));
  const waterInRange = data.water.filter((w) => daySet.has(w.date));
  const nutritionDates = new Set([...foodInRange.map((f) => f.date), ...waterInRange.map((w) => w.date)]);
  const totalCalories = foodInRange.reduce((sum, f) => sum + f.calories, 0);

  const sessionsInRange = data.readingSessions.filter((s) => daySet.has(s.date));
  const readingDates = new Set(sessionsInRange.map((s) => s.date));
  const pagesRead = sessionsInRange.reduce((sum, s) => sum + s.pagesRead, 0);

  const exerciseInRange = data.exercise.filter((e) => daySet.has(e.date));
  const stepsInRange = data.steps.filter((s) => daySet.has(s.date) && s.steps > 0);
  const healthDates = new Set([...exerciseInRange.map((e) => e.date), ...stepsInRange.map((s) => s.date)]);
  const caloriesBurned = exerciseInRange.reduce((sum, e) => sum + e.caloriesBurned, 0);

  const reflectionDates = new Set(days.filter((d) => hasReflectionContent(data.reflections.find((r) => r.date === d))));

  const totalDays = days.length;
  return [
    { key: "practices", label: "Practices", color: "var(--glow)", daysActive: practiceDates.size, totalDays, detail: `${data.practices.length} streak${data.practices.length === 1 ? "" : "s"} tracked` },
    { key: "nutrition", label: "Nutrition", color: "var(--sage)", daysActive: nutritionDates.size, totalDays, detail: `${Math.round(totalCalories).toLocaleString()} kcal logged` },
    { key: "reading", label: "Reading", color: "var(--sky)", daysActive: readingDates.size, totalDays, detail: `${pagesRead} pages read` },
    { key: "learning", label: "Learning", color: "var(--violet)", daysActive: learningDates.size, totalDays, detail: `${learningMinutes}m logged` },
    { key: "health", label: "Health", color: "var(--rose)", daysActive: healthDates.size, totalDays, detail: `${Math.round(caloriesBurned).toLocaleString()} kcal burned` },
    { key: "reflection", label: "Reflection", color: "var(--amber)", daysActive: reflectionDates.size, totalDays, detail: `${reflectionDates.size} day${reflectionDates.size === 1 ? "" : "s"} reflected` },
  ];
}

export type Movement = { label: string; detail: string };

/** Compares this period's engagement (days active / total days) against the
 * immediately preceding period of the same length, per domain — the same
 * "did you show up" fraction works for a single day (0 or 1) all the way
 * up to a month, so one comparison rule covers every period. */
export function generateAnalysisMovements(thisPeriod: DomainStat[], lastPeriod: DomainStat[]): { improving: Movement[]; lagging: Movement[] } {
  const improving: Movement[] = [];
  const lagging: Movement[] = [];

  for (let i = 0; i < thisPeriod.length; i++) {
    const cur = thisPeriod[i];
    const prev = lastPeriod[i];
    if (cur.daysActive > prev.daysActive) {
      improving.push({ label: cur.label, detail: `${cur.daysActive} of ${cur.totalDays} days, up from ${prev.daysActive}.` });
    } else if (cur.daysActive < prev.daysActive) {
      lagging.push({ label: cur.label, detail: `${cur.daysActive} of ${cur.totalDays} days, down from ${prev.daysActive}.` });
    }
  }

  return { improving, lagging };
}

export function periodDateRanges(period: AnalysisPeriod): { thisPeriod: string[]; lastPeriod: string[] } {
  const n = PERIOD_DAYS[period];
  return {
    thisPeriod: lastDateIds(n),
    lastPeriod: lastDateIds(n * 2).slice(0, n),
  };
}
