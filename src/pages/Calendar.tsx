import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/calendar/EventForm";
import { EventList } from "@/components/calendar/EventList";
import type { CalendarEvent } from "@/lib/calendarEvents";
import { useCollection } from "@/lib/store";

export function Calendar() {
  const { items: events, setItems: setEvents, loading } = useCollection<CalendarEvent>("calendar_events");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  function saveEvent(event: CalendarEvent) {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      return exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event];
    });
    setEditingEvent(null);
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (editingEvent?.id === id) setEditingEvent(null);
  }

  return (
    <div className="subtle-rise space-y-5">
      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">{editingEvent ? "Edit event" : "Add an event"}</CardTitle>
          <p className="text-sm text-muted-foreground">Meetings, deadlines, anything date-specific — it&rsquo;ll show up in that day&rsquo;s to-do too.</p>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <EventForm editingEvent={editingEvent} onSave={saveEvent} onCancelEdit={() => setEditingEvent(null)} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Upcoming</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : <EventList events={events} onEdit={setEditingEvent} onDelete={deleteEvent} />}
        </CardContent>
      </Card>
    </div>
  );
}
