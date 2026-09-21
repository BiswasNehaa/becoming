import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ExerciseEntry } from "@/lib/health";

export function ExerciseList({
  entries,
  onEdit,
  onDelete,
}: {
  entries: ExerciseEntry[];
  onEdit: (entry: ExerciseEntry) => void;
  onDelete: (id: string) => void;
}) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing logged yet — add your first activity above.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center gap-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{entry.activity}</p>
            {entry.notes && <p className="truncate text-xs text-muted-foreground">{entry.notes}</p>}
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {entry.durationMin}m · {Math.round(entry.caloriesBurned)} kcal
          </span>
          <Button type="button" variant="ghost" size="icon" aria-label="Edit exercise" onClick={() => onEdit(entry)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Delete exercise" onClick={() => onDelete(entry.id)}>
            <Trash2 className="size-3.5" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
