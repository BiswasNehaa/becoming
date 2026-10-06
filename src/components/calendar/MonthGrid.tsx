import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/lib/calendarEvents";
import { todayId } from "@/lib/store";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function dateId(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** A wall-calendar page: big month title, thin ruled grid, tall day cells
 * that show every event written out (nothing hidden behind "+N more"),
 * click a cell to add on that date, click an event to edit it. */
export function MonthGrid({
  events,
  onPickDate,
  onEditEvent,
}: {
  events: CalendarEvent[];
  onPickDate: (date: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
}) {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const today = todayId();

  const { cells, monthName } = useMemo(() => {
    const { year, month } = cursor;
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    while (list.length % 7 !== 0) list.push(null);
    return { cells: list, monthName: new Date(year, month, 1).toLocaleDateString(undefined, { month: "long" }) };
  }, [cursor]);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) map.set(e.date, [...(map.get(e.date) ?? []), e].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? "")));
    return map;
  }, [events]);

  function shift(delta: number) {
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <div>
      <div className="relative mb-6 text-center">
        <h3 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{monthName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{cursor.year}</p>
        <div className="absolute right-0 top-0 flex gap-1.5">
          <Button type="button" variant="outline" size="icon" aria-label="Previous month" onClick={() => shift(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => setCursor({ year: now.getFullYear(), month: now.getMonth() })}>
            Today
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="Next month" onClick={() => shift(1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-l border-t border-foreground/40">
        {WEEKDAYS.map((d) => (
          <div key={d} className="border-b border-r border-foreground/40 py-1.5 text-center text-xs font-semibold tracking-wide">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} className="min-h-20 border-b border-r border-foreground/40 sm:min-h-28" />;
          const id = dateId(cursor.year, cursor.month, day);
          const dayEvents = byDate.get(id) ?? [];
          const isToday = id === today;
          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              aria-label={`Add event on ${id}`}
              onClick={() => onPickDate(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onPickDate(id);
              }}
              className={cn(
                "min-h-20 cursor-pointer border-b border-r border-foreground/40 p-1 transition-colors hover:bg-accent/50 sm:min-h-28 sm:p-1.5",
                isToday && "bg-primary/10",
              )}
            >
              <div className="flex justify-end">
                <span className={cn("grid min-w-5 place-items-center rounded-full px-1 text-[11px] sm:text-xs", isToday ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground")}>
                  {day}
                </span>
              </div>
              <ul className="mt-0.5 space-y-0.5">
                {dayEvents.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEditEvent(e);
                      }}
                      className="block w-full rounded bg-primary/15 px-1 py-0.5 text-left text-[10px] leading-tight text-foreground hover:bg-primary/25 sm:text-[11px]"
                    >
                      {e.time && <span className="text-muted-foreground">{e.time} </span>}
                      {e.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
