import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DayNavHeader } from "@/components/DayNavHeader";
import { ExerciseForm } from "@/components/health/ExerciseForm";
import { ExerciseList } from "@/components/health/ExerciseList";
import { StepsTracker } from "@/components/health/StepsTracker";
import { useDayNav } from "@/hooks/useDayNav";
import { useCollection } from "@/lib/store";
import { DEFAULT_HEALTH_TARGETS, totalCaloriesBurned, totalExerciseMinutes, type ExerciseEntry, type HealthTargets, type StepsLog } from "@/lib/health";

export function Health() {
  const { viewDate, isToday, label, goPrev, goNext, goToday } = useDayNav();
  const { items: allExercise, setItems: setAllExercise, loading } = useCollection<ExerciseEntry>("exercise_entries");
  const { items: allSteps, setItems: setAllSteps } = useCollection<StepsLog>("steps_logs");
  const { items: targetDocs, setItems: setTargetDocs } = useCollection<HealthTargets>("health_targets");
  const [editingEntry, setEditingEntry] = useState<ExerciseEntry | null>(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");

  const targets = { ...DEFAULT_HEALTH_TARGETS, ...targetDocs[0] };
  const dayExercise = useMemo(() => allExercise.filter((e) => e.date === viewDate), [allExercise, viewDate]);
  const caloriesBurned = useMemo(() => totalCaloriesBurned(dayExercise), [dayExercise]);
  const exerciseMinutes = useMemo(() => totalExerciseMinutes(dayExercise), [dayExercise]);
  const daySteps = allSteps.find((s) => s.date === viewDate)?.steps ?? 0;

  function saveEntry(entry: ExerciseEntry) {
    setAllExercise((prev) => {
      const exists = prev.some((e) => e.id === entry.id);
      return exists ? prev.map((e) => (e.id === entry.id ? entry : e)) : [...prev, entry];
    });
    setEditingEntry(null);
  }

  function deleteEntry(id: string) {
    setAllExercise((prev) => prev.filter((e) => e.id !== id));
    if (editingEntry?.id === id) setEditingEntry(null);
  }

  function saveSteps(steps: number) {
    setAllSteps((prev) => [...prev.filter((s) => s.date !== viewDate), { id: viewDate, date: viewDate, steps }]);
  }

  function saveGoal(e: React.FormEvent) {
    e.preventDefault();
    setTargetDocs([{ ...targets, stepsGoal: Number(goalDraft) || targets.stepsGoal }]);
    setEditingGoal(false);
  }

  return (
    <div className="subtle-rise space-y-5">
      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <DayNavHeader label={label} isToday={isToday} onPrev={goPrev} onNext={goNext} onToday={goToday} />
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Calories burned</p>
                <p className="mt-1 font-display text-2xl font-bold">{Math.round(caloriesBurned)} kcal</p>
                <p className="text-xs text-muted-foreground">{exerciseMinutes}m of activity {isToday ? "today" : "that day"}</p>
              </div>
              <StepsTracker steps={daySteps} targetSteps={targets.stepsGoal} onSave={saveSteps} />
            </div>
            <div className="mt-4 border-t border-line pt-4">
              {editingGoal ? (
                <form onSubmit={saveGoal} className="flex items-end gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Daily step goal</label>
                    <Input autoFocus type="number" min="0" inputMode="numeric" value={goalDraft} onChange={(e) => setGoalDraft(e.target.value)} className="w-28" />
                  </div>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingGoal(false)}>
                    Cancel
                  </Button>
                </form>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => {
                    setGoalDraft(String(targets.stepsGoal));
                    setEditingGoal(true);
                  }}
                >
                  <Pencil className="size-3.5" /> Edit step goal
                </Button>
              )}
            </div>
          </>
        )}
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">{editingEntry ? "Edit exercise" : "Log exercise"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <ExerciseForm date={viewDate} editingEntry={editingEntry} onSave={saveEntry} onCancelEdit={() => setEditingEntry(null)} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <ExerciseList entries={dayExercise} onEdit={setEditingEntry} onDelete={deleteEntry} />
        </CardContent>
      </Card>
    </div>
  );
}
