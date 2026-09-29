import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Reminder } from "@/lib/reminders";

export function ReminderList({ reminders, onEdit, onDelete }: { reminders: Reminder[]; onEdit: (reminder: Reminder) => void; onDelete: (id: string) => void }) {
  if (reminders.length === 0) {
    return <p className="text-sm text-muted-foreground">No reminders yet — add your first one above.</p>;
  }

  const sorted = [...reminders].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <ul className="divide-y divide-line">
      {sorted.map((reminder) => (
        <li key={reminder.id} className="flex items-center gap-3 py-2.5">
          <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">{reminder.time}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{reminder.label}</p>
            {reminder.onlyIfNothingLogged && <p className="text-xs text-muted-foreground">Only if nothing logged yet that day</p>}
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Edit reminder" onClick={() => onEdit(reminder)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Delete reminder" onClick={() => onDelete(reminder.id)}>
            <Trash2 className="size-3.5" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
