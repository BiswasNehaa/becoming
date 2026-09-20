import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type Category } from "@/lib/categories";
import { makeId } from "@/lib/store";
import { findOverlap, minutesToTimeString, MINUTES_IN_DAY, timeStringToMinutes } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

const ADD_CATEGORY = "__add_category__";

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
  onAddCategory,
}: {
  date: string;
  existingEntries: TimeEntry[];
  editingEntry: TimeEntry | null;
  categories: Category[];
  onSave: (entry: TimeEntry) => void;
  onCancelEdit: () => void;
  onAddCategory: (label: string) => Category;
}) {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fixedIds = new Set(CATEGORIES.map((c) => c.id));
  const lifeCategories = categories.filter((c) => fixedIds.has(c.id));
  const yourCategories = categories.filter((c) => !fixedIds.has(c.id));

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

  function handleCategoryChange(value: string) {
    if (value === ADD_CATEGORY) {
      setAddingCategory(true);
      return;
    }
    setCategoryId(value);
  }

  function submitNewCategory() {
    if (!newCategoryName.trim()) return;
    const created = onAddCategory(newCategoryName.trim());
    // Deferred: the underlying Select needs its new <option> committed to
    // the DOM before it can accept this value — setting both in the same
    // tick gets silently reset back to empty by the select's own sync.
    setTimeout(() => setCategoryId(created.id), 0);
    setNewCategoryName("");
    setAddingCategory(false);
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
      setError("Say what it was — \"Other\" needs a note. Or use “+ Add category” to give it a real one instead.");
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
          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-44">
              <SelectValue>{categories.find((c) => c.id === categoryId)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Life</SelectLabel>
                {lifeCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              {yourCategories.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Your streaks</SelectLabel>
                  {yourCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              <SelectSeparator />
              <SelectItem value={ADD_CATEGORY} className="text-primary">
                <Plus className="size-3.5" /> Add category
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {addingCategory ? (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wide text-muted-foreground">New category name</label>
            <div className="flex gap-1">
              <Input
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitNewCategory();
                  }
                }}
                placeholder="e.g. Commute"
                className="w-36"
              />
              <Button type="button" size="sm" onClick={submitNewCategory}>
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cancel new category"
                onClick={() => {
                  setAddingCategory(false);
                  setNewCategoryName("");
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex min-w-40 flex-1 flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wide text-muted-foreground">{isOther ? "What is it?" : "Note (optional)"}</label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isOther ? "e.g. dentist appointment" : "what were you doing?"}
              className={isOther ? "border-primary" : undefined}
            />
          </div>
        )}
        <Button type="submit" disabled={addingCategory}>
          {editingEntry ? "Save changes" : "Add entry"}
        </Button>
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
