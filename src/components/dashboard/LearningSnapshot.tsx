import { BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { computeCategoryStreak } from "@/lib/streaks";
import { todayId, useCollection } from "@/lib/store";
import { formatDuration } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

export function LearningSnapshot() {
  const { items: timeEntries } = useCollection<TimeEntry>("time_entries");

  const monthPrefix = todayId().slice(0, 7);
  const monthMinutes = timeEntries
    .filter((e) => e.categoryId === "learning" && e.date.startsWith(monthPrefix))
    .reduce((sum, e) => sum + Math.max(0, e.endMin - e.startMin), 0);
  const streak = computeCategoryStreak("learning", timeEntries);

  return (
    <Link to="/learning">
      <Card className="glass-panel h-full rounded-2xl border-0 p-4 shadow-none transition-colors hover:bg-accent/40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <BrainCircuit className="size-3.5" /> Learning
        </div>
        <p className="mt-2 font-display text-xl font-bold">{formatDuration(monthMinutes)}</p>
        <p className="mt-1 text-xs text-muted-foreground">this month · {streak.current}d streak</p>
      </Card>
    </Link>
  );
}
