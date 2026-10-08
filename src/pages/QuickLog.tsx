import { useState } from "react";
import { Check, ClipboardCopy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SyncErrorBanner } from "@/components/SyncErrorBanner";
import { buildChatPrompt, buildQuickLogPlan, type QuickLogPlan } from "@/lib/quickLog";
import { DEFAULT_TARGETS, type FoodEntry, type NutritionTargets, type WaterEntry } from "@/lib/nutrition";
import type { ExerciseEntry, StepsLog } from "@/lib/health";
import type { Practice } from "@/lib/practices";
import type { Book, ReadingSession } from "@/lib/reading";
import { useCollection } from "@/lib/store";
import type { TodoItem } from "@/lib/todos";
import type { TimeEntry } from "@/lib/types";

export function QuickLog() {
  const { items: practices } = useCollection<Practice>("practices");
  const { items: books, setItems: setBooks, syncError: booksErr } = useCollection<Book>("books");
  const { items: entries, setItems: setEntries, syncError: entriesErr } = useCollection<TimeEntry>("time_entries");
  const { items: targetDocs } = useCollection<NutritionTargets>("nutrition_targets");
  const { setItems: setFood, syncError: foodErr } = useCollection<FoodEntry>("food_entries");
  const { setItems: setSteps, syncError: stepsErr } = useCollection<StepsLog>("steps_logs");
  const { setItems: setExercise, syncError: exerciseErr } = useCollection<ExerciseEntry>("exercise_entries");
  const { setItems: setWater, syncError: waterErr } = useCollection<WaterEntry>("water_entries");
  const { setItems: setTodos, syncError: todosErr } = useCollection<TodoItem>("todos");
  const { setItems: setSessions, syncError: sessionsErr } = useCollection<ReadingSession>("reading_sessions");

  const [text, setText] = useState("");
  const [plan, setPlan] = useState<QuickLogPlan | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const targets = { ...DEFAULT_TARGETS, ...targetDocs[0] };

  async function copyPrompt() {
    await navigator.clipboard.writeText(buildChatPrompt(practices, books, targets));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function preview() {
    setSaved(false);
    setPlan(buildQuickLogPlan(text, { practices, books, existingEntries: entries }));
  }

  function save() {
    if (!plan || plan.errors.length > 0) return;
    if (plan.timeEntries.length) setEntries((prev) => [...prev, ...plan.timeEntries]);
    if (plan.food.length) setFood((prev) => [...prev, ...plan.food]);
    if (plan.steps.length) setSteps((prev) => [...prev.filter((s) => !plan.steps.some((n) => n.date === s.date)), ...plan.steps]);
    if (plan.exercise.length) setExercise((prev) => [...prev, ...plan.exercise]);
    if (plan.water.length) setWater((prev) => [...prev, ...plan.water]);
    if (plan.todos.length) setTodos((prev) => [...prev, ...plan.todos]);
    if (plan.bookUpdates.length) {
      setBooks((prev) =>
        prev.map((b) => {
          const u = plan.bookUpdates.find((x) => x.id === b.id);
          return u ? { ...b, currentPage: u.currentPage, status: u.status ?? b.status } : b;
        }),
      );
    }
    if (plan.sessions.length) setSessions((prev) => [...prev, ...plan.sessions]);
    setSaved(true);
    setPlan(null);
    setText("");
  }

  const syncError = booksErr ?? entriesErr ?? foodErr ?? stepsErr ?? exerciseErr ?? waterErr ?? todosErr ?? sessionsErr;

  return (
    <div className="subtle-rise space-y-5">
      <SyncErrorBanner error={syncError} />

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">1. Tell Claude what you did</CardTitle>
          <p className="text-sm text-muted-foreground">
            Open Claude chat and paste this prompt once at the start of the conversation. Then just describe your day in your own words. It's filled in with your current streaks, books and targets, so it stays
            up to date.
          </p>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <Button type="button" variant="outline" onClick={copyPrompt}>
            {copied ? <Check className="size-4" /> : <ClipboardCopy className="size-4" />} {copied ? "Copied" : "Copy the prompt"}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">2. Paste Claude&rsquo;s reply here</CardTitle>
          <p className="text-sm text-muted-foreground">Nothing is saved until you check the preview and press Save.</p>
        </CardHeader>
        <CardContent className="space-y-3 p-0 pt-4">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder='{ "time": [ ... ], "food": [ ... ] }' className="min-h-40 font-mono text-xs" />
          <Button type="button" onClick={preview} disabled={!text.trim()}>
            Preview
          </Button>
          {saved && <p className="text-sm text-sage">Saved. It&rsquo;s in your timeline, streaks and reviews now.</p>}

          {plan && (
            <div className="space-y-3 rounded-2xl bg-accent/30 p-4">
              {plan.errors.length > 0 && (
                <ul className="space-y-1 text-sm text-destructive">
                  {plan.errors.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              )}
              {plan.warnings.length > 0 && (
                <ul className="space-y-1 text-sm text-amber">
                  {plan.warnings.map((w) => (
                    <li key={w}>• {w}</li>
                  ))}
                </ul>
              )}
              {plan.summary.length > 0 && (
                <ul className="space-y-1 text-sm">
                  {plan.summary.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              {plan.errors.length === 0 && (
                <Button type="button" onClick={save}>
                  Save {plan.summary.length} item{plan.summary.length === 1 ? "" : "s"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
