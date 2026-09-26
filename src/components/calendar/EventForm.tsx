import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makeId, todayId } from "@/lib/store";
import type { CalendarEvent } from "@/lib/calendarEvents";

export function EventForm({
  editingEvent,
  onSave,
  onCancelEdit,
}: {
  editingEvent: CalendarEvent | null;
  onSave: (event: CalendarEvent) => void;
  onCancelEdit: () => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayId());
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDate(editingEvent.date);
      setTime(editingEvent.time ?? "");
      setNotes(editingEvent.notes ?? "");
      setError("");
    }
  }, [editingEvent]);

  function reset() {
    setTitle("");
    setDate(todayId());
    setTime("");
    setNotes("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give the event a title.");
      return;
    }
    if (!date) {
      setError("Pick a date.");
      return;
    }
    onSave({
      id: editingEvent?.id ?? makeId(),
      title: title.trim(),
      date,
      time: time.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    if (!editingEvent) reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Event</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Team meeting" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-36" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Time (optional)</label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-28" />
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Notes (optional)</label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="where, who, what to bring…" />
        </div>
        <Button type="submit">{editingEvent ? "Save changes" : "Add event"}</Button>
        {editingEvent && (
          <Button type="button" variant="ghost" size="icon" aria-label="Cancel edit" onClick={onCancelEdit}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
