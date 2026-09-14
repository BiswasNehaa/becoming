import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MEAL_TYPES, type FoodEntry } from "@/lib/nutrition";

export function MealList({
  entries,
  onEdit,
  onDelete,
}: {
  entries: FoodEntry[];
  onEdit: (entry: FoodEntry) => void;
  onDelete: (id: string) => void;
}) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing logged yet — add your first food above.</p>;
  }

  return (
    <div className="space-y-5">
      {MEAL_TYPES.map((meal) => {
        const items = entries.filter((e) => e.mealType === meal.id);
        if (items.length === 0) return null;
        const mealCalories = items.reduce((sum, e) => sum + e.calories, 0);
        return (
          <div key={meal.id}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{meal.label}</h3>
              <span className="text-xs text-muted-foreground">{Math.round(mealCalories)} kcal</span>
            </div>
            <ul className="divide-y divide-line">
              {items.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-sm">{entry.name}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {Math.round(entry.calories)} kcal · P{Math.round(entry.proteinG)} C{Math.round(entry.carbsG)} F{Math.round(entry.fatG)}
                  </span>
                  <Button type="button" variant="ghost" size="icon" aria-label="Edit food" onClick={() => onEdit(entry)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Delete food" onClick={() => onDelete(entry.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
