import { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRACTICE_ICONS, type Practice } from "@/lib/practices";
import { formatDuration } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

const SOMETHING_NEW = "__something_new__";

export function focusStatus(minutes: number, targetMinutes?: number): { label: string; tone: string } {
  if (!targetMinutes) {
    return minutes > 0 ? { label: "logged", tone: "text-[var(--sage)]" } : { label: "not started", tone: "text-muted-foreground" };
  }
  if (minutes >= targetMinutes) return { label: "complete", tone: "text-[var(--sage)]" };
  if (minutes > 0) return { label: `${formatDuration(targetMinutes - minutes)} to go`, tone: "text-[var(--amber)]" };
  return { label: "not started", tone: "text-muted-foreground" };
}

export function TodayFocusList({
  practices,
  dayEntries,
  onSetFocus,
  onUnsetFocus,
  onCreateFocus,
}: {
  practices: Practice[];
  dayEntries: TimeEntry[];
  onSetFocus: (id: string, targetMinutes?: number) => void;
  onUnsetFocus: (id: string) => void;
  onCreateFocus: (label: string, targetMinutes?: number) => void;
}) {
  const focusItems = practices.filter((p) => p.isFocus);
  const candidates = practices.filter((p) => !p.isFocus);

  const [adding, setAdding] = useState(false);
  const [pickId, setPickId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [pickMinutes, setPickMinutes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState("");

  const creatingNew = pickId === SOMETHING_NEW || candidates.length === 0;

  function startAdd() {
    setPickId(candidates.length > 0 ? candidates[0].id : SOMETHING_NEW);
    setNewLabel("");
    setPickMinutes("");
    setAdding(true);
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    if (creatingNew) {
      if (!newLabel.trim()) return;
      onCreateFocus(newLabel.trim(), pickMinutes.trim() ? Number(pickMinutes) : undefined);
    } else {
      if (!pickId) return;
      onSetFocus(pickId, pickMinutes.trim() ? Number(pickMinutes) : undefined);
    }
    setAdding(false);
  }

  function startEdit(p: Practice) {
    setEditingId(p.id);
    setEditMinutes(p.targetMinutes ? String(p.targetMinutes) : "");
  }

  function submitEdit(e: React.FormEvent, id: string) {
    e.preventDefault();
    onSetFocus(id, editMinutes.trim() ? Number(editMinutes) : undefined);
    setEditingId(null);
  }

  return (
    <div className="grid gap-2">
      {focusItems.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">
          Pick what to focus on today — an existing streak, or something one-off that doesn&rsquo;t need to become a habit.
        </p>
      )}

      {focusItems.map((p) => {
        const minutes = dayEntries.filter((e) => e.categoryId === p.id).reduce((sum, e) => sum + Math.max(0, e.endMin - e.startMin), 0);
        const status = focusStatus(minutes, p.targetMinutes);
        const done = status.label === "complete" || (!p.targetMinutes && minutes > 0);
        const Icon = PRACTICE_ICONS[p.icon];
        const isEditing = editingId === p.id;

        if (isEditing) {
          return (
            <form key={p.id} onSubmit={(e) => submitEdit(e, p.id)} className="flex items-center gap-2 rounded-2xl bg-accent/25 px-4 py-3">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.label}</span>
              <Input
                autoFocus
                type="number"
                min="0"
                inputMode="numeric"
                value={editMinutes}
                onChange={(e) => setEditMinutes(e.target.value)}
                placeholder="minutes"
                className="h-8 w-24 text-xs"
              />
              <Button type="submit" size="sm" className="h-8 text-xs">
                Save
              </Button>
              <button type="button" aria-label="Cancel" onClick={() => setEditingId(null)} className="grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-line">
                <X className="size-3.5" />
              </button>
            </form>
          );
        }

        return (
          <div key={p.id} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3", done ? "bg-accent/50" : "bg-accent/25")}>
            <span
              className="grid size-9 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `color-mix(in oklab, ${p.color} 15%, transparent)`, color: p.color }}
            >
              {done ? <Check className="size-4" /> : <Icon className="size-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate text-sm font-semibold", !done && "text-muted-foreground")}>{p.label}</span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {minutes > 0 ? formatDuration(minutes) : "0m"}
                {p.targetMinutes ? ` · ${p.targetMinutes}m target` : ""}
              </span>
            </span>
            <span className={cn("shrink-0 text-xs font-medium", status.tone)}>{status.label}</span>
            <button type="button" aria-label={`Edit ${p.label}'s focus target`} onClick={() => startEdit(p)} className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-line">
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={`Remove ${p.label} from today's focus`}
              onClick={() => onUnsetFocus(p.id)}
              className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-line"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}

      {adding ? (
        <form onSubmit={submitAdd} className="flex flex-wrap items-center gap-2 rounded-2xl bg-accent/25 px-4 py-3">
          {candidates.length > 0 ? (
            creatingNew ? (
              <Input
                autoFocus
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Learn chess (just today)"
                className="h-8 min-w-40 flex-1 text-xs"
              />
            ) : (
              <Select value={pickId} onValueChange={setPickId}>
                <SelectTrigger className="h-8 min-w-32 flex-1">
                  <SelectValue>{candidates.find((c) => c.id === pickId)?.label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectItem value={SOMETHING_NEW} className="text-primary">
                    <Plus className="size-3.5" /> Something new, just for today
                  </SelectItem>
                </SelectContent>
              </Select>
            )
          ) : (
            <Input
              autoFocus
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="What's today's focus?"
              className="h-8 min-w-40 flex-1 text-xs"
            />
          )}
          <Input
            type="number"
            min="0"
            inputMode="numeric"
            value={pickMinutes}
            onChange={(e) => setPickMinutes(e.target.value)}
            placeholder="minutes (optional)"
            className="h-8 w-36 text-xs"
          />
          <Button type="submit" size="sm" className="h-8 text-xs">
            Set focus
          </Button>
          <button type="button" aria-label="Cancel" onClick={() => setAdding(false)} className="grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-line">
            <X className="size-3.5" />
          </button>
        </form>
      ) : (
        <Button type="button" variant="outline" size="sm" className="w-fit rounded-full border-dashed text-xs" onClick={startAdd}>
          <Plus className="size-3.5" /> {focusItems.length === 0 ? "Set today's focus" : "Add another focus"}
        </Button>
      )}
    </div>
  );
}
