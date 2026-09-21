import { AlertTriangle } from "lucide-react";

/** Surfaces a save failure that would otherwise be silent — the UI updates
 * optimistically the moment you act, so without this, a failed save just
 * looks like it worked until the data isn't there on the next reload. */
export function SyncErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
      <AlertTriangle className="size-4 shrink-0" />
      <span>{error} Your other data is fine — this only affects what you just tried to save.</span>
    </div>
  );
}
