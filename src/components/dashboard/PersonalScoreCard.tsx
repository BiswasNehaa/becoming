import { Activity } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DailyReflection } from "@/lib/reflections";
import type { FoodEntry } from "@/lib/nutrition";
import type { Practice } from "@/lib/practices";
import { useCollection } from "@/lib/store";
import type { TimeEntry } from "@/lib/types";
import { nutritionWeeklyPct, personalGrowthScore, practiceWeeklyBars, reflectionWeeklyPct } from "@/lib/weeklyReport";

const DIMENSIONS = [
  { key: "practiceAvg", label: "Practices", color: "var(--glow)" },
  { key: "reflectionPct", label: "Reflection", color: "var(--sky)" },
  { key: "nutritionPct", label: "Nutrition logging", color: "var(--amber)" },
] as const;

export function PersonalScoreCard({ practices, entries }: { practices: Practice[]; entries: TimeEntry[] }) {
  const { items: reflections } = useCollection<DailyReflection>("reflections");
  const { items: food } = useCollection<FoodEntry>("food_entries");

  const bars = practiceWeeklyBars(practices, entries);
  const score = personalGrowthScore(bars, reflectionWeeklyPct(reflections), nutritionWeeklyPct(food));

  return (
    <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Transparent score</p>
          <p className="mt-1 font-display text-2xl font-semibold">Personal growth</p>
        </div>
        <Activity className="size-5 text-primary" />
      </div>
      <div className="mt-5 flex items-end gap-2">
        <span className="font-display text-5xl font-bold">{score.overall}</span>
        <span className="mb-2 text-sm text-muted-foreground">/ 100</span>
      </div>
      <p className="mt-2 text-sm leading-5 text-muted-foreground">
        Average of the last 7 days across practices, reflection, and nutrition logging &mdash; not a grade on any single day.
      </p>
      <CardContent className="mt-5 space-y-3 p-0">
        {DIMENSIONS.map((dim) => (
          <div key={dim.key}>
            <div className="mb-1 flex justify-between text-xs">
              <span>{dim.label}</span>
              <span className="text-muted-foreground">{score[dim.key]}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-accent">
              <div className="h-full rounded-full" style={{ width: `${score[dim.key]}%`, backgroundColor: dim.color }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
