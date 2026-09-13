import { getCategory } from "@/lib/categories";
import { formatClock, formatDuration, MINUTES_IN_DAY } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const TICKS = [0, 360, 720, 1080, 1440];

export function DayTimeline({ entries }: { entries: TimeEntry[] }) {
  return (
    <div>
      <div className="relative h-10 w-full overflow-hidden rounded-xl bg-accent">
        {entries.map((entry) => {
          const category = getCategory(entry.categoryId);
          const left = (entry.startMin / MINUTES_IN_DAY) * 100;
          const width = ((entry.endMin - entry.startMin) / MINUTES_IN_DAY) * 100;
          return (
            <div
              key={entry.id}
              title={`${category.label} · ${formatClock(entry.startMin)}–${formatClock(entry.endMin)} · ${formatDuration(entry.endMin - entry.startMin)}`}
              className="absolute top-0 h-full first:rounded-l-xl last:rounded-r-xl"
              style={{ left: `${left}%`, width: `${width}%`, backgroundColor: category.color }}
            />
          );
        })}
      </div>
      <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
        {TICKS.map((minute) => (
          <span
            key={minute}
            className={cn("absolute -translate-x-1/2", minute === 0 && "translate-x-0", minute === MINUTES_IN_DAY && "-translate-x-full")}
            style={{ left: `${(minute / MINUTES_IN_DAY) * 100}%` }}
          >
            {formatClock(minute === MINUTES_IN_DAY ? 0 : minute)}
          </span>
        ))}
      </div>
    </div>
  );
}
