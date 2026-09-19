import { Utensils } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ProgressRing";
import { DEFAULT_TARGETS, totalMacros, type FoodEntry, type NutritionTargets } from "@/lib/nutrition";
import { todayId, useCollection } from "@/lib/store";

export function NutritionSnapshot() {
  const { items: allFood } = useCollection<FoodEntry>("food_entries");
  const { items: targetDocs } = useCollection<NutritionTargets>("nutrition_targets");

  const today = todayId();
  const totals = totalMacros(allFood.filter((e) => e.date === today));
  const targets = targetDocs[0] ?? DEFAULT_TARGETS;
  const pct = targets.calories > 0 ? Math.round((totals.calories / targets.calories) * 100) : 0;

  return (
    <Link to="/nutrition">
      <Card className="glass-panel h-full rounded-2xl border-0 p-4 shadow-none transition-colors hover:bg-accent/40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Utensils className="size-3.5" /> Nutrition
        </div>
        <div className="mt-2 flex items-center gap-3">
          <ProgressRing percent={pct} size={48} thickness={5} color="var(--sage)">
            <span className="text-[10px] font-bold">{pct}%</span>
          </ProgressRing>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold">{Math.round(totals.calories)} kcal</p>
            <p className="text-xs text-muted-foreground">{Math.round(totals.proteinG)}g protein</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
