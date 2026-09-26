import type { Movement } from "@/lib/analysis";

export function MovementSummary({ improving, lagging }: { improving: Movement[]; lagging: Movement[] }) {
  if (improving.length === 0 && lagging.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing shifted much this period — steady across the board.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {improving.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Doing really well</p>
          <ul className="mt-1.5 space-y-1">
            {improving.map((m) => (
              <li key={m.label} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{m.label}</span> &mdash; {m.detail}
              </li>
            ))}
          </ul>
        </div>
      )}
      {lagging.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Room to grow</p>
          <ul className="mt-1.5 space-y-1">
            {lagging.map((m) => (
              <li key={m.label} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{m.label}</span> &mdash; {m.detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
