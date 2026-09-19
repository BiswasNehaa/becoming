import { DonutChart, type DonutSegment } from "@/components/DonutChart";
import { getCategory, type Category } from "@/lib/categories";
import { formatDuration, MINUTES_IN_DAY, totalsByCategory, unaccountedMinutes } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

export function CategoryBreakdown({ entries, categories }: { entries: TimeEntry[]; categories: Category[] }) {
  const totals = totalsByCategory(entries);
  const unaccounted = unaccountedMinutes(entries);
  const rows = categories.filter((c) => totals[c.id]).sort((a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0));

  if (rows.length === 0 && unaccounted === MINUTES_IN_DAY) {
    return <p className="text-sm text-muted-foreground">Nothing logged yet today.</p>;
  }

  const accountedPct = Math.round(((MINUTES_IN_DAY - unaccounted) / MINUTES_IN_DAY) * 100);
  const segments: DonutSegment[] = rows.map((c) => ({ id: c.id, label: c.label, value: totals[c.id] ?? 0, color: c.color }));
  if (unaccounted > 0) {
    segments.push({ id: "unaccounted", label: "Unaccounted", value: unaccounted, color: "var(--line)" });
  }

  return (
    <div>
      <div className="mb-5 flex justify-center">
        <DonutChart
          segments={segments}
          size={168}
          thickness={24}
          center={
            <>
              <span className="font-display text-2xl font-bold">{accountedPct}%</span>
              <span className="text-[11px] text-muted-foreground">of the day</span>
            </>
          }
        />
      </div>
      <div className="space-y-3">
        {rows.map((category) => {
          const minutes = totals[category.id] ?? 0;
          const pct = Math.round((minutes / MINUTES_IN_DAY) * 100);
          const Icon = category.icon;
          return (
            <div key={category.id} className="flex items-center gap-3">
              <Icon className="size-4 shrink-0" style={{ color: category.color }} />
              <span className="w-32 shrink-0 truncate text-sm">{category.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: category.color }} />
              </div>
              <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">{formatDuration(minutes)}</span>
            </div>
          );
        })}
        {unaccounted > 0 && (
          <div className="flex items-center gap-3 border-t border-line pt-3">
            {(() => {
              const Icon = getCategory("other", categories).icon;
              return <Icon className="size-4 shrink-0 text-muted-foreground" />;
            })()}
            <span className="w-32 shrink-0 truncate text-sm text-muted-foreground">Unaccounted</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent">
              <div className="h-full rounded-full bg-line" style={{ width: `${Math.round((unaccounted / MINUTES_IN_DAY) * 100)}%` }} />
            </div>
            <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">{formatDuration(unaccounted)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
