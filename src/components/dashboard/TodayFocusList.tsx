import { Check } from "lucide-react";

import { PRACTICE_ICONS, type Practice } from "@/lib/practices";
import { formatDuration } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TodayFocusList({ practices, dayEntries }: { practices: Practice[]; dayEntries: TimeEntry[] }) {
  if (practices.length === 0) {
    return <p className="text-sm text-muted-foreground">Add a streak to see today&rsquo;s focus here.</p>;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {practices.map((p) => {
        const minutes = dayEntries.filter((e) => e.categoryId === p.id).reduce((sum, e) => sum + Math.max(0, e.endMin - e.startMin), 0);
        const done = minutes > 0;
        const Icon = PRACTICE_ICONS[p.icon];
        return (
          <div key={p.id} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3", done ? "bg-accent/50" : "bg-accent/25")}>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `color-mix(in oklab, ${p.color} 15%, transparent)`, color: p.color }}>
              {done ? <Check className="size-4" /> : <Icon className="size-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate text-sm font-semibold", !done && "text-muted-foreground")}>{p.label}</span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">{done ? formatDuration(minutes) : "Not logged yet"}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
