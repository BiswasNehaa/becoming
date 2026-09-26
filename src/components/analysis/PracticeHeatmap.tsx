import { PRACTICE_ICONS, type Practice } from "@/lib/practices";
import { todayId } from "@/lib/store";
import type { HeatmapColumn } from "@/lib/heatmap";

export function PracticeHeatmap({ practice, columns }: { practice: Practice; columns: HeatmapColumn[] }) {
  const Icon = PRACTICE_ICONS[practice.icon];
  const today = todayId();

  return (
    <div className="flex items-center gap-3">
      <div className="flex w-28 shrink-0 items-center gap-1.5 sm:w-32">
        <Icon className="size-3.5 shrink-0" style={{ color: practice.color }} />
        <span className="truncate text-sm font-medium">{practice.label}</span>
      </div>
      <div className="flex min-w-0 gap-[3px] overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {columns.map((col, i) => (
          <div key={i} className="flex shrink-0 flex-col gap-[3px]">
            {col.map((cell) => {
              const isToday = cell.date === today;
              return (
                <div
                  key={cell.date}
                  title={`${cell.date}: ${Math.round(cell.intensity * 100)}%`}
                  className="size-2.5 rounded-[2px]"
                  style={{
                    backgroundColor: cell.intensity > 0 ? practice.color : "var(--line)",
                    opacity: cell.intensity > 0 ? Math.max(0.25, cell.intensity) : 0.35,
                    boxShadow: isToday ? `0 0 0 1px var(--card), 0 0 0 2px ${practice.color}` : undefined,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
