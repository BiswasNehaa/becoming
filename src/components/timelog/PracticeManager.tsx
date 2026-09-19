import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRACTICE_ICON_KEYS, PRACTICE_ICONS, type Practice, type PracticeIconKey } from "@/lib/practices";
import { cn } from "@/lib/utils";

export function PracticeManager({
  practices,
  onAdd,
  onRemove,
}: {
  practices: Practice[];
  onAdd: (label: string, icon: PracticeIconKey) => void;
  onRemove: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState<PracticeIconKey>("sparkles");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd(label.trim(), icon);
    setLabel("");
    setIcon("sparkles");
    setAdding(false);
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {practices.map((p) => {
        const Icon = PRACTICE_ICONS[p.icon];
        return (
          <span key={p.id} className="inline-flex items-center gap-1.5 rounded-full bg-accent/60 py-1 pl-2.5 pr-1.5 text-xs">
            <Icon className="size-3.5" style={{ color: p.color }} />
            {p.label}
            <button
              type="button"
              aria-label={`Remove ${p.label} from your streaks`}
              onClick={() => onRemove(p.id)}
              className="grid size-4 place-items-center rounded-full text-muted-foreground hover:bg-line hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        );
      })}

      {adding ? (
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2 rounded-full bg-accent/60 py-1 pl-2.5 pr-1.5">
          <Input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Running"
            className="h-6 w-28 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0"
          />
          <div className="flex gap-0.5">
            {PRACTICE_ICON_KEYS.map((key) => {
              const Icon = PRACTICE_ICONS[key];
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={key}
                  onClick={() => setIcon(key)}
                  className={cn("grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-line", icon === key && "bg-primary text-primary-foreground hover:bg-primary")}
                >
                  <Icon className="size-3.5" />
                </button>
              );
            })}
          </div>
          <Button type="submit" size="sm" className="h-6 rounded-full px-2.5 text-xs">
            Add
          </Button>
          <button type="button" aria-label="Cancel" onClick={() => setAdding(false)} className="grid size-5 place-items-center rounded-full text-muted-foreground hover:bg-line">
            <X className="size-3" />
          </button>
        </form>
      ) : (
        <Button type="button" variant="outline" size="sm" className="h-7 rounded-full border-dashed text-xs" onClick={() => setAdding(true)}>
          <Plus className="size-3.5" /> Add a streak
        </Button>
      )}
    </div>
  );
}
