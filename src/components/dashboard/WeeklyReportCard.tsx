import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Practice } from "@/lib/practices";
import { formatDuration } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";
import { practiceWeeklyBars, weeklyMinutesTrend, type WeeklyBar } from "@/lib/weeklyReport";

function Bar({ bar }: { bar: WeeklyBar }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span>{bar.label}</span>
        <span className="text-muted-foreground">{bar.pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-accent">
        <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, backgroundColor: bar.color }} />
      </div>
    </div>
  );
}

export function WeeklyReportCard({ practices, entries }: { practices: Practice[]; entries: TimeEntry[] }) {
  const bars = practiceWeeklyBars(practices, entries);
  const trend = weeklyMinutesTrend(entries);
  const trendDelta = trend.thisWeek - trend.lastWeek;
  const hasHistory = bars.some((b) => b.pct > 0) || trend.lastWeek > 0;

  const ranked = [...bars].sort((a, b) => b.pct - a.pct);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  return (
    <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8 lg:col-span-2">
      <CardHeader className="p-0">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Weekly report</p>
        <CardTitle className="mt-1 font-display text-2xl font-semibold">Your week</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-5">
        {bars.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add a streak to see a weekly breakdown here.</p>
        ) : (
          <>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {bars.map((bar) => (
                <Bar key={bar.id} bar={bar} />
              ))}
            </div>

            {hasHistory && (
              <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
                {best && best.pct > 0 && (
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Most consistent</p>
                    <p className="mt-2 text-sm leading-5">
                      {best.label}
                      <br />
                      {Math.round((best.pct / 100) * 7)} of 7 days
                    </p>
                  </div>
                )}
                {worst && worst.id !== best?.id && (
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Could use attention</p>
                    <p className="mt-2 text-sm leading-5">
                      {worst.label}
                      <br />
                      {Math.round((worst.pct / 100) * 7)} of 7 days
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Logged time</p>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground">
                    {formatDuration(trend.thisWeek)} this week
                    {trend.lastWeek > 0 && (
                      <>
                        {" "}
                        ({trendDelta === 0 ? "steady" : `${trendDelta > 0 ? "+" : "−"}${formatDuration(Math.abs(trendDelta))} vs last week`})
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
