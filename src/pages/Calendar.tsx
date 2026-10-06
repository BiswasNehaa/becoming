import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SyncErrorBanner } from "@/components/SyncErrorBanner";
import { EventForm } from "@/components/calendar/EventForm";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { EventList } from "@/components/calendar/EventList";
import type { CalendarEvent } from "@/lib/calendarEvents";
import { todayId, useCollection } from "@/lib/store";

export function Calendar() {
  const { items: events, setItems: setEvents, loading, syncError } = useCollection<CalendarEvent>("calendar_events");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  // Date the pop-up is adding to; null means no "add" pop-up is open.
  const [addDate, setAddDate] = useState<string | null>(null);

  const dialogOpen = editingEvent !== null || addDate !== null;

  function closeDialog() {
    setEditingEvent(null);
    setAddDate(null);
  }

  function saveEvent(event: CalendarEvent) {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id);
      return exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event];
    });
    closeDialog();
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (editingEvent?.id === id) closeDialog();
  }

  return (
    <div className="subtle-rise space-y-5">
      <SyncErrorBanner error={syncError} />

      <Card className="glass-panel rounded-3xl border-0 p-4 shadow-none sm:p-8">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <MonthGrid events={events} onPickDate={setAddDate} onEditEvent={setEditingEvent} />
            <p className="mt-3 text-center text-xs text-muted-foreground">Click any date to add something. It&rsquo;ll also show up in that day&rsquo;s to-do.</p>
          </>
        )}
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="flex-row items-center justify-between space-y-0 p-0">
          <CardTitle className="font-display text-lg font-semibold">All events</CardTitle>
          <Button type="button" size="sm" onClick={() => setAddDate(todayId())}>
            <Plus className="size-4" /> Add event
          </Button>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : <EventList events={events} onEdit={setEditingEvent} onDelete={deleteEvent} />}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit event" : "Add an event"}</DialogTitle>
            <DialogDescription>Meetings, deadlines, anything date-specific.</DialogDescription>
          </DialogHeader>
          <EventForm key={editingEvent?.id ?? addDate ?? "closed"} editingEvent={editingEvent} presetDate={addDate ?? undefined} onSave={saveEvent} onCancelEdit={closeDialog} />
          {editingEvent && (
            <Button type="button" variant="ghost" className="justify-self-start text-destructive" onClick={() => deleteEvent(editingEvent.id)}>
              Delete this event
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
