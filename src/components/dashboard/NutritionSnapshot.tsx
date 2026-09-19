import { Utensils } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { DEFAULT_TARGETS, totalMacros, type FoodEntry, type NutritionTargets } from "@/lib/nutrition";
import { todayId, useCollection } from "@/lib/store";

export function NutritionSnapshot() {
  const { items: allFood } = useCollection<FoodEntry>("food_entries");
  const { items: targetDocs } = useCollection<NutritionTargets>("nutrition_targets");

  const today = todayId();
  const totals = totalMacros(allFood.filter((e) => e.date === today));
  const targets = targetDocs[0] ?? DEFAULT_TARGETS;

  return (
    <Link to="/nutrition">
      <Card className="glass-panel h-full rounded-2xl border-0 p-4 shadow-none transition-colors hover:bg-accent/40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Utensils className="size-3.5" /> Nutrition
        </div>
        <p className="mt-2 font-display text-xl font-bold">
          {Math.round(totals.calories)} <span className="text-sm font-normal text-muted-foreground">/ {targets.calories} kcal</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{Math.round(totals.proteinG)}g protein today</p>
      </Card>
    </Link>
  );
}
