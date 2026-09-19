import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { MOODS, type DailyReflection } from "@/lib/reflections";
import { todayId, useCollection } from "@/lib/store";

export function ReflectionSnapshot() {
  const { items } = useCollection<DailyReflection>("reflections");
  const today = items.find((r) => r.date === todayId());
  const mood = today?.mood ? MOODS.find((m) => m.id === today.mood) : null;
  const checkedCount = today ? Object.values(today.checks).filter(Boolean).length : 0;

  return (
    <Link to="/reflections">
      <Card className="glass-panel h-full rounded-2xl border-0 p-4 shadow-none transition-colors hover:bg-accent/40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <PenLine className="size-3.5" /> Reflection
        </div>
        {mood ? (
          <>
            <p className="mt-2 font-display text-xl font-bold">
              {mood.emoji} {mood.label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{checkedCount}/7 checked in today</p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">How did today feel?</p>
        )}
      </Card>
    </Link>
  );
}
