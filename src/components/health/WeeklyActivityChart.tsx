import type { DayActivity } from "@/lib/healthReview";
import { todayId } from "@/lib/store";

function dayLabel(dateId: string): string {
  return new Date(`${dateId}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1);
}

/** Calories-burned per day for the last 7 days — a plain hand-rolled bar
 * chart (same approach as ProgressRing/StreakBoard) rather than pulling in
 * a charting library for one simple weekly view. */
export function WeeklyActivityChart({ days }: { days: DayActivity[] }) {
  const max = Math.max(1, ...days.map((d) => d.caloriesBurned));
  const today = todayId();

  return (
    <div className="flex items-end gap-2" style={{ height: 96 }}>
      {days.map((d) => {
        const heightPct = Math.max(2, Math.round((d.caloriesBurned / max) * 100));
        const isToday = d.date === today;
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: d.caloriesBurned > 0 ? "var(--rose)" : "var(--line)",
                  opacity: isToday ? 1 : 0.75,
                }}
                title={`${d.caloriesBurned} kcal`}
              />
            </div>
            <span className={isToday ? "text-[11px] font-semibold text-foreground" : "text-[11px] text-muted-foreground"}>{dayLabel(d.date)}</span>
          </div>
        );
      })}
    </div>
  );
}
