import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TOPIC_GROUPS, TOPIC_STATUSES, type LearningTopic } from "@/lib/learning";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  "not-started": "text-muted-foreground",
  learning: "text-[var(--glow)]",
  completed: "text-[var(--sage)]",
};

export function RoadmapBoard({ topics, onEdit, onDelete }: { topics: LearningTopic[]; onEdit: (t: LearningTopic) => void; onDelete: (id: string) => void }) {
  if (topics.length === 0) {
    return <p className="text-sm text-muted-foreground">No topics yet — add your first one above.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TOPIC_GROUPS.map((group) => {
        const items = topics.filter((t) => t.group === group);
        return (
          <div key={group} className="rounded-2xl bg-accent/40 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</h3>
            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nothing here yet.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((topic) => (
                  <li key={topic.id}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{topic.name}</p>
                      <div className="flex shrink-0 gap-0.5">
                        <Button type="button" variant="ghost" size="icon" aria-label="Edit topic" className="size-6" onClick={() => onEdit(topic)}>
                          <Pencil className="size-3" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" aria-label="Delete topic" className="size-6" onClick={() => onDelete(topic.id)}>
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                    <p className={cn("text-[11px]", STATUS_TONE[topic.status])}>{TOPIC_STATUSES.find((s) => s.id === topic.status)?.label}</p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full bg-glow" style={{ width: `${topic.progressPct}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {topic.progressPct}% · {topic.hoursSpent}h{topic.resources ? ` · ${topic.resources}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
