import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PRACTICE_ICONS, type Practice } from "@/lib/practices";

export function QuickAddDialog({ practices, onQuickAdd }: { practices: Practice[]; onQuickAdd: (practiceId: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="size-4" /> Quick add
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Quick add</DialogTitle>
          <DialogDescription>Logs the last 30 minutes as this practice, ending now.</DialogDescription>
        </DialogHeader>
        {practices.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add a streak first to quick-add it here.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {practices.map((p) => {
              const Icon = PRACTICE_ICONS[p.icon];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onQuickAdd(p.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-accent/40 px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent/70"
                >
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in oklab, ${p.color} 15%, transparent)`, color: p.color }}
                  >
                    <Icon className="size-4" />
                  </span>
                  {p.label}
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
