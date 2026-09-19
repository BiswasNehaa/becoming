import { Lightbulb } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Practice } from "@/lib/practices";
import { generateWeeklyInsight, practiceWeekOverWeek, type InsightPill } from "@/lib/weeklyReport";
import type { TimeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const PILL_TONE: Record<InsightPill["tone"], string> = {
  up: "bg-[var(--sage)]/15 text-[var(--sage)]",
  down: "bg-[var(--rose)]/15 text-[var(--rose)]",
  steady: "bg-[var(--sky)]/15 text-[var(--sky)]",
};

export function InsightBanner({ practices, entries }: { practices: Practice[]; entries: TimeEntry[] }) {
  const movers = practiceWeekOverWeek(practices, entries);
  const insight = generateWeeklyInsight(movers);

  return (
    <Card className="glass-panel relative flex h-full flex-col overflow-hidden rounded-3xl border-0 p-6 shadow-none sm:p-8">
      <div className="rainbow-bar absolute inset-y-0 left-0 w-1" />
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Lightbulb className="size-4 text-primary" /> Insight from your week
      </div>
      {insight ? (
        <>
          <p className="mt-3 max-w-3xl font-display text-xl font-semibold leading-snug sm:text-2xl">{insight.headline}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{insight.detail}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {insight.pills.map((pill) => (
              <span key={pill.label} className={cn("rounded-full px-3 py-1 font-medium", PILL_TONE[pill.tone])}>
                {pill.label}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center">
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Once you&rsquo;ve logged a few days across a couple of streaks, this will turn into a real "X is up, Y is down" comparison &mdash; there&rsquo;s not enough history yet to say anything true.
          </p>
        </div>
      )}
    </Card>
  );
}
