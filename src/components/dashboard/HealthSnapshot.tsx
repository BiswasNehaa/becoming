import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { totalCaloriesBurned, type ExerciseEntry, type StepsLog } from "@/lib/health";
import { todayId, useCollection } from "@/lib/store";

export function HealthSnapshot() {
  const { items: allExercise } = useCollection<ExerciseEntry>("exercise_entries");
  const { items: allSteps } = useCollection<StepsLog>("steps_logs");

  const today = todayId();
  const caloriesBurned = totalCaloriesBurned(allExercise.filter((e) => e.date === today));
  const steps = allSteps.find((s) => s.date === today)?.steps ?? 0;

  return (
    <Link to="/health">
      <Card className="glass-panel h-full rounded-2xl border-0 p-4 shadow-none transition-colors hover:bg-accent/40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <HeartPulse className="size-3.5" /> Health
        </div>
        <p className="mt-2 font-display text-lg font-bold">{Math.round(caloriesBurned)} kcal</p>
        <p className="text-xs text-muted-foreground">{steps.toLocaleString()} steps</p>
      </Card>
    </Link>
  );
}
