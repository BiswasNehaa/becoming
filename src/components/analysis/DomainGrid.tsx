import type { DomainStat } from "@/lib/analysis";

export function DomainGrid({ stats }: { stats: DomainStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => {
        const pct = s.totalDays > 0 ? Math.round((s.daysActive / s.totalDays) * 100) : 0;
        return (
          <div key={s.key} className="rounded-2xl bg-accent/25 p-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{s.label}</span>
              <span className="text-muted-foreground">
                {s.daysActive}/{s.totalDays}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-accent">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: s.color }} />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{s.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
