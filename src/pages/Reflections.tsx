import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { DayNavHeader } from "@/components/DayNavHeader";
import { SyncErrorBanner } from "@/components/SyncErrorBanner";
import { ReflectionForm } from "@/components/reflections/ReflectionForm";
import { useDayNav } from "@/hooks/useDayNav";
import { useCollection } from "@/lib/store";
import { emptyReflection, type DailyReflection } from "@/lib/reflections";

export function Reflections() {
  const { viewDate, isToday, label, goPrev, goNext, goToday } = useDayNav();
  const { items, setItems, loading, syncError } = useCollection<DailyReflection>("reflections");

  const reflection = useMemo(() => items.find((r) => r.date === viewDate) ?? emptyReflection(viewDate), [items, viewDate]);

  function save(next: DailyReflection) {
    setItems((prev) => {
      const exists = prev.some((r) => r.date === next.date);
      return exists ? prev.map((r) => (r.date === next.date ? next : r)) : [...prev, next];
    });
  }

  return (
    <div className="subtle-rise space-y-5">
      <SyncErrorBanner error={syncError} />

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <DayNavHeader label={label} isToday={isToday} onPrev={goPrev} onNext={goNext} onToday={goToday} />
        <p className="mb-6 max-w-xl text-sm leading-6 text-muted-foreground">
          A short reflection keeps the log useful without turning the day into a grade.
        </p>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : <ReflectionForm reflection={reflection} onSave={save} />}
      </Card>
    </div>
  );
}
