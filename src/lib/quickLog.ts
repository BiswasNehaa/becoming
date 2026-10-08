import { CATEGORIES } from "@/lib/categories";
import type { ExerciseEntry, StepsLog } from "@/lib/health";
import type { FoodEntry, MealType, NutritionTargets, WaterEntry } from "@/lib/nutrition";
import type { Practice } from "@/lib/practices";
import type { Book, ReadingSession } from "@/lib/reading";
import { makeId, todayId } from "@/lib/store";
import { timeStringToMinutes } from "@/lib/timeMath";
import type { Priority, TodoItem } from "@/lib/todos";
import type { TimeEntry } from "@/lib/types";

export type QuickLogContext = {
  practices: Practice[];
  books: Book[];
  existingEntries: TimeEntry[];
};

export type QuickLogPlan = {
  timeEntries: TimeEntry[];
  food: FoodEntry[];
  steps: StepsLog[];
  exercise: ExerciseEntry[];
  water: WaterEntry[];
  todos: TodoItem[];
  bookUpdates: { id: string; currentPage: number; status?: Book["status"] }[];
  sessions: ReadingSession[];
  summary: string[];
  warnings: string[];
  errors: string[];
};

const MEALS: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]?\d|2[0-3]):[0-5]\d$/;

const FIXED_ALIASES: Record<string, string> = {
  sleep: "sleep",
  meals: "meals",
  meal: "meals",
  screen: "screen",
  "screen / reels": "screen",
  reels: "screen",
  work: "work",
  "work / life admin": "work",
  other: "other",
  waste: "waste",
  wasted: "waste",
  "wasted time": "waste",
};

function resolveCategory(name: string, practices: Practice[]): { id: string; label: string } | null {
  const key = name.trim().toLowerCase();
  const fixed = FIXED_ALIASES[key];
  if (fixed) return { id: fixed, label: CATEGORIES.find((c) => c.id === fixed)?.label ?? fixed };
  const practice = practices.find((p) => p.label.trim().toLowerCase() === key);
  return practice ? { id: practice.id, label: practice.label } : null;
}

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function hhmm(minutes: number): string {
  return String(Math.floor(minutes / 60)).padStart(2, "0") + ":" + String(minutes % 60).padStart(2, "0");
}

export function buildQuickLogPlan(raw: string, ctx: QuickLogContext): QuickLogPlan {
  const plan: QuickLogPlan = { timeEntries: [], food: [], steps: [], exercise: [], water: [], todos: [], bookUpdates: [], sessions: [], summary: [], warnings: [], errors: [] };

  let data: Record<string, unknown>;
  try {
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    data = JSON.parse(cleaned);
  } catch {
    plan.errors.push("That isn't valid JSON — copy the whole block Claude gave you, including the first { and last }.");
    return plan;
  }

  const list = (key: string): Record<string, unknown>[] => (Array.isArray(data[key]) ? (data[key] as Record<string, unknown>[]) : []);
  const checkDate = (d: unknown, where: string): d is string => {
    if (typeof d === "string" && DATE.test(d)) return true;
    plan.errors.push(`${where}: date must look like 2026-10-09.`);
    return false;
  };

  const planned: TimeEntry[] = [];
  list("time").forEach((t, i) => {
    const where = `time #${i + 1}`;
    if (!checkDate(t.date, where)) return;
    if (typeof t.start !== "string" || typeof t.end !== "string" || !TIME.test(t.start) || !TIME.test(t.end)) {
      plan.errors.push(`${where}: start and end must be 24-hour times like 13:05.`);
      return;
    }
    const startMin = timeStringToMinutes(t.start);
    const endMin = timeStringToMinutes(t.end);
    if (endMin <= startMin) {
      plan.errors.push(`${where}: end must be after start (split anything that crosses midnight into two entries).`);
      return;
    }
    const category = resolveCategory(String(t.category ?? ""), ctx.practices);
    if (!category) {
      plan.errors.push(`${where}: I don't know the category "${String(t.category)}".`);
      return;
    }
    const entry: TimeEntry = { id: makeId(), date: t.date as string, startMin, endMin, categoryId: category.id, note: t.note ? String(t.note) : undefined };
    const clash = [...ctx.existingEntries, ...planned].find((e) => e.date === entry.date && e.startMin < entry.endMin && entry.startMin < e.endMin);
    if (clash) plan.warnings.push(`${where} (${t.start}-${t.end}) overlaps something already logged at ${hhmm(clash.startMin)}-${hhmm(clash.endMin)}.`);
    planned.push(entry);
    plan.summary.push(`${t.date} ${t.start}-${t.end}  ${category.label}${t.note ? " — " + String(t.note) : ""}`);
  });
  plan.timeEntries = planned;

  list("food").forEach((f, i) => {
    const where = `food #${i + 1}`;
    if (!checkDate(f.date, where)) return;
    const meal = String(f.meal ?? "").toLowerCase() as MealType;
    if (!MEALS.includes(meal)) {
      plan.errors.push(`${where}: meal must be breakfast, lunch, dinner or snack.`);
      return;
    }
    if (!f.name) {
      plan.errors.push(`${where}: needs a name.`);
      return;
    }
    plan.food.push({ id: makeId(), date: f.date as string, mealType: meal, name: String(f.name), calories: num(f.calories), proteinG: num(f.protein), carbsG: num(f.carbs), fatG: num(f.fat), fiberG: num(f.fiber) });
    plan.summary.push(`${f.date} ${meal}: ${String(f.name)} — ${num(f.calories)} kcal`);
  });

  list("steps").forEach((s, i) => {
    if (!checkDate(s.date, `steps #${i + 1}`)) return;
    plan.steps.push({ id: s.date as string, date: s.date as string, steps: num(s.steps) });
    plan.summary.push(`${s.date} steps: ${num(s.steps).toLocaleString()}`);
  });

  list("exercise").forEach((e, i) => {
    const where = `exercise #${i + 1}`;
    if (!checkDate(e.date, where)) return;
    if (!e.activity) {
      plan.errors.push(`${where}: needs an activity.`);
      return;
    }
    plan.exercise.push({ id: makeId(), date: e.date as string, activity: String(e.activity), durationMin: num(e.minutes), caloriesBurned: num(e.calories), notes: e.notes ? String(e.notes) : undefined });
    plan.summary.push(`${e.date} exercise: ${String(e.activity)} — ${num(e.minutes)} min, ${num(e.calories)} kcal`);
  });

  list("water").forEach((w, i) => {
    if (!checkDate(w.date, `water #${i + 1}`)) return;
    plan.water.push({ id: makeId(), date: w.date as string, ml: num(w.ml) });
    plan.summary.push(`${w.date} water: ${num(w.ml)} ml`);
  });

  list("todos").forEach((t, i) => {
    if (!t.text) {
      plan.errors.push(`todo #${i + 1}: needs text.`);
      return;
    }
    const priority = ["high", "medium", "low"].includes(String(t.priority)) ? (String(t.priority) as Priority) : undefined;
    plan.todos.push({ id: makeId(), text: String(t.text), done: false, createdDate: typeof t.date === "string" && DATE.test(t.date) ? t.date : todayId(), priority });
    plan.summary.push(`to-do: ${String(t.text)}`);
  });

  list("pages").forEach((p, i) => {
    const where = `pages #${i + 1}`;
    if (!checkDate(p.date, where)) return;
    const title = String(p.book ?? "").trim().toLowerCase();
    const matches = ctx.books.filter((b) => b.title.toLowerCase().includes(title) || title.includes(b.title.toLowerCase()));
    if (!title || matches.length !== 1) {
      plan.errors.push(`${where}: couldn't match exactly one book for "${String(p.book)}".`);
      return;
    }
    const book = matches[0];
    const page = num(p.page);
    plan.bookUpdates.push({ id: book.id, currentPage: page, status: page >= book.pages && book.pages > 0 ? "completed" : undefined });
    const delta = page - book.currentPage;
    if (delta > 0) plan.sessions.push({ id: makeId(), date: p.date as string, bookId: book.id, pagesRead: delta });
    plan.summary.push(`${p.date} ${book.title}: page ${book.currentPage} → ${page}${delta > 0 ? ` (+${delta})` : ""}`);
  });

  if (plan.summary.length === 0 && plan.errors.length === 0) plan.errors.push("Nothing to save — the block has no entries.");
  return plan;
}

