import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainGrid } from "@/components/analysis/DomainGrid";
import { MovementSummary } from "@/components/analysis/MovementSummary";
import { computeDomainStats, generateAnalysisMovements, periodDateRanges, type AnalysisData, type AnalysisPeriod } from "@/lib/analysis";
import type { ExerciseEntry, StepsLog } from "@/lib/health";
import type { FoodEntry, WaterEntry } from "@/lib/nutrition";
import type { Practice } from "@/lib/practices";
import type { Book, ReadingSession } from "@/lib/reading";
import type { DailyReflection } from "@/lib/reflections";
import { useCollection } from "@/lib/store";
import type { TimeEntry } from "@/lib/types";

const PERIOD_LABEL: Record<AnalysisPeriod, string> = { day: "Today", week: "This week", month: "This month" };

export function Analysis() {
  const [period, setPeriod] = useState<AnalysisPeriod>("week");

  const { items: entries } = useCollection<TimeEntry>("time_entries");
  const { items: practices } = useCollection<Practice>("practices");
  const { items: food } = useCollection<FoodEntry>("food_entries");
  const { items: water } = useCollection<WaterEntry>("water_entries");
  const { items: books } = useCollection<Book>("books");
  const { items: readingSessions } = useCollection<ReadingSession>("reading_sessions");
  const { items: exercise } = useCollection<ExerciseEntry>("exercise_entries");
  const { items: steps } = useCollection<StepsLog>("steps_logs");
  const { items: reflections } = useCollection<DailyReflection>("reflections");

  const data: AnalysisData = { entries, practices, food, water, books, readingSessions, exercise, steps, reflections };

  const { stats, movements } = useMemo(() => {
    const { thisPeriod, lastPeriod } = periodDateRanges(period);
    const thisStats = computeDomainStats(thisPeriod, data);
    const lastStats = computeDomainStats(lastPeriod, data);
    return { stats: thisStats, movements: generateAnalysisMovements(thisStats, lastStats) };
  }, [period, entries, practices, food, water, books, readingSessions, exercise, steps, reflections]);

  return (
    <div className="subtle-rise space-y-5">
      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="flex-row items-center justify-between p-0 pb-4 space-y-0">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Analysis</p>
            <CardTitle className="mt-1 font-display text-2xl font-semibold">{PERIOD_LABEL[period]}, everything together</CardTitle>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as AnalysisPeriod)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <DomainGrid stats={stats} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Compared to the {period} before</p>
          <CardTitle className="mt-1 font-display text-xl font-semibold">What&rsquo;s shifting</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <MovementSummary improving={movements.improving} lagging={movements.lagging} />
        </CardContent>
      </Card>
    </div>
  );
}
