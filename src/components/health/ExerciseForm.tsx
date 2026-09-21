import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makeId } from "@/lib/store";
import { COMMON_ACTIVITIES, type ExerciseEntry } from "@/lib/health";

const numberField = (v: string) => (v.trim() === "" ? 0 : Number(v));
const ACTIVITY_DATALIST_ID = "exercise-activity-suggestions";

export function ExerciseForm({
  date,
  editingEntry,
  onSave,
  onCancelEdit,
}: {
  date: string;
  editingEntry: ExerciseEntry | null;
  onSave: (entry: ExerciseEntry) => void;
  onCancelEdit: () => void;
}) {
  const [activity, setActivity] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingEntry) {
      setActivity(editingEntry.activity);
      setDurationMin(String(editingEntry.durationMin));
      setCaloriesBurned(String(editingEntry.caloriesBurned));
      setNotes(editingEntry.notes ?? "");
      setError("");
    }
  }, [editingEntry]);

  function reset() {
    setActivity("");
    setDurationMin("");
    setCaloriesBurned("");
    setNotes("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activity.trim()) {
      setError("Say what the activity was.");
      return;
    }
    onSave({
      id: editingEntry?.id ?? makeId(),
      date,
      activity: activity.trim(),
      durationMin: numberField(durationMin),
      caloriesBurned: numberField(caloriesBurned),
      notes: notes.trim() || undefined,
    });
    if (!editingEntry) reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <datalist id={ACTIVITY_DATALIST_ID}>
        {COMMON_ACTIVITIES.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-36 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Activity</label>
          <Input list={ACTIVITY_DATALIST_ID} value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Run, gym, yoga…" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Minutes</label>
          <Input type="number" min="0" step="any" inputMode="decimal" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} className="w-20" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">kcal burned</label>
          <Input type="number" min="0" step="any" inputMode="decimal" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} className="w-24" />
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Notes (optional)</label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="how it felt, distance, sets…" />
        </div>
        <Button type="submit">{editingEntry ? "Save changes" : "Add exercise"}</Button>
        {editingEntry && (
          <Button type="button" variant="ghost" size="icon" aria-label="Cancel edit" onClick={onCancelEdit}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
