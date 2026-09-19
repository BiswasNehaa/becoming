import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayNavHeader } from "@/components/DayNavHeader";
import { CategoryBreakdown } from "@/components/timelog/CategoryBreakdown";
import { DayTimeline } from "@/components/timelog/DayTimeline";
import { EntryForm } from "@/components/timelog/EntryForm";
import { EntryList } from "@/components/timelog/EntryList";
import { StreakBoard } from "@/components/timelog/StreakBoard";
import { useDayNav } from "@/hooks/useDayNav";
import { usePractices } from "@/hooks/usePractices";
import { CATEGORIES } from "@/lib/categories";
import { practiceToCategory } from "@/lib/practices";
import { useCollection } from "@/lib/store";
import { formatDuration, unaccountedMinutes } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

export function Dashboard() {
  const { viewDate, isToday, label, goPrev, goNext, goToday } = useDayNav();
  const { items: allEntries, setItems: setAllEntries, loading } = useCollection<TimeEntry>("time_entries");
  const { practices, addPractice, removePractice } = usePractices();
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const allCategories = useMemo(() => [...CATEGORIES, ...practices.map(practiceToCategory)], [practices]);
  const dayEntries = useMemo(() => allEntries.filter((e) => e.date === viewDate), [allEntries, viewDate]);
  const unaccounted = unaccountedMinutes(dayEntries);

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
        <DayNavHeader label={label} isToday={isToday} onPrev={goPrev} onNext={goNext} onToday={goToday} />

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <DayTimeline entries={dayEntries} categories={allCategories} />
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
          <StreakBoard entries={allEntries} practices={practices} onAddPractice={addPractice} onRemovePractice={removePractice} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">{editingEntry ? "Edit entry" : "Log a block of time"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <EntryForm
            date={viewDate}
            existingEntries={dayEntries}
            editingEntry={editingEntry}
            categories={allCategories}
            onSave={saveEntry}
            onCancelEdit={() => setEditingEntry(null)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
          <CardHeader className="p-0">
            <CardTitle className="font-display text-lg font-semibold">Entries</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <EntryList entries={dayEntries} categories={allCategories} onEdit={setEditingEntry} onDelete={deleteEntry} />
          </CardContent>
        </Card>

        <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
          <CardHeader className="p-0">
            <CardTitle className="font-display text-lg font-semibold">Where the time went</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <CategoryBreakdown entries={dayEntries} categories={allCategories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
