import { useMemo, useState } from "react";
import { Flame, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayNavHeader } from "@/components/DayNavHeader";
import { ProgressRing } from "@/components/ProgressRing";
import { InsightBanner } from "@/components/dashboard/InsightBanner";
import { LearningSnapshot } from "@/components/dashboard/LearningSnapshot";
import { NutritionSnapshot } from "@/components/dashboard/NutritionSnapshot";
import { PersonalScoreCard } from "@/components/dashboard/PersonalScoreCard";
import { ReadingSnapshot } from "@/components/dashboard/ReadingSnapshot";
import { ReflectionSnapshot } from "@/components/dashboard/ReflectionSnapshot";
import { TodayFocusList } from "@/components/dashboard/TodayFocusList";
import { TodoList } from "@/components/dashboard/TodoList";
import { WeeklyReportCard } from "@/components/dashboard/WeeklyReportCard";
import { CategoryBreakdown } from "@/components/timelog/CategoryBreakdown";
import { DayTimeline } from "@/components/timelog/DayTimeline";
import { EntryForm } from "@/components/timelog/EntryForm";
import { EntryList } from "@/components/timelog/EntryList";
import { StreakBoard } from "@/components/timelog/StreakBoard";
import { useDayNav } from "@/hooks/useDayNav";
import { usePractices } from "@/hooks/usePractices";
import { CATEGORIES } from "@/lib/categories";
import { practiceToCategory } from "@/lib/practices";
import { computeOverallDayStreak } from "@/lib/streaks";
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

  const practicesDoneToday = practices.filter((p) => dayEntries.some((e) => e.categoryId === p.id)).length;
  const progressPct = practices.length > 0 ? Math.round((practicesDoneToday / practices.length) * 100) : 0;
  const overallStreak = useMemo(() => computeOverallDayStreak(practices.map((p) => p.id), allEntries), [practices, allEntries]);

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
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none lg:col-span-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/60 px-3 py-1 text-xs font-medium">
              <Flame className="size-3.5 text-amber" /> {overallStreak.current}-day <span className="text-muted-foreground">consistency</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/60 px-3 py-1 text-xs font-medium">
              <Trophy className="size-3.5 text-violet" /> {overallStreak.best}-day <span className="text-muted-foreground">best</span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing percent={progressPct} size={104} thickness={11} color="var(--glow)">
              <span className="font-display text-2xl font-bold">{progressPct}%</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold">
                {practicesDoneToday} of {practices.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">practices logged {isToday ? "today" : "that day"}</p>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <InsightBanner practices={practices} entries={allEntries} />
        </div>
      </div>

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
        <CardHeader className="p-0 pb-4">
          <CardTitle className="font-display text-lg font-semibold">Today&rsquo;s focus</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TodayFocusList practices={practices} dayEntries={dayEntries} />
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">To-do</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <TodoList />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <NutritionSnapshot />
        <ReadingSnapshot />
        <LearningSnapshot />
        <ReflectionSnapshot />
      </div>

      <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
        <CardHeader className="p-0">
          <CardTitle className="font-display text-lg font-semibold">Streaks</CardTitle>
          <p className="text-sm text-muted-foreground">Last 21 days, and this week&rsquo;s count &mdash; built from the log, no separate check-in needed.</p>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <StreakBoard entries={allEntries} practices={practices} onAddPractice={addPractice} onRemovePractice={removePractice} />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <WeeklyReportCard practices={practices} entries={allEntries} />
        <PersonalScoreCard practices={practices} entries={allEntries} />
      </div>

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
