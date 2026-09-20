import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/lib/categories";
import { makeId } from "@/lib/store";
import { findOverlap, minutesToTimeString, MINUTES_IN_DAY, timeStringToMinutes } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

/** Where the next entry should start by default: right after whatever
 * currently ends latest today, so logging stays a continuous line
 * instead of retyping 9–10 every time. Falls back to 9am on an empty day. */
function nextStartMinutes(entries: TimeEntry[]): number {
  if (entries.length === 0) return 9 * 60;
  const latestEnd = Math.max(...entries.map((e) => e.endMin));
  return Math.min(latestEnd, MINUTES_IN_DAY - 1);
}

export function EntryForm({
  date,
  existingEntries,
  editingEntry,
  categories,
  onSave,
  onCancelEdit,
}: {
  date: string;
  existingEntries: TimeEntry[];
  editingEntry: TimeEntry | null;
  categories: Category[];
  onSave: (entry: TimeEntry) => void;
  onCancelEdit: () => void;
}) {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingEntry) {
      setStart(minutesToTimeString(editingEntry.startMin));
      setEnd(minutesToTimeString(editingEntry.endMin));
      setCategoryId(editingEntry.categoryId);
      setNote(editingEntry.note ?? "");
      setError("");
    }
  }, [editingEntry]);

  // Keeps the form's default range following the day's latest entry —
  // re-runs whenever existingEntries changes (a new entry was added, or
  // you navigated to a different day) as long as you're not mid-edit.
  useEffect(() => {
    if (editingEntry) return;
    const startMin = nextStartMinutes(existingEntries);
    setStart(minutesToTimeString(startMin));
    setEnd(minutesToTimeString(Math.min(startMin + 60, MINUTES_IN_DAY - 1)));
  }, [existingEntries, editingEntry]);

  function reset() {
    setCategoryId(categories[0].id);
    setNote("");
    setError("");
  }

  const isOther = categoryId === "other";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const startMin = timeStringToMinutes(start);
    const endMin = timeStringToMinutes(end);
    if (endMin <= startMin) {
      setError("End time has to be after the start time.");
      return;
    }
    if (isOther && !note.trim()) {
      setError("Say what it was — \"Other\" needs a note.");
      return;
    }
    const overlap = findOverlap(existingEntries, startMin, endMin, editingEntry?.id);
    if (overlap) {
      setError(`That overlaps an existing entry (${minutesToTimeString(overlap.startMin)}–${minutesToTimeString(overlap.endMin)}). Adjust the range or edit that one instead.`);
      return;
    }
    onSave({
      id: editingEntry?.id ?? makeId(),
      date,
      startMin,
      endMin,
      categoryId,
      note: note.trim() || undefined,
    });
    if (!editingEntry) reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">From</label>
          <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-28" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">To</label>
          <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-28" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Category</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">{isOther ? "What is it?" : "Note (optional)"}</label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={isOther ? "e.g. dentist appointment" : "what were you doing?"}
            className={isOther ? "border-primary" : undefined}
          />
        </div>
        <Button type="submit">{editingEntry ? "Save changes" : "Add entry"}</Button>
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
