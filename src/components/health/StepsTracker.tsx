import { useEffect, useState } from "react";
import { Footprints, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StepsTracker({ steps, targetSteps, onSave }: { steps: number; targetSteps: number; onSave: (steps: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(steps));

  useEffect(() => {
    setDraft(String(steps));
  }, [steps]);

  const pct = targetSteps > 0 ? Math.min(100, Math.round((steps / targetSteps) * 100)) : 0;

  if (editing) {
    return (
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(Number(draft) || 0);
          setEditing(false);
        }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Steps today</label>
          <Input autoFocus type="number" min="0" inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} className="w-28" />
        </div>
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </form>
    );
  }

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <Footprints className="size-3.5 text-violet" /> Steps
        </span>
        <span className="text-muted-foreground">
          {steps.toLocaleString()} / {targetSteps.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-accent">
        <div className="h-full rounded-full bg-violet transition-all" style={{ width: `${pct}%` }} />
      </div>
      <Button type="button" variant="ghost" size="sm" className="mt-1.5 h-7 px-1 text-xs text-muted-foreground" onClick={() => setEditing(true)}>
        <Pencil className="size-3" /> {steps > 0 ? "Update" : "Log steps"}
      </Button>
    </div>
  );
}
