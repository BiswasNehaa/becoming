import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makeId } from "@/lib/store";
import type { Reminder } from "@/lib/reminders";

export function ReminderForm({
  editingReminder,
  onSave,
  onCancelEdit,
}: {
  editingReminder: Reminder | null;
  onSave: (reminder: Reminder) => void;
  onCancelEdit: () => void;
}) {
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("20:00");
  const [onlyIfNothingLogged, setOnlyIfNothingLogged] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingReminder) {
      setLabel(editingReminder.label);
      setTime(editingReminder.time);
      setOnlyIfNothingLogged(!!editingReminder.onlyIfNothingLogged);
      setError("");
    }
  }, [editingReminder]);

  function reset() {
    setLabel("");
    setTime("20:00");
    setOnlyIfNothingLogged(false);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) {
      setError("Say what the reminder is for.");
      return;
    }
    onSave({
      id: editingReminder?.id ?? makeId(),
      label: label.trim(),
      time,
      onlyIfNothingLogged: onlyIfNothingLogged || undefined,
      lastNotifiedDate: editingReminder?.lastNotifiedDate,
    });
    if (!editingReminder) reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Reminder</label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Take medicine, call mom…" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Time</label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-28" />
        </div>
        <Button type="submit">{editingReminder ? "Save changes" : "Add reminder"}</Button>
        {editingReminder && (
          <Button type="button" variant="ghost" size="icon" aria-label="Cancel edit" onClick={onCancelEdit}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={onlyIfNothingLogged} onChange={(e) => setOnlyIfNothingLogged(e.target.checked)} className="size-3.5 rounded border-line" />
        Only notify if I haven&rsquo;t logged anything yet that day
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
