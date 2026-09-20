import { useMemo, useState } from "react";
import { Flame, Target, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayNavHeader } from "@/components/DayNavHeader";
import { HeaderSlot } from "@/components/HeaderSlot";
import { ProgressRing } from "@/components/ProgressRing";
import { InsightBanner } from "@/components/dashboard/InsightBanner";
import { LearningSnapshot } from "@/components/dashboard/LearningSnapshot";
import { NutritionSnapshot } from "@/components/dashboard/NutritionSnapshot";
import { PersonalScoreCard } from "@/components/dashboard/PersonalScoreCard";
import { QuickAddDialog } from "@/components/dashboard/QuickAddDialog";
import { ReadingSnapshot } from "@/components/dashboard/ReadingSnapshot";
import { ReflectionSnapshot } from "@/components/dashboard/ReflectionSnapshot";
import { focusStatus, TodayFocusList } from "@/components/dashboard/TodayFocusList";
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
import { makeId, todayId, useCollection } from "@/lib/store";
import { formatDuration, unaccountedMinutes } from "@/lib/timeMath";
import type { TimeEntry } from "@/lib/types";

function progressStatus(pct: number): { label: string; tone: string } {
  if (pct >= 70) return { label: "on rhythm", tone: "bg-[var(--sage)]/15 text-[var(--sage)]" };
  if (pct > 0) return { label: "building momentum", tone: "bg-[var(--sky)]/15 text-[var(--sky)]" };
  return { label: "not started", tone: "bg-accent text-muted-foreground" };
}

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
  const focusDoneToday = practices.filter((p) => {
    const minutes = dayEntries.filter((e) => e.categoryId === p.id).reduce((sum, e) => sum + Math.max(0, e.endMin - e.startMin), 0);
    return focusStatus(minutes, p.targetMinutes).label === "complete" || (!p.targetMinutes && minutes > 0);
  }).length;
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

  function quickAdd(practiceId: string) {
    const now = new Date();
    const end = now.getHours() * 60 + now.getMinutes();
    const start = Math.max(0, end - 30);
    saveEntry({ id: makeId(), date: todayId(), startMin: start, endMin: end, categoryId: practiceId });
  }

  const status = progressStatus(progressPct);

  return (
    <div className="subtle-rise space-y-5">
      <HeaderSlot>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/60 px-3 py-2 text-sm font-medium">
          <Flame className="size-4 text-amber" /> {overallStreak.current}-day <span className="hidden text-muted-foreground sm:inline">consistency</span>
        </span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent/60 px-3 py-2 text-sm font-medium">
          <Trophy className="size-4 text-violet" /> {overallStreak.best}-day <span className="hidden text-muted-foreground md:inline">best</span>
        </span>
        <QuickAddDialog practices={practices} onQuickAdd={quickAdd} />
      </HeaderSlot>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Daily progress</p>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.tone}`}>{status.label}</span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <ProgressRing percent={progressPct} size={132} thickness={14} color="var(--glow)">
              <span className="font-display text-3xl font-bold">{progressPct}%</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold">
                {practicesDoneToday} of {practices.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {practices.length === 0
                  ? "Add a streak to track"
                  : practicesDoneToday === practices.length
                    ? `All planned practices logged ${isToday ? "today" : "that day"}.`
                    : `practices logged ${isToday ? "today" : "that day"}`}
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <span className="text-xs text-muted-foreground">Progress, not perfection</span>
            <Target className="size-4 text-primary" />
          </div>
        </Card>

        <div className="lg:col-span-3">
          <InsightBanner practices={practices} entries={allEntries} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
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
              onAddCategory={(label) => practiceToCategory(addPractice(label, "sparkles"))}
            />
          </CardContent>
        </Card>
      </div>

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

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="glass-panel rounded-3xl border-0 p-6 shadow-none sm:p-8">
          <CardHeader className="flex-row items-center justify-between p-0 pb-4 space-y-0">
            <CardTitle className="font-display text-lg font-semibold">Today&rsquo;s focus</CardTitle>
            <span className="text-xs text-muted-foreground">
              Scheduled {practices.length} &middot; Done {focusDoneToday}
            </span>
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
      </div>

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
    </div>
  );
}
