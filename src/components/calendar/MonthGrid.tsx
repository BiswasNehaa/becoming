import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/lib/calendarEvents";
import { todayId } from "@/lib/store";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE = 2;

function dateId(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

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

  const { cells, label } = useMemo(() => {
    const { year, month } = cursor;
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    while (list.length % 7 !== 0) list.push(null);
    return { cells: list, label: new Date(year, month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" }) };
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
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{label}</h3>
        <div className="flex gap-1.5">
          <Button type="button" variant="outline" size="icon" aria-label="Previous month" onClick={() => shift(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setCursor({ year: now.getFullYear(), month: now.getMonth() })}>
            Today
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="Next month" onClick={() => shift(1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-line bg-line">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-accent/40 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} className="min-h-16 bg-card/60 sm:min-h-24" />;
          const id = dateId(cursor.year, cursor.month, day);
          const dayEvents = byDate.get(id) ?? [];
          const isToday = id === today;
          return (
            <div key={id} className="min-h-16 bg-card p-1 sm:min-h-24 sm:p-1.5">
              <button
                type="button"
                onClick={() => onPickDate(id)}
                aria-label={`Add event on ${id}`}
                className={cn(
                  "grid size-6 place-items-center rounded-full text-xs font-medium hover:bg-accent",
                  isToday && "bg-primary text-primary-foreground hover:bg-primary",
                )}
              >
                {day}
              </button>
              <ul className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, MAX_VISIBLE).map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => onEditEvent(e)}
                      title={e.time ? `${e.time} · ${e.title}` : e.title}
                      className="block w-full truncate rounded bg-primary/15 px-1 py-0.5 text-left text-[10px] leading-tight text-foreground hover:bg-primary/25 sm:text-[11px]"
                    >
                      {e.time && <span className="hidden text-muted-foreground sm:inline">{e.time} </span>}
                      {e.title}
                    </button>
                  </li>
                ))}
                {dayEvents.length > MAX_VISIBLE && <li className="px-1 text-[10px] text-muted-foreground">+{dayEvents.length - MAX_VISIBLE} more</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
