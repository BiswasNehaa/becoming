import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { makeId } from "@/lib/store";
import { MEAL_TYPES, type FoodEntry, type MealType } from "@/lib/nutrition";

const numberField = (v: string) => (v.trim() === "" ? 0 : Number(v));

export function FoodEntryForm({
  date,
  editingEntry,
  onSave,
  onCancelEdit,
}: {
  date: string;
  editingEntry: FoodEntry | null;
  onSave: (entry: FoodEntry) => void;
  onCancelEdit: () => void;
}) {
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [fatG, setFatG] = useState("");
  const [fiberG, setFiberG] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingEntry) {
      setMealType(editingEntry.mealType);
      setName(editingEntry.name);
      setCalories(String(editingEntry.calories));
      setProteinG(String(editingEntry.proteinG));
      setCarbsG(String(editingEntry.carbsG));
      setFatG(String(editingEntry.fatG));
      setFiberG(String(editingEntry.fiberG));
      setError("");
    }
  }, [editingEntry]);

  function reset() {
    setName("");
    setCalories("");
    setProteinG("");
    setCarbsG("");
    setFatG("");
    setFiberG("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give the food a name.");
      return;
    }
    onSave({
      id: editingEntry?.id ?? makeId(),
      date,
      mealType,
      name: name.trim(),
      calories: numberField(calories),
      proteinG: numberField(proteinG),
      carbsG: numberField(carbsG),
      fatG: numberField(fatG),
      fiberG: numberField(fiberG),
    });
    if (!editingEntry) reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Meal</label>
          <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TYPES.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Food</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="2 eggs, toast, chai" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">kcal</label>
          <Input type="number" min="0" inputMode="numeric" value={calories} onChange={(e) => setCalories(e.target.value)} className="w-20" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Protein g</label>
          <Input type="number" min="0" inputMode="numeric" value={proteinG} onChange={(e) => setProteinG(e.target.value)} className="w-20" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Carbs g</label>
          <Input type="number" min="0" inputMode="numeric" value={carbsG} onChange={(e) => setCarbsG(e.target.value)} className="w-20" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Fat g</label>
          <Input type="number" min="0" inputMode="numeric" value={fatG} onChange={(e) => setFatG(e.target.value)} className="w-20" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Fiber g</label>
          <Input type="number" min="0" inputMode="numeric" value={fiberG} onChange={(e) => setFiberG(e.target.value)} className="w-20" />
        </div>
        <Button type="submit">{editingEntry ? "Save changes" : "Add food"}</Button>
        {editingEntry && (
          <Button type="button" variant="ghost" size="icon" aria-label="Cancel edit" onClick={onCancelEdit}>
            <X className="size-4" />
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
