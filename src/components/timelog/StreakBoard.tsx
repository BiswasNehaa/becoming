import { PracticeManager } from "@/components/timelog/PracticeManager";
import { PRACTICE_ICONS, type Practice, type PracticeIconKey } from "@/lib/practices";
import { todayId } from "@/lib/store";
import { computeCategoryStreak, lastDateIds, loggedDatesForCategory } from "@/lib/streaks";
import { formatDuration } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

const STRIP_DAYS = 21;

export function StreakBoard({
  entries,
  practices,
  onAddPractice,
  onRemovePractice,
}: {
  entries: TimeEntry[];
  practices: Practice[];
  onAddPractice: (label: string, icon: PracticeIconKey) => void;
  onRemovePractice: (id: string) => void;
}) {
  const days = lastDateIds(STRIP_DAYS);
  const today = todayId();

  return (
    <div>
      <PracticeManager practices={practices} onAdd={onAddPractice} onRemove={onRemovePractice} />
      <div className="space-y-1">
        {practices.map((practice) => {
          const streak = computeCategoryStreak(practice.id, entries);
          const loggedDates = loggedDatesForCategory(practice.id, entries);
          const Icon = PRACTICE_ICONS[practice.icon];
          return (
            <div key={practice.id} className="flex items-center gap-2 border-b border-line py-2.5 last:border-b-0 sm:gap-3">
              <Icon className="size-4 shrink-0" style={{ color: practice.color }} />
              <span className="w-16 shrink-0 truncate text-sm font-medium sm:w-28">{practice.label}</span>
              <div className="flex min-w-0 flex-1 gap-[2px] overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {days.map((day) => {
                  const done = loggedDates.has(day);
                  const isToday = day === today;
                  return (
                    <div
                      key={day}
                      title={day}
                      className="h-3.5 w-2.5 shrink-0 rounded-[3px] border sm:w-3.5"
                      style={{
                        backgroundColor: done ? practice.color : "transparent",
                        borderColor: done ? practice.color : "var(--line)",
                        boxShadow: isToday ? `0 0 0 1.5px var(--card), 0 0 0 3px ${practice.color}` : undefined,
                      }}
                    />
                  );
                })}
              </div>
              <span className="w-10 shrink-0 text-right text-xs font-semibold" style={{ color: practice.color }}>
                {streak.current}d
              </span>
              <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{streak.last7Count}/7</span>
              <span className="hidden w-14 shrink-0 text-right text-xs text-muted-foreground sm:block">{formatDuration(streak.last7Minutes)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
