import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DayNavHeader({
  label,
  isToday,
  onPrev,
  onNext,
  onToday,
}: {
  label: string;
  isToday: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{isToday ? "Today" : "Viewing"}</p>
        <h2 className="mt-1 font-display text-2xl font-semibold">{label}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" aria-label="Previous day" onClick={onPrev}>
          <ChevronLeft className="size-4" />
        </Button>
        {!isToday && (
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
        )}
        <Button variant="outline" size="icon" aria-label="Next day" onClick={onNext}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
