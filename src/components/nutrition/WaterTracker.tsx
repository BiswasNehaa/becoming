import { useState } from "react";
import { Droplet, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makeId } from "@/lib/store";
import { totalWaterMl, type WaterEntry } from "@/lib/nutrition";

const QUICK_ADDS = [
  { label: "Glass", ml: 250 },
  { label: "Bottle", ml: 500 },
];

export function WaterTracker({
  date,
  entries,
  targetMl,
  onAdd,
  onRemove,
}: {
  date: string;
  entries: WaterEntry[];
  targetMl: number;
  onAdd: (entry: WaterEntry) => void;
  onRemove: (id: string) => void;
}) {
  const [customMl, setCustomMl] = useState("");
  const total = totalWaterMl(entries);
  const pct = targetMl > 0 ? Math.min(100, Math.round((total / targetMl) * 100)) : 0;

  function add(ml: number) {
    if (ml <= 0) return;
    onAdd({ id: makeId(), date, ml });
  }

  return (
    <div className="border-t border-line pt-4">
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <Droplet className="size-3.5 text-sky" /> Water
        </span>
        <span className="text-muted-foreground">
          {total} / {targetMl} ml
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-accent">
        <div className="h-full rounded-full bg-sky transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {QUICK_ADDS.map((q) => (
          <Button key={q.label} type="button" variant="outline" size="sm" className="h-7 rounded-full text-xs" onClick={() => add(q.ml)}>
            <Plus className="size-3.5" /> {q.label} ({q.ml}ml)
          </Button>
        ))}
        <Input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={customMl}
          onChange={(e) => setCustomMl(e.target.value)}
          placeholder="ml"
          className="h-7 w-20 text-xs"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-full text-xs"
          onClick={() => {
            add(Number(customMl) || 0);
            setCustomMl("");
          }}
        >
          Add
        </Button>
      </div>

      {entries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entries.map((e) => (
            <span key={e.id} className="inline-flex items-center gap-1 rounded-full bg-accent/60 py-0.5 pl-2 pr-1 text-[11px] text-muted-foreground">
              {e.ml}ml
              <button type="button" aria-label={`Remove ${e.ml}ml water entry`} onClick={() => onRemove(e.id)} className="grid size-3.5 place-items-center rounded-full hover:bg-line hover:text-foreground">
                <X className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
