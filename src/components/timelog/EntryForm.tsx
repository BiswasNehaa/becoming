import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { makeId } from "@/lib/store";
import { findOverlap, minutesToTimeString, timeStringToMinutes } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

export function EntryForm({
  date,
  existingEntries,
  editingEntry,
  onSave,
  onCancelEdit,
}: {
  date: string;
  existingEntries: TimeEntry[];
  editingEntry: TimeEntry | null;
  onSave: (entry: TimeEntry) => void;
  onCancelEdit: () => void;
}) {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
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

  function reset() {
    setStart("09:00");
    setEnd("10:00");
    setCategoryId(CATEGORIES[0].id);
    setNote("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const startMin = timeStringToMinutes(start);
    const endMin = timeStringToMinutes(end);
    if (endMin <= startMin) {
      setError("End time has to be after the start time.");
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
              {CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Note (optional)</label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="what were you doing?" />
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
