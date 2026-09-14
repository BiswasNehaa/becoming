import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CHECK_ITEMS, MOODS, type DailyReflection } from "@/lib/reflections";
import { cn } from "@/lib/utils";

export function ReflectionForm({ reflection, onSave }: { reflection: DailyReflection; onSave: (r: DailyReflection) => void }) {
  const [draft, setDraft] = useState(reflection);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setDraft(reflection);
    setSavedAt(null);
  }, [reflection]);

  function save(next: DailyReflection) {
    setDraft(next);
    onSave(next);
    setSavedAt(Date.now());
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">How did today feel?</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <Button
              key={m.id}
              type="button"
              variant="outline"
              className={cn("h-10 rounded-xl border-line bg-accent/40 px-3 text-xs", draft.mood === m.id && "border-primary bg-primary/10 text-primary")}
              onClick={() => save({ ...draft, mood: m.id })}
            >
              <span className="mr-1">{m.emoji}</span> {m.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Quick check-in</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {CHECK_ITEMS.map((item) => {
            const done = !!draft.checks[item.id];
            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                onClick={() => save({ ...draft, checks: { ...draft.checks, [item.id]: !done } })}
                className="h-auto justify-start rounded-xl bg-accent/40 px-3 py-2.5 text-left text-sm hover:bg-accent/70"
              >
                <span
                  className={cn(
                    "mr-2 grid size-5 shrink-0 place-items-center rounded-full border",
                    done ? "border-primary bg-primary text-primary-foreground" : "border-line text-transparent",
                  )}
                >
                  <Check className="size-3" />
                </span>
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <p className="mb-1.5 text-xs uppercase tracking-widest text-muted-foreground">What was one thing you learned today?</p>
        <Textarea
          value={draft.learned}
          onChange={(e) => setDraft((d) => ({ ...d, learned: e.target.value }))}
          onBlur={() => save(draft)}
          placeholder="A concept, an idea, a small realization…"
          className="min-h-24"
        />
      </label>

      <label className="block">
        <p className="mb-1.5 text-xs uppercase tracking-widest text-muted-foreground">What&rsquo;s one thing to improve tomorrow?</p>
        <Textarea
          value={draft.improveTomorrow}
          onChange={(e) => setDraft((d) => ({ ...d, improveTomorrow: e.target.value }))}
          onBlur={() => save(draft)}
          placeholder="Keep it small enough to actually do."
          className="min-h-24"
        />
      </label>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={() => save(draft)}>
          Save reflection
        </Button>
        {savedAt && <span className="text-xs text-muted-foreground">Saved.</span>}
      </div>
    </div>
  );
}
