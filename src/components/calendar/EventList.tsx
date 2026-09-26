import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { todayId } from "@/lib/store";
import type { CalendarEvent } from "@/lib/calendarEvents";
import { cn } from "@/lib/utils";

function formatDate(dateId: string): string {
  return new Date(`${dateId}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function EventList({ events, onEdit, onDelete }: { events: CalendarEvent[]; onEdit: (event: CalendarEvent) => void; onDelete: (id: string) => void }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing on the calendar yet — add what&rsquo;s coming up above.</p>;
  }

  const today = todayId();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ul className="divide-y divide-line">
      {sorted.map((event) => {
        const isPast = event.date < today;
        const isToday = event.date === today;
        return (
          <li key={event.id} className={cn("flex items-center gap-3 py-2.5", isPast && "opacity-50")}>
            <div className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
              {isToday ? <span className="text-primary">Today</span> : formatDate(event.date)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{event.title}</p>
              {(event.time || event.notes) && (
                <p className="truncate text-xs text-muted-foreground">
                  {event.time}
                  {event.time && event.notes ? " · " : ""}
                  {event.notes}
                </p>
              )}
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Edit event" onClick={() => onEdit(event)}>
              <Pencil className="size-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Delete event" onClick={() => onDelete(event.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
