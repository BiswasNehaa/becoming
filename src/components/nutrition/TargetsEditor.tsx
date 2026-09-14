import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NutritionTargets } from "@/lib/nutrition";

export function TargetsEditor({ targets, onSave }: { targets: NutritionTargets; onSave: (t: NutritionTargets) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(targets);

  if (!editing) {
    return (
      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => { setDraft(targets); setEditing(true); }}>
        <Pencil className="size-3.5" /> Edit targets
      </Button>
    );
  }

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
        setEditing(false);
      }}
    >
      {(
        [
          ["calories", "Calories"],
          ["proteinG", "Protein g"],
          ["carbsG", "Carbs g"],
          ["fatG", "Fat g"],
          ["fiberG", "Fiber g"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</label>
          <Input
            type="number"
            min="0"
            inputMode="numeric"
            value={draft[key]}
            onChange={(e) => setDraft((d) => ({ ...d, [key]: Number(e.target.value) || 0 }))}
            className="w-20"
          />
        </div>
      ))}
      <Button type="submit" size="sm">
        Save
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
        Cancel
      </Button>
    </form>
  );
}
