import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBreakdown } from "@/components/timelog/CategoryBreakdown";
import { DayTimeline } from "@/components/timelog/DayTimeline";
import { EntryForm } from "@/components/timelog/EntryForm";
import { EntryList } from "@/components/timelog/EntryList";
import { StreakBoard } from "@/components/timelog/StreakBoard";
import { todayId, useCollection } from "@/lib/store";
import { formatDuration, unaccountedMinutes } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

function shiftDate(dateId: string, days: number): string {
  const d = new Date(`${dateId}T00:00:00`);
  d.setDate(d.getDate() + days);
  return todayId(d);
}

function formatDateLabel(dateId: string): string {
  const d = new Date(`${dateId}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function Dashboard() {
  const [viewDate, setViewDate] = useState(todayId());
  const { items: allEntries, setItems: setAllEntries, loading } = useCollection<TimeEntry>("time_entries");
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const dayEntries = useMemo(() => allEntries.filter((e) => e.date === viewDate), [allEntries, viewDate]);
  const unaccounted = unaccountedMinutes(dayEntries);
  const isToday = viewDate === todayId();

  function saveEntry(entry: TimeEntry) {
    setAllEntries((prev) => {
      const exists = prev.some((e) => e.id === entry.id);
      return exists ? prev.map((e) => (e.id === entry.id ? entry : e)) : [...prev, entry];
    });
    setEditingEntry(null);
  }

  function deleteEntry(id: string) {
    setAllEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingEntry?.id === id) setEditingEntry(null);
  }

  return (
    <div className="subtle-rise space-y-5">
      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{isToday ? "Today" : "Viewing"}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">{formatDateLabel(viewDate)}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Previous day" onClick={() => setViewDate((d) => shiftDate(d, -1))}>
              <ChevronLeft className="size-4" />
            </Button>
            {!isToday && (
              <Button variant="outline" size="sm" onClick={() => setViewDate(todayId())}>
                Today
              </Button>
            )}
            <Button variant="outline" size="icon" aria-label="Next day" onClick={() => setViewDate((d) => shiftDate(d, 1))}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <DayTimeline entries={dayEntries} />
            <p className="mt-3 text-sm text-muted-foreground">
              {unaccounted > 0 ? (
                <>
                  <span className="font-medium text-foreground">{formatDuration(unaccounted)}</span> unaccounted so far
                  {isToday ? " today" : ""}.
                </>
              ) : (
                "The whole day is accounted for."
              )}
            </p>
          </>
        )}
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Streaks</CardTitle>
          <p className="text-sm text-muted-foreground">Last 21 days, and this week&rsquo;s count &mdash; built from the log, no separate check-in needed.</p>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <StreakBoard entries={allEntries} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">{editingEntry ? "Edit entry" : "Log a block of time"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <EntryForm date={viewDate} existingEntries={dayEntries} editingEntry={editingEntry} onSave={saveEntry} onCancelEdit={() => setEditingEntry(null)} />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
          <CardHeader className="p-0">
            <CardTitle className="font-display text-lg font-semibold">Entries</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <EntryList entries={dayEntries} onEdit={setEditingEntry} onDelete={deleteEntry} />
          </CardContent>
        </Card>

        <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
          <CardHeader className="p-0">
            <CardTitle className="font-display text-lg font-semibold">Where the time went</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <CategoryBreakdown entries={dayEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