export function buildChatPrompt(practices: Practice[], books: Book[], targets: NutritionTargets): string {
  const practiceNames = practices.map((p) => p.label).join(", ") || "(none yet)";
  const bookTitles = books.map((b) => `${b.title} (currently page ${b.currentPage}/${b.pages})`).join("; ") || "(none)";
  return `You are my logging assistant for my habit tracker, "Becoming". I'll tell you what I did, in casual language, with times. You turn it into ONE JSON block that I paste into the app. Reply with only the JSON block (in a code block), plus at most one short line asking about anything unclear.

RULES
- Dates are YYYY-MM-DD. Times are 24-hour HH:MM (13:05 is 1:05 PM). Ask me for today's date if you don't know it.
- Anything that crosses midnight must be split into two time entries, one per date.
- Don't invent times, numbers or foods. If something is unclear, ask instead of guessing.
- Time entries must not overlap each other.
- Categories for time entries (use these exact names): Sleep, Meals, Screen, Work, Other, Wasted time, or one of my streaks: ${practiceNames}.
- If I say I wasted time, use the category "Wasted time".
- For exercise calories use the ACTIVE calories from my watch, never total/resting calories.
- Protein/carbs/fat/fiber are grams. If I only give calories, set the rest to 0 and tell me.
- Books I'm reading: ${bookTitles}. "pages" means the page number I've reached, not pages read.
- My daily targets: ${targets.calories} kcal, ${targets.proteinG} g protein, ${targets.carbsG} g carbs, ${targets.fatG} g fat, ${targets.fiberG} g fiber.

FORMAT (leave out any section I didn't mention)
{
  "time": [{"date": "2026-10-09", "start": "00:36", "end": "01:42", "category": "DSA", "note": "optional"}],
  "food": [{"date": "2026-10-09", "meal": "breakfast|lunch|dinner|snack", "name": "Idli, coffee", "calories": 290, "protein": 10, "carbs": 47, "fat": 7, "fiber": 3}],
  "steps": [{"date": "2026-10-09", "steps": 7673}],
  "exercise": [{"date": "2026-10-09", "activity": "Walking", "minutes": 75, "calories": 262, "notes": "optional"}],
  "water": [{"date": "2026-10-09", "ml": 500}],
  "todos": [{"text": "Apply for X", "priority": "high|medium|low (optional)"}],
  "pages": [{"date": "2026-10-09", "book": "Uttoradhikar", "page": 140}]
}`;
}
