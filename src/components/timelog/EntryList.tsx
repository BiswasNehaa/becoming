import { Pencil, Trash2 } from "lucide-react";

import { getCategory, type Category } from "@/lib/categories";
import { formatClock, formatDuration, sortByStart } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

export function EntryList({
  entries,
  categories,
  onEdit,
  onDelete,
}: {
  entries: TimeEntry[];
  categories: Category[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: string) => void;
}) {
  const sorted = sortByStart(entries);

  if (sorted.length === 0) {
    return <p className="text-sm text-muted-foreground">No entries yet — add your first block of the day above.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {sorted.map((entry) => {
        const category = getCategory(entry.categoryId, categories);
        const Icon = category.icon;
        return (
          <li key={entry.id} className="group flex items-center gap-2.5 py-1.5">
            <Icon className="size-3.5 shrink-0" style={{ color: category.color }} />
            <span className="w-24 shrink-0 text-[11px] tabular-nums text-muted-foreground">
              {formatClock(entry.startMin)}–{formatClock(entry.endMin)}
            </span>
            <span className="w-28 shrink-0 truncate text-sm font-medium">{category.label}</span>
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{entry.note}</span>
            <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{formatDuration(entry.endMin - entry.startMin)}</span>
            <button
              type="button"
              aria-label="Edit entry"
              onClick={() => onEdit(entry)}
              className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Delete entry"
              onClick={() => onDelete(entry.id)}
              className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
