import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cutoffDate, pruneOldData, scanPrunableData, type PruneScan } from "@/lib/dataPruning";

function formatCutoff(dateId: string): string {
  return new Date(`${dateId}T00:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export function DataCleanupCard() {
  const [scan, setScan] = useState<PruneScan[] | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pruning, setPruning] = useState(false);
  const [removedCount, setRemovedCount] = useState<number | null>(null);

  useEffect(() => {
    scanPrunableData().then(setScan);
  }, []);

  const totalOld = scan?.reduce((sum, s) => sum + s.oldCount, 0) ?? 0;

  async function handleConfirm() {
    setPruning(true);
    const removed = await pruneOldData();
    setPruning(false);
    setConfirming(false);
    setRemovedCount(removed);
    scanPrunableData().then(setScan);
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Keeps daily logs (time, nutrition, reflections) for the last 60 days — plenty for month-over-month comparisons, and keeps things light on the free tier.
        Practices, books, and learning topics are never touched, only their day-by-day log entries.
      </p>

      {removedCount !== null ? (
        <p className="mt-3 text-sm text-sage">Removed {removedCount} old log {removedCount === 1 ? "entry" : "entries"}.</p>
      ) : scan === null ? (
        <p className="mt-3 text-sm text-muted-foreground">Checking…</p>
      ) : totalOld === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Nothing older than {formatCutoff(cutoffDate())} — nothing to clean up.</p>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-sm">
            <span className="font-semibold">{totalOld}</span> log {totalOld === 1 ? "entry is" : "entries are"} older than {formatCutoff(cutoffDate())}.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => setConfirming(true)}>
            <Trash2 className="size-3.5" /> Clean up
          </Button>
        </div>
      )}

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete {totalOld} old log entries?</DialogTitle>
            <DialogDescription>
              Everything logged before {formatCutoff(cutoffDate())} across time entries, nutrition, and reflections will be permanently deleted. This can&rsquo;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setConfirming(false)} disabled={pruning}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirm} disabled={pruning}>
              {pruning ? "Deleting…" : "Delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
