import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export function ComingSoon({
  icon: Icon,
  eyebrow,
  title,
  description,
  phase,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="subtle-rise space-y-5">
      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Icon className="size-4 text-primary" /> {eyebrow}
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
          <p className="mt-5 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{phase}</p>
        </div>
      </Card>
    </div>
  );
}
