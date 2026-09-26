import { PracticeHeatmap } from "@/components/analysis/PracticeHeatmap";
import { buildPracticeHeatmap } from "@/lib/heatmap";
import type { Practice } from "@/lib/practices";
import type { TimeEntry } from "@/lib/types";

const WEEKS = 16;

export function PracticeHeatmapBoard({ practices, entries }: { practices: Practice[]; entries: TimeEntry[] }) {
  if (practices.length === 0) {
    return <p className="text-sm text-muted-foreground">Add a streak to see its heatmap here.</p>;
  }

  return (
    <div className="space-y-3">
      {practices.map((p) => (
        <PracticeHeatmap key={p.id} practice={p} columns={buildPracticeHeatmap(p, entries, WEEKS * 7)} />
      ))}
    </div>
  );
}
