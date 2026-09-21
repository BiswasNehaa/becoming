import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayNavHeader } from "@/components/DayNavHeader";
import { FoodEntryForm } from "@/components/nutrition/FoodEntryForm";
import { MacroSummary } from "@/components/nutrition/MacroSummary";
import { MealList } from "@/components/nutrition/MealList";
import { NutritionWeeklyReviewCard } from "@/components/nutrition/NutritionWeeklyReviewCard";
import { TargetsEditor } from "@/components/nutrition/TargetsEditor";
import { WaterTracker } from "@/components/nutrition/WaterTracker";
import { useDayNav } from "@/hooks/useDayNav";
import { computeNutritionWeekStats, generateNutritionWeeklyReview } from "@/lib/nutritionReview";
import { lastDateIds } from "@/lib/streaks";
import { useCollection } from "@/lib/store";
import { DEFAULT_TARGETS, totalMacros, type FoodEntry, type NutritionTargets, type WaterEntry } from "@/lib/nutrition";

export function Nutrition() {
  const { viewDate, isToday, label, goPrev, goNext, goToday } = useDayNav();
  const { items: allFood, setItems: setAllFood, loading } = useCollection<FoodEntry>("food_entries");
  const { items: allWater, setItems: setAllWater } = useCollection<WaterEntry>("water_entries");
  const { items: targetDocs, setItems: setTargetDocs } = useCollection<NutritionTargets>("nutrition_targets");
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);

  // Merge (not just fall back to) DEFAULT_TARGETS — an existing saved doc
  // from before waterMl was added won't have that field, and a bare `??`
  // would leave it undefined instead of picking up the new default.
  const targets = { ...DEFAULT_TARGETS, ...targetDocs[0] };
  const dayFood = useMemo(() => allFood.filter((e) => e.date === viewDate), [allFood, viewDate]);
  const dayWater = useMemo(() => allWater.filter((e) => e.date === viewDate), [allWater, viewDate]);
  const totals = useMemo(() => totalMacros(dayFood), [dayFood]);

  const weeklyReview = useMemo(() => {
    const thisWeekDays = lastDateIds(7);
    const lastWeekDays = lastDateIds(14).slice(0, 7);
    const thisWeek = computeNutritionWeekStats(allFood, allWater, thisWeekDays, targets);
    const lastWeek = computeNutritionWeekStats(allFood, allWater, lastWeekDays, targets);
    return generateNutritionWeeklyReview(thisWeek, lastWeek, targets, thisWeekDays.length);
  }, [allFood, allWater, targets]);

  function saveEntry(entry: FoodEntry) {
    setAllFood((prev) => {
      const exists = prev.some((e) => e.id === entry.id);
      return exists ? prev.map((e) => (e.id === entry.id ? entry : e)) : [...prev, entry];
    });
    setEditingEntry(null);
  }

  function deleteEntry(id: string) {
    setAllFood((prev) => prev.filter((e) => e.id !== id));
    if (editingEntry?.id === id) setEditingEntry(null);
  }

  function saveTargets(next: NutritionTargets) {
    setTargetDocs([next]);
  }

  function addWater(entry: WaterEntry) {
    setAllWater((prev) => [...prev, entry]);
  }

  function removeWater(id: string) {
    setAllWater((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="subtle-rise space-y-5">
      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <DayNavHeader label={label} isToday={isToday} onPrev={goPrev} onNext={goNext} onToday={goToday} />
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <MacroSummary totals={totals} targets={targets} />
            <WaterTracker date={viewDate} entries={dayWater} targetMl={targets.waterMl} onAdd={addWater} onRemove={removeWater} />
          </>
        )}
        <div className="mt-4 border-t border-line pt-4">
          <TargetsEditor targets={targets} onSave={saveTargets} />
        </div>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">{editingEntry ? "Edit food" : "Log food"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <FoodEntryForm date={viewDate} editingEntry={editingEntry} onSave={saveEntry} onCancelEdit={() => setEditingEntry(null)} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Meals</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <MealList entries={dayFood} onEdit={setEditingEntry} onDelete={deleteEntry} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Weekly review</p>
          <CardTitle className="mt-1 font-display text-2xl font-semibold">Your week</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-5">
          <NutritionWeeklyReviewCard review={weeklyReview} />
        </CardContent>
      </Card>
    </div>
  );
}
