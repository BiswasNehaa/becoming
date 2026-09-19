import { Check } from "lucide-react";

import { PRACTICE_ICONS, type Practice } from "@/lib/practices";
import { formatDuration } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export function focusStatus(minutes: number, targetMinutes?: number): { label: string; tone: string } {
  if (!targetMinutes) {
    return minutes > 0 ? { label: "logged", tone: "text-[var(--sage)]" } : { label: "not started", tone: "text-muted-foreground" };
  }
  if (minutes >= targetMinutes) return { label: "complete", tone: "text-[var(--sage)]" };
  if (minutes > 0) return { label: `${formatDuration(targetMinutes - minutes)} to go`, tone: "text-[var(--amber)]" };
  return { label: "not started", tone: "text-muted-foreground" };
}

export function TodayFocusList({ practices, dayEntries }: { practices: Practice[]; dayEntries: TimeEntry[] }) {
  if (practices.length === 0) {
    return <p className="text-sm text-muted-foreground">Add a streak to see today&rsquo;s focus here.</p>;
  }

  return (
    <div className="grid gap-2">
      {practices.map((p) => {
        const minutes = dayEntries.filter((e) => e.categoryId === p.id).reduce((sum, e) => sum + Math.max(0, e.endMin - e.startMin), 0);
        const status = focusStatus(minutes, p.targetMinutes);
        const done = status.label === "complete" || (!p.targetMinutes && minutes > 0);
        const Icon = PRACTICE_ICONS[p.icon];
        return (
          <div key={p.id} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3", done ? "bg-accent/50" : "bg-accent/25")}>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `color-mix(in oklab, ${p.color} 15%, transparent)`, color: p.color }}>
              {done ? <Check className="size-4" /> : <Icon className="size-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate text-sm font-semibold", !done && "text-muted-foreground")}>{p.label}</span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {minutes > 0 ? formatDuration(minutes) : "0m"}
                {p.targetMinutes ? ` · ${p.targetMinutes}m target` : ""}
              </span>
            </span>
            <span className={cn("shrink-0 text-xs font-medium", status.tone)}>{status.label}</span>
          </div>
        );
      })}
    </div>
  );
}
