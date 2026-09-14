import { MACRO_STATUS_LABEL, macroStatus, type MacroTotals, type NutritionTargets } from "@/lib/nutrition";
import { cn } from "@/lib/utils";

const ROWS: {
  key: keyof MacroTotals;
  label: string;
  unit: string;
  kind: "ceiling" | "goal";
  color: string;
}[] = [
  { key: "calories", label: "Calories", unit: "kcal", kind: "ceiling", color: "var(--glow)" },
  { key: "proteinG", label: "Protein", unit: "g", kind: "goal", color: "var(--sage)" },
  { key: "carbsG", label: "Carbs", unit: "g", kind: "ceiling", color: "var(--sky)" },
  { key: "fatG", label: "Fat", unit: "g", kind: "ceiling", color: "var(--violet)" },
  { key: "fiberG", label: "Fiber", unit: "g", kind: "goal", color: "var(--amber)" },
];

const STATUS_TONE: Record<string, string> = {
  below: "text-muted-foreground",
  "on-track": "text-foreground",
  "goal-reached": "text-[var(--sage)]",
  above: "text-[var(--amber)]",
};

export function MacroSummary({ totals, targets }: { totals: MacroTotals; targets: NutritionTargets }) {
  return (
    <div className="space-y-4">
      {ROWS.map((row) => {
        const value = totals[row.key];
        const target = targets[row.key];
        const status = macroStatus(value, target, row.kind);
        const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
        return (
          <div key={row.key}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium">{row.label}</span>
              <span className="text-muted-foreground">
                {Math.round(value)} / {target} {row.unit}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-accent">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: row.color }} />
            </div>
            <p className={cn("mt-1 text-xs", STATUS_TONE[status])}>{MACRO_STATUS_LABEL[status]}</p>
          </div>
        );
      })}
    </div>
  );
}
