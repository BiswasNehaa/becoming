import { useState } from "react";
import { GraduationCap, Plus, Salad, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRACTICE_ICON_KEYS, PRACTICE_ICONS, type Practice, type PracticeIconKey } from "@/lib/practices";
import { cn } from "@/lib/utils";

export function PracticeManager({
  practices,
  onAdd,
  onRemove,
  onToggleLearning,
}: {
  practices: Practice[];
  onAdd: (label: string, icon: PracticeIconKey, nutritionLinked?: boolean) => void;
  onRemove: (id: string) => void;
  onToggleLearning: (id: string, value: boolean) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState<PracticeIconKey>("sparkles");
  const [nutritionLinked, setNutritionLinked] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd(label.trim(), icon, nutritionLinked || undefined);
    setLabel("");
    setIcon("sparkles");
    setNutritionLinked(false);
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
            {p.isFocus ? <Star className="size-3 fill-current text-amber" aria-label="Today's focus" /> : null}
            {p.nutritionLinked ? <Salad className="size-3 text-sage" aria-label="Auto-completes from Nutrition" /> : null}
            {p.targetMinutes ? <span className="text-muted-foreground">· {p.targetMinutes}m</span> : null}
            <button
              type="button"
              aria-label={p.countsAsLearning ? `${p.label} counts as learning — click to stop` : `Count ${p.label} as learning too`}
              title={p.countsAsLearning ? "Counts toward Learning too (click to stop)" : "Also count this toward Learning"}
              onClick={() => onToggleLearning(p.id, !p.countsAsLearning)}
              className={cn("grid size-4 place-items-center rounded-full hover:bg-line", p.countsAsLearning ? "text-violet" : "text-muted-foreground/50")}
            >
              <GraduationCap className="size-3" />
            </button>
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
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2 rounded-2xl bg-accent/60 py-1.5 pl-2.5 pr-1.5">
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
          <button
            type="button"
            aria-label="Auto-complete from Nutrition instead of logging time"
            aria-pressed={nutritionLinked}
            onClick={() => setNutritionLinked((v) => !v)}
            className={cn(
              "flex h-6 items-center gap-1 rounded-full px-2 text-[11px] text-muted-foreground hover:bg-line",
              nutritionLinked && "bg-sage/20 text-sage hover:bg-sage/20",
            )}
            title="Auto-complete from Nutrition instead of logging time"
          >
            <Salad className="size-3" /> Nutrition
          </button>
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
